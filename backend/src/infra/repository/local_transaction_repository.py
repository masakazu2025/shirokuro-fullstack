from __future__ import annotations

import io
import json
import re
from pathlib import Path

import pandas as pd

from domain.transaction.transaction import Transaction, TransactionFile, FileContent, FileConfig, Section
from infra.processor.registry import get_processor
from usecase.transaction.port import TransactionRepository

_BINARY_PROBE_SIZE = 512


def _is_binary(path: Path) -> bool:
    try:
        chunk = path.read_bytes()[:_BINARY_PROBE_SIZE]
        return b"\x00" in chunk
    except OSError:
        return False


def _decode(raw: bytes, encoding: str) -> tuple[str, bool]:
    """指定エンコードでデコード。失敗時は errors='replace' にフォールバック。
    戻り値: (text, had_error)"""
    try:
        return raw.decode(encoding, errors="strict"), False
    except (UnicodeDecodeError, LookupError):
        return raw.decode(encoding, errors="replace"), True


def _read_text(path: Path, file_configs: list[FileConfig]) -> tuple[str, list[str]]:
    """テキストとして読む。エンコード戦略を適用。
    戻り値: (text, warnings)"""
    raw = path.read_bytes()
    filename = path.name
    warnings: list[str] = []

    # config に指定があればそのエンコードのみ
    for fc in file_configs:
        if fc.matches(filename) and fc.encoding:
            text, had_error = _decode(raw, fc.encoding)
            if had_error:
                warnings.append(f"encoding error: decoded with {fc.encoding} using replacement characters")
            return text, warnings

    # config 指定なし: CP932 → UTF-8 → CP932(replace)
    text, had_error = _decode(raw, "cp932")
    if not had_error:
        return text, warnings

    text, had_error = _decode(raw, "utf-8")
    if not had_error:
        return text, warnings

    text, _ = _decode(raw, "cp932")
    warnings.append("encoding error: decoded with cp932 using replacement characters")
    return text, warnings


_CSV_EXTENSIONS  = {".csv"}
_JSON_EXTENSIONS = {".json"}


def _parse_as_csv(text: str) -> tuple[list[dict], list[str]]:
    """テキストを CSV としてパース。戻り値: (rows, warnings)"""
    warnings: list[str] = []
    try:
        df = pd.read_csv(io.StringIO(text), header=None, dtype=str)
        df.columns = [f"col_{i}" for i in range(len(df.columns))]
        return df.to_dict(orient="records"), warnings
    except Exception as e:
        warnings.append(f"csv parse error: {e}")
        return [], warnings


def _parse_as_json(text: str) -> tuple[dict | list | None, list[str]]:
    """テキストを JSON としてパース。戻り値: (value, warnings)"""
    warnings: list[str] = []
    try:
        return json.loads(text), warnings
    except json.JSONDecodeError as e:
        warnings.append(f"json parse error: {e}")
        return None, warnings


def _build_section(filename: str, text: str) -> tuple[Section, list[str]]:
    """拡張子に基づいて Section を生成。パース失敗時は type='text' にフォールバック。"""
    suffix = Path(filename).suffix.lower()
    warnings: list[str] = []

    if suffix in _CSV_EXTENSIONS:
        rows, w = _parse_as_csv(text)
        warnings.extend(w)
        if not w:
            return Section(name="section_1", label="セクション1", type="csv", value=rows), warnings
        return Section(name="section_1", label="セクション1", type="text", value=text), warnings

    if suffix in _JSON_EXTENSIONS:
        value, w = _parse_as_json(text)
        warnings.extend(w)
        if not w:
            return Section(name="section_1", label="セクション1", type="json", value=value), warnings
        return Section(name="section_1", label="セクション1", type="text", value=text), warnings

    return Section(name="section_1", label="セクション1", type="text", value=text), warnings


def _parse_timestamp(tx_id: str, date: str) -> str:
    m = re.search(r"(\d{14})", tx_id)
    if m:
        digits = m.group(1)
        return f"{digits[0:4]}-{digits[4:6]}-{digits[6:8]}T{digits[8:10]}:{digits[10:12]}:{digits[12:14]}"
    return f"{date}T00:00:00"


class LocalTransactionRepository(TransactionRepository):
    def __init__(self, root: Path, file_configs: list[FileConfig] | None = None) -> None:
        self._root = root
        self._file_configs = file_configs or []

    def _terminal_dir(self, terminal_id: str) -> Path:
        return self._root / terminal_id

    def _find_tx_dir(self, terminal_id: str, tx_id: str) -> Path | None:
        terminal_dir = self._terminal_dir(terminal_id)
        if not terminal_dir.exists():
            return None
        for date_dir in terminal_dir.iterdir():
            if not date_dir.is_dir():
                continue
            tx_dir = date_dir / tx_id
            if tx_dir.is_dir():
                return tx_dir
        return None

    def find_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]:
        terminal_dir = self._terminal_dir(terminal_id)
        if not terminal_dir.exists():
            return []

        if date is not None:
            date_dirs = [terminal_dir / date]
        else:
            date_dirs = sorted(d for d in terminal_dir.iterdir() if d.is_dir())

        result = []
        for date_dir in date_dirs:
            if not date_dir.is_dir():
                continue
            date_str = date_dir.name
            for tx_dir in sorted(date_dir.iterdir()):
                if not tx_dir.is_dir():
                    continue
                tx_id = tx_dir.name
                result.append(Transaction(
                    id=tx_id,
                    date=date_str,
                    timestamp=_parse_timestamp(tx_id, date_str),
                    attributes={},
                ))

        return result

    def find_transaction_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]:
        tx_dir = self._find_tx_dir(terminal_id, tx_id)
        if tx_dir is None:
            return []
        files = []
        for f in sorted(tx_dir.iterdir()):
            if not f.is_file():
                continue
            matched = next((fc for fc in self._file_configs if fc.matches(f.name)), None)
            files.append(TransactionFile(
                filename=f.name,
                display_name=matched.display_name if matched else None,
                order=matched.order if matched else None,
            ))
        return files

    def get_transaction_file_content(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None:
        tx_dir = self._find_tx_dir(terminal_id, tx_id)
        if tx_dir is None:
            return None
        file_path = tx_dir / filename
        if not file_path.exists():
            return None

        if _is_binary(file_path):
            return FileContent(
                filename=filename,
                display_name=None,
                data=[Section(name="section_1", label="セクション1", type="binary", value=None)],
            )

        text, warnings = _read_text(file_path, self._file_configs)

        processor_name = next(
            (fc.processor for fc in self._file_configs if fc.matches(filename) and fc.processor),
            None,
        )
        if processor_name is not None:
            processor = get_processor(processor_name)
            if processor is not None:
                sections, parse_warnings = processor(text)
            else:
                warnings.append(f"processor not found: {processor_name}")
                section, parse_warnings = _build_section(filename, text)
                sections = [section]
        else:
            section, parse_warnings = _build_section(filename, text)
            sections = [section]

        warnings.extend(parse_warnings)
        return FileContent(
            filename=filename,
            display_name=None,
            data=sections,
            warnings=warnings,
        )
