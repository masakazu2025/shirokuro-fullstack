---
status: active
---

# プロジェクト概要

## 目的

ウォーターフォール開発における、Windows POSアプリの結合テストサポートツール。

テスト担当者が、リモート端末のデータ収集・閲覧・整理・提出を効率的に行えるようにする。

## 主な機能

- **端末管理** — 端末IPの登録・削除・監視ON/OFF
- **取引閲覧** — 収集した取引データの閲覧・フィルタ
- **画像閲覧** — 収集した画像データの閲覧
- **テスト仕様書** — Excelテスト仕様書と連携したフォルダ管理・資料保存
- **設定** — 各種設定

## 技術スタック

### フロントエンド（shirokuro-frontend）
- Electron（最終的にラップ、開発中はブラウザで動作）
- React + TypeScript
- FluentUI v9（`@fluentui/react-components`）
- Vite（electron-vite）

### バックエンド（shirokuro-backend）
- Python / Flask
- pandas
- 現行ソースをAPIとして切り出す形で移植

## 開発方針

- UIを先に固め、UIの操作からAPIを規定する（フロント駆動）
- バックエンドはAPIを実装する側
- Electron固有の機能（ファイルパス取得・サーバー自動起動）は最後にラップ時に対応
- それ以外はHTTP REST API経由で実装し、ブラウザでも動く状態を維持する
- クリーンアーキテクチャ採用

## 利用モジュールの制約

以下企業リリースのもの：Google / Meta / X / Microsoft、およびAnaconda。
それ以外のモジュールは都度申請が必要なものとし、必ず確認を行う

> ドキュメントはDocusaurus（Meta製）でビルドしたものを利用可能。
