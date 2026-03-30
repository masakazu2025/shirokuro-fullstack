"""
テスト用 Fake プロセッサ。
複数セクション機能の動作確認のみを目的とする。本番用途には使用しない。
"""
from __future__ import annotations

import io
import json

import pandas as pd

from domain.transaction.transaction import Section


def fake_text_multi(text: str) -> tuple[list[Section], list[str]]:
    """テキストを行単位で分割し、複数の text セクションを返す。"""
    lines = [line for line in text.splitlines() if line.strip()]
    sections = [
        Section(name=f"section_{i + 1}", label=f"セクション{i + 1}", type="text", value=line)
        for i, line in enumerate(lines)
    ]
    while len(sections) < 2:
        n = len(sections) + 1
        sections.append(Section(name=f"section_{n}", label=f"セクション{n}", type="text", value=""))
    return sections, []


def fake_csv_multi(text: str) -> tuple[list[Section], list[str]]:
    """テキストを CSV としてパースし、同じ rows を 2 セクションとして返す。"""
    try:
        df = pd.read_csv(io.StringIO(text), header=None, dtype=str)
        df.columns = [f"col_{i}" for i in range(len(df.columns))]
        rows = df.to_dict(orient="records")
    except Exception as e:
        return [], [f"csv parse error: {e}"]
    return [
        Section(name="section_1", label="セクション1", type="csv", value=rows),
        Section(name="section_2", label="セクション2", type="csv", value=rows),
    ], []


def fake_json_multi(text: str) -> tuple[list[Section], list[str]]:
    """テキストを JSON としてパースし、同じ value を 2 セクションとして返す。"""
    try:
        value = json.loads(text)
    except json.JSONDecodeError as e:
        return [], [f"json parse error: {e}"]
    return [
        Section(name="section_1", label="セクション1", type="json", value=value),
        Section(name="section_2", label="セクション2", type="json", value=value),
    ], []
