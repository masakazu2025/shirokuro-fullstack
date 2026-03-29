---
status: active
---

# プロジェクト概要

## 目的

Windowsアプリの結合テストサポートツール。

テスト担当者が、リモート端末のデータ収集・閲覧・整理・提出を効率的に行えるようにする。

## 実装スコープ（最小構成）

- **端末管理** — 端末IPの登録・削除・監視ON/OFF
- **取引閲覧** — 収集した取引データの閲覧・フィルタ
- **設定** — 各種設定

## 技術スタック

```
shirokuro-fullstack/
├── frontend/   # React + TypeScript + FluentUI v9（Electron対応は最終フェーズ）
└── backend/    # Python / Flask / pandas（クリーンアーキテクチャ）
```

## 開発方針

- フロントのUIから必要なデータを決め、それがAPIを規定する
- APIスキーマは `docs/api/` で管理する（フロント・バック共通の契約）
- ブラウザで動く状態を維持する（Electronラップは最終フェーズ）
- クリーンアーキテクチャ採用

## 利用モジュールの制約

Google / Meta / X / Microsoft / Anaconda 製のものに限る。それ以外は都度確認。
