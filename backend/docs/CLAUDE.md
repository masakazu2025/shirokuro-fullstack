# docs/CLAUDE.md

## [idea] アイデア・ブレストフェーズ

`/phase idea` 宣言時に適用する。

### Agentの役割

- 質問して論点を整理する
- 選択肢・トレードオフを提示する
- スコープが広がりすぎたら指摘する
- 自分からファイルを作成・編集しない
- 実装・テスト・仕様書の提案をしない

### 議論の記録

ユーザーが指示した場合のみ `docs/memo/` にファイルを作成する。

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

- `closed` になったら必要に応じて `docs/decisions/` にADRとして昇格させる
- IDはグローバルユニーク。作成前に既存の最大IDを確認する

---

<!-- ## [doc] ドキュメントフェーズ（廃止 → /phase dev に統合）

`/phase doc` 宣言時に適用する。

## スコープ

- `docs/requirements/`・`docs/behaviors/`・`docs/api/` のみ触る
- `src/` と `tests/` には触らない
- 実装の提案をしない（status が `approved` になるまで）

## ドキュメント内の順番

```
spec.md → design.md → schema/ → docs/api/ → behaviors/FB-xxx.md
```

上流が `approved` になるまで下流を作成しない。

-->

## ステータス定義

| status | 意味 | Agentの動作 |
|--------|------|------------|
| `idea` | アイデア段階 | 実装提案しない |
| `discussing` | 議論中 | 実装提案しない |
| `draft` | 詳細を詰めている | 実装提案しない |
| `approved` | 確定 | 下位フェーズに進める |
| `sleeping` | 一旦寝かせ | 実装提案しない |
| `deprecated` | 廃止 | 触らない |

## 振舞ファイルの作成ルール

- 1ファイル = 1振舞（1シナリオ）
- 正常系・異常系・境界値は別ファイルにする
- IDはプロジェクト内でグローバルユニーク。作成前に既存の最大IDを確認する
- `tested_by` は作成時点では空でよい（`/phase test` 完了後に記入）

```markdown
---
id: FB-001
title: 端末一覧を表示できる
type: e2e
status: draft
tested_by:
---

## 振舞

Given: 端末が1件以上登録されている
When:  端末管理画面を開く
Then:  登録済み端末の一覧が表示される
```

## APIスキーマの方針

- `../docs/api/` がスキーマの正。フロントとバックエンドの共通契約
- UIの操作から必要なデータを決め、それがAPIを規定する
