# CLAUDE.md

## プロジェクト概要

Windows POSアプリの結合テストサポートツールのバックエンド。
フロントエンド（`../frontend/`）から呼び出されるREST APIを提供する。

詳細は [docs/overview.md](docs/overview.md) を参照。

## 技術スタック

- **Python 3.12+**
- **Flask**（将来的な FastAPI 移行を考慮した設計とする）
- **python-dotenv**（`.flaskenv` の読み込み用）
- **pandas**
- **Poetry**（パッケージ管理）

### モジュール利用承認リスト

以下は制約外だが使用を明示的に承認済み：

| パッケージ | 用途 | 承認日 |
|-----------|------|--------|
| `flask` | REST API フレームワーク | プロジェクト開始時 |
| `python-dotenv` | `.flaskenv` 読み込み（flask run 用） | 2026-03-28 |

## アーキテクチャ

**クリーンアーキテクチャ**を採用する。依存の方向は常に内側（domain）に向ける。

```
api  →  usecase  →  domain
infra  →  domain
```

### レイヤー責務

| レイヤー | 責務 |
|----------|------|
| `domain` | エンティティ・値オブジェクト・ドメインサービス（フレームワーク非依存） |
| `usecase` | ユースケース・ポート定義（インターフェース） |
| `infra` | リポジトリ実装・外部サービス・DB・ファイルI/O |
| `api` | ルーティング・リクエスト/レスポンス変換（Flask Blueprint） |

## ディレクトリ構成

```
src/
├── domain/              # エンティティ・値オブジェクト・ドメインサービス
│   ├── terminal/
│   └── ...
├── usecase/             # ユースケース・ポート定義
│   ├── terminal/
│   └── ...
├── infra/               # リポジトリ実装・外部サービス
│   ├── repository/
│   └── ...
└── api/                 # ルーティング（Flask Blueprint）
    ├── app.py
    ├── terminal/
    └── ...

tests/
├── unit/                # domain・application のユニットテスト
├── integration/         # infrastructure のテスト
└── e2e/                 # APIエンドポイントのE2Eテスト

docs/
├── overview.md          # プロジェクト概要
├── structure.md         # ドキュメント構成
├── rules/               # 開発ルール
├── behaviors/           # 振舞定義（FB-xxx）
├── decisions/           # ADR（意思決定の記録）
└── ideas/               # ブレスト・議論ログ
```

## 開発サーバーの起動

```bash
poetry install           # 依存インストール
poetry run flask run     # 開発サーバー起動（localhost:4696）
```

## APIについて

- Base URL: `http://localhost:4696/api`
- スキーマは `../frontend/docs/api/` が正。バックエンドはこれを参照して実装する
- フロントエンドが API を規定する（フロント駆動）

---

## カスタムコマンド（Skills）

利用可能なカスタムコマンドは [SKILLS.md](SKILLS.md) を参照。

---

## 開発方針

このプロジェクトは**実践駆動**のスタイルを採用する。
「実装 → 振舞記録 → テスト → リファクタ」の流れを基本とし、スパイクの結果として振舞を書いてもよい。
仕様が固まってから実装する必要はなく、動くものを作りながら設計を洗練させていく。

### Issue運用方針

- Issueはロードマップ・方針レベルの議論のみに使う
- 細かい変更・機能追加はPRだけで完結させる

---

## 共通ルール

- 指示されていない機能を追加しない（over-engineering禁止）
- ドキュメントの `status` を必ず確認してから作業を始める
  - `idea` / `discussing` / `sleeping` のドキュメントに対して実装の提案をしない

### モジュール制約

利用できるモジュールは以下の企業が提供するものに限る：
**Google / Meta / X / Microsoft / Anaconda**

それ以外のモジュールを追加する場合は、必ずユーザーに確認してから提案する。

### ブランチ・コミット

- ブランチ名はテーマがわかる名前であればOK（例: `feature/terminal-sort`）
- `main` への直接pushは禁止

### FlaskとFastAPIの切り替えを見据えた実装指針

- ルーティング・リクエスト解析は `api` レイヤーに閉じ込める
- ユースケース（`usecase`）はフレームワーク非依存で書く
- 依存注入はコンストラクタで行う（フレームワーク固有のDIを使わない）
- レスポンス生成は `api` レイヤーの責務とする

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

- `src/` / `tests/` / `docs/` を必要に応じて触ってよい
- 「実装 → 振舞記録 → テスト → リファクタ」の順を基本とする
- スパイクの結果として振舞（`docs/behaviors/`）を書いてもよい
- レイヤー間の依存方向（常に内側へ）を守る

---

<!-- ## [doc] ドキュメントフェーズ

`/phase doc` 宣言時に適用する。詳細は [docs/CLAUDE.md](docs/CLAUDE.md) を参照。

- `docs/` のみ触る
- `src/` と `tests/` には触らない
- 実装の提案をしない（status が `approved` になるまで）

---

## [test] テストフェーズ

`/phase test` 宣言時に適用する。

- `tests/` のみ触る
- `src/` と `docs/` には触らない
- 振舞の `status` が `approved` であることを確認してから作成する
- テストがRedになることを確認してから完了とする

---

## [impl] 実装フェーズ

`/phase impl` 宣言時に適用する。

- `src/` のみ触る
- `tests/` と `docs/` には触らない
- 対応するテストがRedであることを確認してから実装を始める
- レイヤー間の依存方向（常に内側へ）を守る -->
