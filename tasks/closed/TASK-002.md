---
id: TASK-002
title: API設計方針をdocsにまとめる
status: closed
---

## 概要

2026-03-29 のセッションで固まった API 設計の意図と判断をドキュメントとして残す。
実装の足跡として、ポートフォリオ観点でも価値がある。

## まとめる内容

### URL設計
- ネスト型：`/terminal/{id}/transaction/{date}/{tx_id}/file/{filename}`
- Blueprint の分割軸は「アクセスコンテキスト」（terminal / testspec / folder）
- パス解決の責任を API 側に持たせることで、呼び出し側がストレージ構造を知らなくて済む
- 将来的に testspec / folder でも同じエンドポイント体系が使える拡張性を意識

### ファイル処理のプラグイン設計
config（YAML 想定）でファイル種別ごとの処理を定義する：

```yaml
- pattern: "^receipt.*\\.dat$"
  display_name: "レシート"
  order: 1
  type: csv
  list: true
  processor: default.receipt_formatter
```

| フィールド | 役割 |
|---|---|
| `pattern` | ファイル名の正規表現マッチ |
| `display_name` | UI上の表示名（日本語名称） |
| `order` | 表示順 |
| `type` | レスポンス形式（text / csv / json） |
| `list` | true のとき配列で返す → UI はタブ切り替え |
| `processor` | パース・変換ロジック（名前空間方式） |

### typeとlistの組み合わせ
- `type: csv` + `list: false` → テーブル1つ
- `type: csv` + `list: true` → テーブルの配列（タブ切り替え）
- `type: json` + `list: true` → JSON の配列（タブ切り替え）

### processorの拡張性
- 名前空間方式：`default.receipt_formatter` / `{user_name}.{processor_name}`
- 今は `default` のみ実装。カスタムprocessorは将来対応
- Python のモジュールパスと対応させることで動的 import が可能

## 参考
- セッション履歴：2026-03-29
