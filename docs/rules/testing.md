---
status: active
---

# テスト方針

## 全体方針

| 担当 | ツール | 方針 |
|------|--------|------|
| バックエンド | pytest | unit + integration を詳細に実装 |
| フロントエンド | Playwright | E2E + 結合を兼ねる |
| フロントエンド | Vitest | 必要に応じて（ロジック単体など） |

厳密な結合テスト層は設けない。バックエンドのテストを詳細に実装し、
フロントはPlaywrightのE2EがAPIとの結合も兼ねる。

---

## 振舞との紐付け

振舞ファイルのIDをテストコードにコメントとして記載し、振舞とテストを紐付ける。

```python
# B: BB-001
def test_terminal_list():
    ...
```

```typescript
// B: FB-001
test('端末一覧を表示できる', () => {
  ...
})
```

---

## 振舞ファイルのフォーマット

```markdown
---
id: FB-001          # FB-xxx（フロント）/ BB-xxx（バックエンド）
title: 端末一覧を表示できる
type: unit | integration | e2e
status: approved | draft | deprecated
tested_by:          # テスト作成後に記入
---

## 振舞

Given: （前提条件）
When:  （操作・イベント）
Then:  （期待結果）
```

## IDルール

| プレフィックス | 対象 |
|--------------|------|
| `FB-xxx` | フロントエンドの振舞 |
| `BB-xxx` | バックエンドの振舞 |

IDはプロジェクト内でグローバルユニーク。作成前に最大IDを確認すること。
