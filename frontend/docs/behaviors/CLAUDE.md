# docs/behaviors/CLAUDE.md

`/phase doc` で振舞を作成するときに適用する。

## スコープ

- `docs/behaviors/` のみ触る
- 対応する `docs/requirements/` の spec が `approved` であることを確認してから作成する

## ファイル配置

```
docs/behaviors/
└── terminals/
    ├── FB-001.md
    └── FB-002.md
```

## フォーマット

```markdown
---
id: FB-001
title: 端末一覧を表示できる
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
- `tested_by` は作成時点では空でよい（`/phase test` 完了後に記入）
- `status: draft` で作成し、レビュー後に `approved` にする

## 振舞の粒度

- Given/When/Then それぞれが1つの明確な文になるようにする
- 複数の操作が必要な場合は振舞を分割することを検討する
- 境界値（0件・最大件数・重複など）は必ず別ファイルで明示する
