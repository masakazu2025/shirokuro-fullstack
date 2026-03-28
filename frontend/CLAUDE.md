# CLAUDE.md

## プロジェクト概要

Windows POSアプリの結合テストサポートツール。
テスト担当者がリモート端末のデータ収集・閲覧・整理・提出を効率的に行えるようにする。

詳細は [docs/overview.md](docs/overview.md) を参照。

## 技術スタック

- **Electron** + **React** + **TypeScript**
- **FluentUI v9** (`@fluentui/react-components`)
- **electron-vite**（ビルドツール）
- バックエンド（`../backend/`）: Python / Flask / pandas

## ディレクトリ構成

```
src/
├── main/          # Electronメインプロセス
├── preload/       # プリロードスクリプト
└── renderer/      # Reactアプリ（UIのメイン）
    └── src/
        ├── components/  # 機能別コンポーネント
        │   ├── layout/      # AppShell・ActivityBarなどの骨格
        │   ├── terminals/   # 端末管理
        │   ├── browser/     # 取引閲覧
        │   ├── images/      # 画像閲覧
        │   ├── testspec/    # テスト仕様書
        │   ├── defect/      # 不具合資料
        │   ├── toolkit/     # ツールキット
        │   └── viewer/      # 各種ビューワー
        └── mock/        # モックデータ（API接続前の仮データ）

docs/
├── overview.md          # プロジェクト概要
├── structure.md         # ドキュメント構成
├── api/                 # APIスキーマ定義（フロントが正）
├── requirements/        # 機能別仕様・振舞
├── behaviors/           # 振舞定義（FB-xxx）
├── ideas/               # ブレスト・議論ログ
├── rules/               # 開発ルール
└── decisions/           # ADR（意思決定の記録）

tests/                   # テストコード（未作成）
```

## 開発サーバーの起動

```bash
npm run dev      # Electron + Vite の開発モード
npm run build    # プロダクションビルド
```

開発中はブラウザ（`localhost:5174`）でも動作する。
Electronラップは最終フェーズで対応。

## APIについて

- Base URL: `http://localhost:4696/api`
- バックエンド（`../backend/`）との接続は現在未実装（モックデータ使用中）
- スキーマは `docs/api/` が正。バックエンドはこれを参照して実装する

---

## カスタムコマンド（Skills）

利用可能なカスタムコマンドは [SKILLS.md](SKILLS.md) を参照。

---

## 開発方針

このプロジェクトは**仕様駆動開発**を採用している。
アイデア・目的 → 要件 → 設計 → 振舞 → テスト → 実装 の順に進める。
上流が固まる前に下流に進まない。議論中のものを実装しない。

---

## 共通ルール

- 指示されていない機能を追加しない（over-engineering禁止）
- ドキュメントの `status` を必ず確認してから作業を始める
  - `idea` / `discussing` / `sleeping` のドキュメントに対して実装の提案をしない
  - `approved` になって初めて下位フェーズ（振舞・テスト・実装）に進める

### モジュール制約

利用できるモジュールは以下の企業が提供するものに限る：
**Google / Meta / X / Microsoft / Anaconda**

それ以外のモジュールを追加する場合は、必ずユーザーに確認してから提案する。

### ブランチ・コミット

- ブランチ名はテーマがわかる名前にする（例: `feature/terminal-sort`）
- `main` への直接pushは禁止

---

## [idea] アイデア・ブレストフェーズ

`/phase idea` 宣言時に適用する。詳細は [docs/CLAUDE.md](docs/CLAUDE.md) を参照。

- 議論・整理・選択肢の提示のみ行う
- ファイルを自分から作成しない（ユーザーが明示的に指示した場合のみ `docs/ideas/` に記録する）
- 実装・テスト・仕様の提案をしない
- スコープが広がりすぎたら指摘する

---

## [dev] 開発フェーズ

`/phase dev` 宣言時に適用する。

- ドキュメント・実装・テストを問わず、指示された作業を進める
- ファイルの種類による制限なし

---

<!--
## [doc] ドキュメントフェーズ

`/phase doc` 宣言時に適用する。詳細は [docs/CLAUDE.md](docs/CLAUDE.md) を参照。

- `docs/requirements/`・`docs/behaviors/`・`docs/api/` のみ触る
- `src/` と `tests/` には触らない
- 実装の提案をしない（status が `approved` になるまで）

---

## [test] テストフェーズ

`/phase test` 宣言時に適用する。詳細は [tests/CLAUDE.md](tests/CLAUDE.md) を参照。

- `tests/` のみ触る
- `src/` と `docs/` には触らない
- 振舞の `status` が `approved` であることを確認してから作成する
- テストがRedになることを確認してから完了とする

---

## [impl] 実装フェーズ

`/phase impl` 宣言時に適用する。詳細は [src/CLAUDE.md](src/CLAUDE.md) を参照。

- `src/` のみ触る
- `tests/` と `docs/` には触らない
- 対応するテストがRedであることを確認してから実装を始める

---
-->
