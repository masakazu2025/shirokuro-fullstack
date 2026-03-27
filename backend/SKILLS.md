---
status: active
updated: 2026-03-27
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
/phase dev    → 開発フェーズ（src/ / tests/ / docs/ を問わず作業を進める）
```

---

## 将来候補

慣れてきたら1つずつ追加する。

| コマンド | 内容 |
|----------|------|
| `/commit` | コミットメッセージを生成してコミット |
| `/new-behavior` | 振舞ファイル (FB-xxx) を作成 |
| `/new-test` | 振舞IDを確認してテストファイルを作成 |
| `/new-api` | APIエンドポイント定義を追加 |
| `/review-pr` | PRのコードレビュー |
