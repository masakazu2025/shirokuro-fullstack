---
status: active
updated: 2026-03-22
---

# Skills一覧

Claude Codeの `.claude/commands/` に配置するカスタムコマンド。
`/コマンド名` で呼び出せる。

---

## 実装済み

### `/phase`

現在の作業フェーズを宣言する。CLAUDE.mdの対応セクションのルールに従う。

```
/phase idea   → ブレストフェーズ（議論・整理のみ。ファイルを自分から作らない）
/phase doc    → ドキュメントフェーズ（docs/requirements/, docs/api/ のみ触る）
/phase test   → テストフェーズ（tests/ のみ触る）
/phase impl   → 実装フェーズ（src/ のみ触る）
```

---

## 将来候補

慣れてきたら1つずつ追加する。

| コマンド | 内容 |
|----------|------|
| `/commit` | コミットメッセージを生成してコミット |
| `/start-issue` | ブランチ作成 + Projectsを In Progress に移動 |
| `/finish-issue` | PR作成 + Projectsを In Review に移動 |
| `/new-issue` | Issue起票 + Backlogに追加 |
| `/new-spec` | spec.md を作成 |
| `/new-behavior` | 振舞ファイル (FB-xxx) を作成 |
| `/new-test` | 振舞IDを確認してテストファイルを作成 |
| `/new-api` | APIエンドポイント定義を追加 |
| `/review-spec` | 仕様の整合性チェック |
| `/review-pr` | PRのコードレビュー |
