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
| `date` | `string \| null` | 選択中の日付（YYYY-MM-DD形式）。1端末につき1日付のみ選択可 |

```json
{
  "id": "t1",
  "name": "端末-01",
  "ip": "192.168.1.101",
  "monitoring": "on",
  "online": "online",
  "date": "2026-03-21"
}
```

## 制約

- `ip` はプロジェクト内でグローバルユニーク
- `ip` は変更不可（削除して再登録する）
- `name` は省略可。省略時は `ip` の値を使用する
- `date` は1端末につき1日付のみ選択可。未選択時は `null`
- `monitoring` が `"on"` のとき `date` は変更不可
