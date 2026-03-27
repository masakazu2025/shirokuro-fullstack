---
status: active
---

# リポジトリ・開発フロー

## リポジトリ構成

フロントエンドとバックエンドは**別リポジトリ**で管理する。

| リポジトリ | 内容 |
|-----------|------|
| `shirokuro-frontend` | Reactフロント実装 + docs/（仕様・振舞・APIスキーマ） |
| `shirokuro-backend` | Flask API実装 + docs/（実装上の制約・設計判断） |

### 分離の理由

- フロントのみ修正するときにバックへの影響を防ぐ
- エージェントが意図せず両側を修正することを物理的に防ぐ
- 変更の影響範囲をリポジトリレベルで明確にする

### APIスキーマの所在

`shirokuro-frontend/docs/api/` に置く。フロントのUIから必要なデータが決まり、それがAPIを規定するため、フロントが正となる。

### バックエンドでのAPI参照方法

git sparse-checkout で `shirokuro-frontend` の `docs/api/` だけを取得し、`docs/api/` にシンボリックリンクで参照する。

```bash
# 初回セットアップ
git clone --no-checkout git@github.com:masakazu2025/shirokuro-frontend.git .frontend-api
cd .frontend-api
git sparse-checkout init --cone
git sparse-checkout set docs/api
git checkout main
cd ..

# シンボリックリンクを作成
ln -s ../.frontend-api/docs/api docs/api
```

- `.frontend-api/` と `docs/api` は `.gitignore` に追加し、自リポジトリには含めない
- APIスキーマが更新されたら `.frontend-api/` で `git pull` する

```bash
cd .frontend-api && git pull
```

## 公開範囲

パブリックリポジトリ。ポートフォリオとして公開するため、コードの品質・ドキュメントの整備を意識する。
ただし社内固有の情報（IPアドレス・業務用語）はコードに直書きしない。

## タスク・進捗管理

タスク管理は **GitHub Projects（カンバン）+ GitHub Issues** で一元管理する。`tasks/` フォルダは使わない。

- **人間** → GitHub ProjectsのボードでTodo/In Progress/Doneを視覚的に把握
- **AI** → `gh` コマンドでIssueの参照・作成・ステータス更新

### 開発の流れ

```
Issue起票（何をなぜやるか）
  ↓
docs/requirements/ の spec.md を更新（approved）
  ↓
振舞を作成・更新（approved）
  ↓
テスト作成（Red確認）
  ↓
実装（Green確認）
  ↓
PRを出す（Closes #Issue番号）
```

## Issue管理

GitHub Issueを利用する。

| ラベル | 用途 |
|--------|------|
| `feature` | 新機能 |
| `bug` | バグ |
| `docs` | ドキュメントのみ |
| `refactor` | リファクタリング |
| `test` | テストの追加・修正 |
| `chore` | 雑務（依存更新・設定変更など） |
| `question` | 議論・確認待ち |

- ブランチは対応するIssue番号を含める（例: `feature/42-terminal-sort`）
- PRにはIssue番号を記載し、マージ時に自動クローズする（`Closes #42`）

## ブランチ戦略（GitHub Flow）

```
main  ←  feature/xxx   （機能追加・仕様変更）
main  ←  fix/xxx       （バグ修正）
main  ←  hotfix/xxx    （本番緊急対応）
main  ←  docs/xxx      （ドキュメントのみの変更）
main  ←  refactor/xxx  （リファクタリング）
```

### ルール

- `main` は常に動作する状態を維持する
- `develop` ブランチは使わない
- すべての変更はブランチを切ってPRでマージする
- PRレビュー後にマージ

### ブランチ命名規則

| プレフィックス | 用途 | 例 |
|-------------|------|---|
| `feature/` | 機能追加・仕様変更 | `feature/terminal-sort` |
| `fix/` | バグ修正 | `fix/terminal-ip-validation` |
| `hotfix/` | 本番緊急対応 | `hotfix/crash-on-startup` |
| `docs/` | ドキュメントのみの変更 | `docs/terminal-spec` |
| `refactor/` | リファクタリング | `refactor/extract-api-client` |

### hotfixの流れ

```
main → hotfix/xxx → PR → main
```

緊急度が高い場合でも必ずPRを通す。直接pushは禁止。

