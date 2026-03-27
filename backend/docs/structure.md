---
status: active
---

# ドキュメント構成

## フロントエンドリポジトリ（shirokuro-frontend）

```
CLAUDE.md                # エージェント規約・フェーズ別ルール
SKILLS.md                # カスタムコマンド一覧（/phase など）
docs/
├── overview.md          # プロジェクト概要・目的
├── rules/               # ルール・方針
│   ├── repository.md    # リポジトリ・ブランチ・開発フロー
│   └── testing.md       # テスト方針
├── behaviors.md         # 振舞インデックス（CI自動生成）
├── api/                 # APIエンドポイント定義
│   ├── terminals.md
│   └── ...
├── requirements/        # 機能別 spec・design・schema
│   └── terminals/
│       ├── spec.md          # 概要・受け入れ条件
│       ├── design.md        # 設計・アーキテクチャ図
│       └── schema/          # データ型・モデル定義
│           └── terminal.md
├── behaviors/           # 振舞仕様（機能別フォルダ）
│   ├── CLAUDE.md
│   └── terminals/
│       ├── FB-001.md
│       └── FB-002.md
├── ideas/               # ブレスト・議論の記録（IDEA-xxx.md）
└── decisions/           # ADR（意思決定の記録）
```

## バックエンドリポジトリ（shirokuro-backend）

```
docs/
├── overview.md          # プロジェクト概要・目的
├── structure.md         # ドキュメント構成（このファイル）
├── rules/               # ルール・方針
│   ├── repository.md    # リポジトリ・ブランチ・開発フロー
│   └── testing.md       # テスト方針
├── requirements/        # 機能別 spec・design・schema
│   └── terminals/
│       ├── spec.md          # 概要・受け入れ条件
│       ├── design.md        # 設計・処理フロー
│       └── schema/          # データ型・モデル定義
│           └── terminal.md
├── behaviors/           # 振舞仕様（BB-xxx）
│   ├── CLAUDE.md
│   └── terminals/
│       ├── BB-001.md
│       └── BB-002.md
├── ideas/               # ブレスト・議論の記録（IDEA-xxx.md）
└── decisions/           # ADR（意思決定の記録）
```

## ステータス定義

各ドキュメントのfrontmatterに記載する。

| status | 意味 |
|--------|------|
| `idea` | アイデア段階。議論すらしていない |
| `discussing` | 議論中。方向性を探っている |
| `draft` | 方向性は決まった。詳細を詰めている |
| `approved` | 確定。下位フェーズに進められる |
| `sleeping` | 一旦寝かせ。将来再検討 |
| `deprecated` | 廃止済み |

- `idea` / `discussing` / `sleeping` のドキュメントに対して、Agentは実装の提案をしない
- `approved` になって初めて下位フェーズ（振舞・テスト・実装）に進める

## ideas/（ブレスト記録）

`/phase idea` での議論・選択肢・整理の跡を残す。
`closed` になったら必要に応じて `decisions/` にADRとして昇格させる。

```
docs/ideas/
└── IDEA-001_health-api-connection.md
```

## decisions/（ADR）

「なぜこう決めたか」の背景・議論・却下した選択肢を残す。

```
docs/decisions/
└── ADR-001_development-flow.md
```

## 機能フォルダのライフサイクル

画面・機能が統合・削除された場合、フォルダは残したまま `spec.md` の `status` を `deprecated` にする。
フォルダ名の変更は `git mv` で行い、履歴を残す。
