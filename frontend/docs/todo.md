---
status: active
updated: 2026-03-22
---

# やるべきタスク一覧

リポジトリ・Projects準備が完了したあとのタスク。
優先度順に並べる。

---

## 🔴 優先度：高

### リポジトリ整備
- [x] 各フォルダにCLAUDE.mdを配置する（docs/・tests/・src/）
- [x] Issueテンプレートを作成する
- [x] `shirokuro-backend` のリポジトリにも同様にCLAUDE.mdを配置する
- [x] `shirokuro-backend` で `docs/api/` をsparse-checkoutで取得する設定をREADMEに記載する

### Agent設計
- [ ] GitHub Projects操作のAgentルールを定義する
- [ ] レビュアーAgentの設計をする（仕様フローのチェック役）

### フロント実装の整備
- [ ] 端末管理：日付選択UIを追加する
- [ ] 端末管理：localstorageをやめてAPI呼び出しに切り替える準備をする（モックとAPIの切り替え層を作る）

---

## 🟡 優先度：中

### ドキュメント整備（仕様書き起こし）
- [ ] 取引閲覧：spec・schema・API定義
- [ ] 画像閲覧：spec・schema・API定義
- [ ] テスト仕様書：spec・schema・API定義
- [ ] 設定：spec・schema・API定義（ポート番号変更など）

### バックエンド骨格
- [ ] Flask APIの骨格を作成する
- [ ] `data/terminals.json` による永続化を実装する
- [ ] `GET /api/health` を実装する
- [ ] `GET /api/terminals` を実装する
- [ ] `GET /api/terminals/status`（ping + net time）を実装する

---

## 🟢 優先度：低（将来対応）

- [ ] CI/CD（GitHub Actions）：単体・結合テストの自動実行
- [ ] CI/CD：PlaywrightによるE2Eテスト
- [ ] AIレビューAgentの実装（Claude API連携）
- [ ] Electronラップ（開発の最終フェーズ）
- [ ] ピン留め機能（端末管理）
- [ ] 端末管理：自動監視ON中の採取復元実装
