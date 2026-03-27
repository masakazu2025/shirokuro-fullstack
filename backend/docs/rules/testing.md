---
status: active
---

# テスト方針

## テスト種別

| 種別 | ツール | 対象 |
|------|--------|------|
| unit | pytest | domain・usecase のユニットテスト |
| integration | pytest | infrastructure（リポジトリ実装・外部I/O）のテスト |
| e2e | pytest + HTTPクライアント | APIエンドポイントのE2Eテスト |

## 振舞との紐付け

振舞ファイルのIDをテストコードにコメントとして記載し、振舞とテストを紐付ける。

```python
# B: BB-001
def test_terminal_list():
    ...
```

CIで振舞IDを収集し、`docs/behaviors.md` を自動生成する。
これにより「テストのない振舞」「振舞のないテスト」を検出できる。

## 振舞ファイルのフォーマット

```markdown
---
id: BB-001
title: 端末一覧を取得できる
type: unit | integration | e2e
status: approved | draft | deprecated
tested_by: tests/e2e/test_terminals.py::test_terminal_list
---

## 振舞

Given: 端末が1件以上登録されている
When:  GET /api/terminals を呼び出す
Then:  登録済み端末の一覧が返される
```

## IDルール

| プレフィックス | 対象 |
|--------------|------|
| `BB-xxx` | バックエンドの振舞 |

IDはプロジェクト内でグローバルユニーク。作成前に最大IDを確認すること。

## behaviors.md（インデックス）

`docs/behaviors.md` はCIが自動生成する。手動で編集しない。

振舞ファイルのfrontmatterから収集し、以下の形式で出力される：

```markdown
| ID | タイトル | type | status | tested_by |
|----|---------|------|--------|-----------|
| BB-001 | 端末一覧を取得できる | e2e | approved | tests/e2e/... |
```
