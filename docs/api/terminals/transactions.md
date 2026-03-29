---
status: draft
---

# API: 取引閲覧

端末ディレクトリ配下の日付フォルダを走査し、取引データを返す。

---

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/terminals/:id/transactions` | 全取引一覧 |
| GET | `/terminals/:id/transactions/:date` | 指定日の取引一覧 |
| GET | `/terminals/:id/transactions/:date/:tx_id/files` | ファイル一覧 |
| GET | `/terminals/:id/transactions/:date/:tx_id/files/:filename` | ファイル内容取得 |

---

## GET /terminals/:id/transactions

端末ディレクトリ配下の全日付フォルダを走査し、取引一覧をフラットに返す。

### レスポンス

```json
[
  { "id": "tx_001", "date": "2026-03-21", "timestamp": "2026-03-21T09:00:00", "attributes": {} },
  { "id": "tx_002", "date": "2026-03-21", "timestamp": "2026-03-21T09:05:00", "attributes": {} },
  { "id": "tx_003", "date": "2026-03-22", "timestamp": "2026-03-22T10:00:00", "attributes": {} }
]
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | string | 取引ID |
| `date` | string | 取引日（`YYYY-MM-DD`） |
| `timestamp` | string | 取引日時（ISO 8601）。`id` との組み合わせでユニークを保証する |
| `attributes` | object | config で定義されたドメイン固有フィールド群 |

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末が見つからない |

---

## GET /terminals/:id/transactions/:date

指定日の取引一覧を返す。

### パスパラメータ

| パラメータ | 説明 |
|-----------|------|
| `id` | 端末ID |
| `date` | 取引日（`YYYY-MM-DD`） |

### レスポンス

```json
[
  { "id": "tx_001", "date": "2026-03-21", "timestamp": "2026-03-21T09:00:00", "attributes": {} },
  { "id": "tx_002", "date": "2026-03-21", "timestamp": "2026-03-21T09:05:00", "attributes": {} }
]
```

フィールド定義は [GET /terminals/:id/transactions](#get-terminalsidtransactions) と同じ。

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末が見つからない、または指定日のフォルダが存在しない |

---

## GET /terminals/:id/transactions/:date/:tx_id/files

取引ディレクトリ内のファイル一覧を返す。config に定義されたパターンにマッチするファイルのみ含む。

### パスパラメータ

| パラメータ | 説明 |
|-----------|------|
| `id` | 端末ID |
| `date` | 取引日（`YYYY-MM-DD`） |
| `tx_id` | 取引ID |

### レスポンス

```json
[
  { "filename": "file_a.dat", "display_name": "ファイルA", "order": 1 },
  { "filename": "file_b.dat", "display_name": "ファイルB", "order": 2 }
]
```

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `filename` | string | ファイル名 |
| `display_name` | string | UI上の表示名。config の `display_name` から取得 |
| `order` | number | UI表示順。config の `order` から取得 |

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末・日付・取引のいずれかが見つからない |

---

## GET /terminals/:id/transactions/:date/:tx_id/files/:filename

指定ファイルの内容を返す。config の `type` と `processor` に基づいてパース・変換する。

### パスパラメータ

| パラメータ | 説明 |
|-----------|------|
| `id` | 端末ID |
| `date` | 取引日（`YYYY-MM-DD`） |
| `tx_id` | 取引ID |
| `filename` | ファイル名 |

### レスポンス（共通フィールド）

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `filename` | string | ファイル名 |
| `display_name` | string | UI上の表示名 |
| `data` | array | パース済みのファイル内容。1件のとき UI はタブなし、複数件のとき UI はタブ切り替え |

### `data` の要素

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `name` | string | 要素の識別名 |
| `label` | string | UI上のタブラベル |
| `type` | string | 内容の形式（`text` / `csv` / `json`） |
| `value` | any | パース済みの内容。`type` によって型が変わる |

### `type` と `value` の型

| type | `value` の型 | 説明 |
|------|------------|------|
| `text` | string | テキスト文字列 |
| `csv` | object[] | 各行をオブジェクトとして持つ配列 |
| `json` | object | JSONオブジェクト |

### レスポンス例（単一、タブなし）

```json
{
  "filename": "file_a.dat",
  "display_name": "ファイルA",
  "data": [
    { "name": "section_1", "label": "セクション1", "type": "csv", "value": [{ "col1": "val1", "col2": "val2" }] }
  ]
}
```

### レスポンス例（複数、タブあり）

```json
{
  "filename": "file_a.dat",
  "display_name": "ファイルA",
  "data": [
    { "name": "section_1", "label": "セクション1", "type": "csv",  "value": [{ "col1": "val1" }] },
    { "name": "section_2", "label": "セクション2", "type": "text", "value": "raw text..." }
  ]
}
```

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末・日付・取引・ファイルのいずれかが見つからない |
| 422 | ファイルのパースに失敗 |

---

## `attributes` について

取引の固定フィールドは `id`・`date`・`timestamp` の3つ。`id` + `timestamp` の組み合わせでユニークを保証する。

ドメイン固有のフィールドは config で定義し、`attributes` として動的に付与する。config の詳細は別途定義する。
