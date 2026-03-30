---
id: TASK-007
title: コードコメントの充実
status: open
---

## 概要

「コードを見ればわかる」が成立しない箇所（業務知識・設計判断・外部仕様への対応）に
「なぜ（Why）」を説明するコメントを追加する。

## 対象箇所（例）

- `app.py` — CORS プリフライトハンドラの意図
- `local_transaction_repository.py` — `keep_default_na=False` の理由
- `registry.py` — プロセッサパターンの設計意図
- `infra/logger.py` — 環境変数対応の背景

## 優先度

中
