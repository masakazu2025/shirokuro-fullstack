---
status: active
---

# API: 端末管理

## 共通

- Base URL: `http://localhost:{PORT}/api`
- デフォルトポート: `4696`（設定画面で変更可能）
- Content-Type: `application/json`

---

## エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| GET | `/terminals` | 端末一覧取得 |
| POST | `/terminals` | 端末追加（1件または複数） |
| PATCH | `/terminals/:id` | 端末情報更新（名前・監視状態） |
| DELETE | `/terminals/:id` | 端末削除（1件） |
| DELETE | `/terminals` | 端末削除（複数） |
| GET | `/terminals/online` | オンライン状態一覧取得（ポーリング用） |
| GET | `/health` | ヘルスチェック |

---

## GET /terminals

登録済み端末の一覧を返す。バックエンドのJSONファイル（`data/terminals.json`）から読み込む。
起動時の復元処理として呼び出される。

### レスポンス

```json
[
  {
    "id": "t1",
    "name": "端末-01",
    "ip": "192.168.1.101",
    "monitoring": "on",
    "online": "online",
    "terminal_date": "2026-03-21",
    "monitoring_date": "2026-03-21"
  },
  {
    "id": "t2",
    "name": "端末-02",
    "ip": "192.168.1.102",
    "monitoring": "off",
    "online": "offline",
    "terminal_date": "2026-03-21",
    "monitoring_date": null
  }
]
```

---

## POST /terminals

端末を追加する。1件または複数件をまとめて送信できる。

### リクエスト

```json
[
  { "name": "端末-01", "ip": "192.168.1.101" },
  { "name": "端末-02", "ip": "192.168.1.102" }
]
```

- `name`: 省略可。省略時はIPアドレスを使用する
- `ip`: 必須。既存と重複する場合はエラー

### レスポンス（成功）

```json
[
  { "id": "t1", "name": "端末-01", "ip": "192.168.1.101", "monitoring": "off", "online": "offline" },
  { "id": "t2", "name": "端末-02", "ip": "192.168.1.102", "monitoring": "off", "online": "offline" }
]
```

### エラー

| コード | 説明 |
|--------|------|
| 400 | IPアドレスが不正 |
| 409 | IPアドレスが重複 |

---

## PATCH /terminals/:id

端末名または監視状態を更新する。変更したいフィールドのみ送信する。

### リクエスト

```json
{ "name": "端末-01（変更後）" }
```

```json
{ "monitoring": "on" }
```

```json
{ "terminal_date": "2026-03-21" }
```

```json
{ "monitoring": "on", "monitoring_date": "2026-03-21" }
```

### レスポンス（成功）

```json
{ "id": "t1", "name": "端末-01（変更後）", "ip": "192.168.1.101", "monitoring": "on", "online": "online" }
```

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末が見つからない |

---

## DELETE /terminals/:id

端末を1件削除する。監視中の場合は監視タスクも停止する。

### レスポンス（成功）

```json
{ "id": "t1" }
```

### エラー

| コード | 説明 |
|--------|------|
| 404 | 端末が見つからない |

---

## DELETE /terminals

端末を複数件まとめて削除する。

### リクエスト

```json
{ "ids": ["t1", "t2", "t3"] }
```

### レスポンス（成功）

```json
{ "ids": ["t1", "t2", "t3"] }
```

---

## GET /terminals/online

全端末のオンライン状態をpingで確認して返す。ポーリング用。

### レスポンス

```json
[
  { "id": "t1", "online": "online"  },
  { "id": "t2", "online": "offline" }
]
```

---

## GET /health

バックエンドの起動確認用。アプリ起動時に呼び出す。

### レスポンス（成功）

```json
{ "status": "ok" }
```

### エラー

接続できない場合はHTTPレスポンス自体が返らない（タイムアウト）。
フロントはタイムアウトをもって「接続失敗」と判断する。
