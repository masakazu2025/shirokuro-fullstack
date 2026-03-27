# src/CLAUDE.md

## 実装の原則

- over-engineering禁止。指示された範囲のみ実装する
- モジュール制約を守る（Google / Meta / X / Microsoft / Anaconda製のみ）
- 新しいパッケージを追加する場合は必ずユーザーに確認する

## ディレクトリ構成

```
src/
├── main/          # Electronメインプロセス
├── preload/       # プリロードスクリプト
└── renderer/
    └── src/
        ├── components/  # 機能別コンポーネント
        └── mock/        # モックデータ（API接続前の仮データ）
```

## APIとの接続方針

- バックエンドとの接続は現在未実装（モックデータ使用中）
- Base URL: `http://localhost:4696/api`
- APIクライアント層を通じて呼び出す（コンポーネントから直接fetchしない）
