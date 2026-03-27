# tests/CLAUDE.md

`/phase test` 宣言時に適用する。

## スコープ

- `tests/` のみ触る
- `src/` と `docs/` には触らない

## テスト作成の手順

1. 対応する振舞ファイル（`docs/behaviors/*/FB-xxx.md`）の `status` が `approved` であることを確認する
2. テストファイルの冒頭に振舞IDをコメントで書く
3. テストがRedになることを確認してから完了とする

```typescript
// B: FB-001
test('端末一覧を表示できる', () => {
  ...
})
```

## 振舞ID ルール

| プレフィックス | 対象 |
|--------------|------|
| `FB-xxx` | フロントエンドの振舞 |
| `BB-xxx` | バックエンドの振舞 |

- IDはプロジェクト内でグローバルユニーク
- 作成前に `docs/requirements/` 内の既存IDを確認し、最大IDの次番を使う

## テスト種別と配置

| type | ツール | 配置先 |
|------|--------|--------|
| `unit` | Vitest | `tests/unit/` |
| `integration` | Vitest | `tests/integration/` |
| `e2e` | Playwright | `tests/e2e/` |

### type の選び方

| type | 基準 |
|------|------|
| `unit` | 単一コンポーネント・関数の振る舞い |
| `integration` | API呼び出しを含む、複数モジュールの連携 |
| `e2e` | 画面操作を通じたユーザー視点の振る舞い |

## 振舞ファイルの書き方

- 1ファイル = 1振舞（1シナリオ）
- 正常系・異常系・境界値は別ファイルにする
- `tested_by` はテスト作成後に記入する（作成時点では空でよい）

```markdown
---
id: FB-001
title: 端末一覧を表示できる
type: e2e
status: approved
tested_by: tests/e2e/terminals/terminalList.test.ts
---

## 振舞

Given: 端末が1件以上登録されている
When:  端末管理画面を開く
Then:  登録済み端末の一覧が表示される
```
