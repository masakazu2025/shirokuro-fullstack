# CLAUDE.md

## プロジェクト概要

Windows POSアプリの結合テストサポートツール。
テスト担当者がリモート端末のデータ収集・閲覧・整理・提出を効率的に行えるようにする。

## 構成

```
shirokuro-fullstack/
├── frontend/    # Electron + React + TypeScript
└── backend/     # Python / Flask / pandas
```

各ディレクトリの詳細は `frontend/CLAUDE.md` / `backend/CLAUDE.md` を参照。

## 共通ルール

- 指示されていない機能を追加しない（over-engineering禁止）
- ブランチ名はテーマがわかる名前にする（例: `feature/terminal-list`）
- `main` への直接pushは禁止
- issueはロードマップ・方針レベルの議論のみ。細かい変更はPRだけで完結させる

## フェーズ

- `/phase idea` — 話すだけ。ファイルに触らない
- `/phase dev` — 制限なし。ドキュメント・実装・テストを問わず進める

## モジュール制約

利用できるモジュールは以下の企業が提供するものに限る：
**Google / Meta / X / Microsoft / Anaconda**

それ以外を追加する場合は必ずユーザーに確認する。
