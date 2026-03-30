---
id: TASK-006
title: テストの充実（unit / integration）
status: open
---

## 概要

現在 E2E テストは揃っているが unit / integration が薄い。
設計の意図はテストで最も雄弁に伝わるため、優先的に整備する。

## やること

- `tests/unit/` — domain・usecase レイヤーのユニットテスト追加
- `tests/integration/` — LocalTransactionRepository の統合テスト追加
- アサートはステータスコードだけでなく値・件数・中身まで検証する

## 優先度

高
