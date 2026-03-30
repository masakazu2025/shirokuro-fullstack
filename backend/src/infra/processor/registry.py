from __future__ import annotations

from typing import Callable

from domain.transaction.transaction import Section

# processor の型: デコード済みテキストを受け取り (sections, warnings) を返す
ProcessorFunc = Callable[[str], tuple[list[Section], list[str]]]

_REGISTRY: dict[str, ProcessorFunc] = {
    # 例: "pos.header": pos_header_processor,
}


def get_processor(name: str) -> ProcessorFunc | None:
    """名前からプロセッサを引く。未登録の場合は None を返す。"""
    return _REGISTRY.get(name)
