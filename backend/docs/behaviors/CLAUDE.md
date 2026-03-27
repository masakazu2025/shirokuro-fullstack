# docs/behaviors/CLAUDE.md

`/phase dev` で振舞を作成・記録するときに適用する。

スパイク・実装の結果として振舞を書いてもよい（事前に spec が固まっている必要はない）。

## スコープ

- `docs/behaviors/` のみ触る

## ファイル配置

```
docs/behaviors/
└── terminals/
    ├── BB-001.md
    └── BB-002.md
```

## フォーマット

```markdown
---
id: BB-001
title: 端末一覧を取得できる
type: unit | integration | e2e
status: draft | approved | deprecated
tested_by:
---

## 振舞

Given: （前提条件）
When:  （操作・イベント）
Then:  （期待結果）
```

## 作成ルール

- 1ファイル = 1シナリオ
- 正常系・異常系・境界値は別ファイルにする
- IDはプロジェクト内でグローバルユニーク。作成前に既存の最大IDを確認する
- `tested_by` は作成時点では空でよい（テスト作成後に記入）
- `status: draft` で作成し、レビュー後に `approved` にする

## type の選び方

| type | 基準 |
|------|------|
| `unit` | 単一コンポーネント・関数の振る舞い |
| `integration` | API呼び出しを含む複数モジュールの連携 |
| `e2e` | 画面操作を通じたユーザー視点の振る舞い |

## 振舞の粒度

- Given/When/Then それぞれが1つの明確な文になるようにする
- 複数の操作が必要な場合は振舞を分割することを検討する
- 境界値（0件・最大件数・重複など）は必ず別ファイルで明示する
