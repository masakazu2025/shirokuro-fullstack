---
status: active
---

# フロントエンド テスト方針

共通方針は `docs/testing.md` を参照。

## ツール

- **Playwright** — E2Eテスト。APIとの結合も兼ねる
- **Vitest** — 必要に応じて（ロジック単体など）

## 実行環境

- 開発中はブラウザ（`localhost:5174`）に対して実行する
- Electronラップ後にElectron対応に切り替える
