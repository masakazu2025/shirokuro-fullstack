---
status: active
---

# バックエンド テスト方針

共通方針は `docs/testing.md` を参照。

## ツール

- **pytest** — unit / integration / e2e すべて pytest で実装する

## テスト種別

| 種別 | 対象 |
|------|------|
| unit | domain・usecase のロジック |
| integration | infrastructure（リポジトリ実装・外部I/O） |
| e2e | APIエンドポイント（HTTPクライアント経由） |

各種別の実装方針は [tests/CLAUDE.md](../../tests/CLAUDE.md) を参照。
