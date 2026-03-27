# docs/ideas/CLAUDE.md

`/phase idea` でアイデアを記録するときに適用する。

## スコープ

- `docs/ideas/` のみ触る
- 議論・整理の記録にとどめる
- 実装・テスト・仕様の提案をしない

## ファイル配置

```
docs/ideas/
└── IDEA-001_（テーマ）.md
```

## フォーマット

```markdown
---
id: IDEA-001
title: （議論のテーマ）
status: discussing | closed
date: YYYY-MM-DD
---

## 目的・背景

## 論点

## 出した選択肢

## 結論・次のアクション
```

## 作成ルール

- IDはグローバルユニーク。作成前に既存の最大IDを確認する
- `closed` になったら必要に応じて `docs/decisions/` にADRとして昇格させる
