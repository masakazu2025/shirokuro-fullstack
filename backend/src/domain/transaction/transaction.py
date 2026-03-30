from __future__ import annotations
import codecs
import re
from dataclasses import dataclass, field
from typing import Any


@dataclass
class FileConfig:
    """ファイル設定（config由来）。"""
    filename_pattern: str
    encoding: str | None = None
    display_name: str | None = None
    order: int | None = None
    processor: str | None = None

    def __post_init__(self) -> None:
        try:
            re.compile(self.filename_pattern)
        except re.error as e:
            raise ValueError(f"filename_pattern が無効な正規表現です: {self.filename_pattern!r} ({e})")

        if self.encoding is not None:
            try:
                codecs.lookup(self.encoding)
            except LookupError:
                raise ValueError(f"encoding が無効なエンコード名です: {self.encoding!r}")

        if self.processor is not None:
            if not re.fullmatch(r"[A-Za-z_]\w*(\.[A-Za-z_]\w*)+", self.processor):
                raise ValueError(f"processor はドット区切りのモジュール形式で指定してください: {self.processor!r}")

        if self.order is not None and (not isinstance(self.order, int) or self.order < 1):
            raise ValueError(f"order は正の整数である必要があります: {self.order!r}")

    def matches(self, filename: str) -> bool:
        return bool(re.search(self.filename_pattern, filename))


@dataclass
class Transaction:
    id: str
    date: str
    timestamp: str
    attributes: dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "date": self.date,
            "timestamp": self.timestamp,
            "attributes": self.attributes,
        }


@dataclass
class TransactionFile:
    filename: str
    display_name: str | None = None
    order: int | None = None

    def to_dict(self) -> dict:
        return {
            "filename": self.filename,
            "display_name": self.display_name,
            "order": self.order,
        }


@dataclass
class Section:
    name: str
    label: str
    type: str
    value: Any

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "label": self.label,
            "type": self.type,
            "value": self.value,
        }


@dataclass
class FileContent:
    filename: str
    display_name: str | None
    data: list[Section]
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict:
        return {
            "filename": self.filename,
            "display_name": self.display_name,
            "data": [s.to_dict() for s in self.data],
            "warnings": self.warnings,
        }
