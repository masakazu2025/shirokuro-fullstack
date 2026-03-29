---
status: active
---

# ドキュメント構成

## ルート（共通・概要レイヤー）

```
docs/
├── overview.md          # プロジェクト概要・目的・目指すもの
├── structure.md         # このファイル（ドキュメント構成の地図）
├── api/                 # APIスキーマ定義（フロント・バック共通の契約）
│   └── terminals.md
├── requirements/        # 機能の目的・何を実現するか（抽象レベル）
├── decisions/           # ADR（意思決定の記録）
│   └── ADR-001_development-flow.md
├── memo/                # ブレスト・議論ログ（IDEA-xxx）
└── rules/               # 共通ルール・方針
    ├── repository.md
    └── testing.md
```

### 各ディレクトリの役割

- `api/` — フロントとバックエンドの契約。URLとレスポンス形式を定義する
- `requirements/` — 機能の目的・何を実現するか（実装の具体はフロント・バック各配下へ）
- `decisions/` — なぜこう決めたか（背景・議論・却下した選択肢）
- `memo/` — ブレスト・議論の記録（closed になったら decisions/ に昇格）
- `rules/` — 開発ルール・テスト方針など共通の取り決め

---

## フロントエンド（実装の具体レイヤー）

```
frontend/docs/
├── CLAUDE.md
├── rules/               # フロント固有のルール・方針
│   └── testing.md
├── requirements/        # UI・コンポーネントの具体仕様
│   └── terminals/
│       ├── spec.md
│       └── schema/
│           └── terminal.md
└── behaviors/           # 振舞定義（FB-xxx）
```

---

## バックエンド（実装の具体レイヤー）

```
backend/docs/
├── CLAUDE.md
├── rules/               # バックエンド固有のルール・方針
│   └── testing.md
├── requirements/        # 処理ロジック・データ構造の具体仕様
└── behaviors/           # 振舞定義（BB-xxx）
    └── terminals/
        └── BB-001.md〜
```

---

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
