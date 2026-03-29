---
status: active
---

# Terminal スキーマ

## Terminal

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | `string` | 一意のID |
| `name` | `string` | 端末名（省略時はIPアドレス） |
| `ip` | `string` | IPアドレス（一意） |
| `monitoring` | `"on" \| "off"` | 自動監視状態 |
| `online` | `"online" \| "offline"` | オンライン状態 |
| `terminal_date` | `string \| null` | 端末の現在日付（net timeで取得。バックエンドのみ更新可） |
| `monitoring_date` | `string \| null` | 監視に使う日付（monitoring ON 切替時にフロントが指定） |

```json
{
  "id": "t1",
  "name": "端末-01",
  "ip": "192.168.1.101",
  "monitoring": "on",
  "online": "online",
  "terminal_date": "2026-03-21",
  "monitoring_date": "2026-03-21"
}
```

## 制約

- `ip` はプロジェクト内でグローバルユニーク
- `ip` は変更不可（削除して再登録する）
- `name` は省略可。省略時は `ip` の値を使用する
- `terminal_date` はバックエンド（probe_and_save）のみが更新する。フロントからのPATCHで変更不可
- `monitoring_date` は monitoring を ON にする PATCH 時にフロントが指定する。未設定時は `null`
- `monitoring` が `"on"` のとき `monitoring_date` は変更不可
