from __future__ import annotations

import json
import logging
from pathlib import Path

from domain.transaction.transaction import FileConfig
from infra.processor.registry import get_processor

logger = logging.getLogger(__name__)


def load_file_configs(config_path: Path) -> list[FileConfig]:
    """JSON設定ファイルから FileConfig リストを読み込む。
    ファイルが存在しない場合は空リストを返す。
    バリデーションに失敗したエントリは警告ログを出力してスキップする。"""
    if not config_path.exists():
        return []

    with config_path.open(encoding="utf-8") as f:
        data = json.load(f)

    configs: list[FileConfig] = []
    for entry in data.get("file_configs", []):
        try:
            cfg = FileConfig(
                filename_pattern=entry["filename_pattern"],
                encoding=entry.get("encoding"),
                display_name=entry.get("display_name"),
                order=entry.get("order"),
                processor=entry.get("processor"),
            )
        except (ValueError, KeyError) as e:
            logger.warning("file_configs のエントリをスキップしました: %s (%s)", entry, e)
            continue

        if cfg.processor is not None and get_processor(cfg.processor) is None:
            logger.warning(
                "processor '%s' は registry に未登録です。エントリをスキップします: %s",
                cfg.processor, entry,
            )
            continue

        configs.append(cfg)

    _resolve_order_conflicts(configs)
    return configs


def _resolve_order_conflicts(configs: list[FileConfig]) -> None:
    """order の重複を検出し、重複がある場合は filename_pattern の昇順で解決する。"""
    orders = [c.order for c in configs if c.order is not None]
    if len(orders) == len(set(orders)):
        return

    logger.warning("order に重複があります。filename_pattern の昇順でフォールバックします。")
    with_order = sorted(
        [c for c in configs if c.order is not None],
        key=lambda c: c.filename_pattern,
    )
    seen: set[int] = set()
    for cfg in with_order:
        assert cfg.order is not None
        if cfg.order in seen:
            # 重複している側を None に戻してフォールバック扱いにする
            cfg.order = None
        else:
            seen.add(cfg.order)
