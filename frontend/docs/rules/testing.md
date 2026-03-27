---
status: active
---

# テスト方針

## テスト種別と担当

| 種別 | フロント | バック |
|------|---------|-------|
| unit | Vitest | pytest |
| integration | Vitest | pytest |
| e2e | Playwright | — |

E2EはPlaywrightで記述する。開発中はブラウザ（localhost:5174）に対して実行し、
Electronラップ後にElectron対応に切り替える。

## 振舞との紐付け

振舞ファイルのIDをテストコードにコメントとして記載し、振舞とテストを紐付ける。

```python
# B: FB-001
def test_terminal_list():
    ...
```

```typescript
// B: FB-001
test('端末一覧を表示できる', () => {
  ...
})
```

CIで振舞IDを収集し、`docs/behaviors.md` を自動生成する。
これにより「テストのない振舞」「振舞のないテスト」を検出できる。

## 振舞ファイルのフォーマット

```markdown
---
id: FB-001
title: 端末一覧を表示できる
type: unit | integration | e2e
status: approved | draft | deprecated
tested_by: tests/e2e/test_terminals.py::test_terminal_list
---

## 振舞

Given: 端末が1件以上登録されている
When:  端末管理画面を開く
Then:  登録済み端末の一覧が表示される
```

## IDルール

| プレフィックス | 対象 |
|--------------|------|
| `FB-xxx` | フロントエンドの振舞 |
| `BB-xxx` | バックエンドの振舞 |

IDはプロジェクト内でグローバルユニーク。作成前に最大IDを確認すること。

## behaviors.md（インデックス）

`docs/behaviors.md` はCIが自動生成する。手動で編集しない。

振舞ファイルのfrontmatterから収集し、以下の形式で出力される：

```markdown
| ID | タイトル | type | status | tested_by |
|----|---------|------|--------|-----------|
| FB-001 | 端末一覧を表示できる | e2e | approved | tests/e2e/... |
```
