---
status: active
updated: 2026-03-30
---

# Transaction 設計

## レイヤー構成

```mermaid
flowchart TD
    subgraph api["api"]
        BP["blueprint.py\nlist_transactions\nlist_files\nget_file"]
    end

    subgraph usecase["usecase"]
        UC["TransactionUsecase\n- list_transactions(terminal_id, date?)\n- list_files(terminal_id, tx_id)\n- get_file(terminal_id, tx_id, filename)"]
        PORT["TransactionRepository (ABC)\n- find_transactions(terminal_id, date?)\n- find_transaction_files(terminal_id, tx_id)\n- get_transaction_file_content(terminal_id, tx_id, filename)"]
    end

    subgraph domain["domain"]
        TX["Transaction\n- id: str\n- date: str\n- timestamp: str\n- attributes: dict[str, str]"]
        TF["TransactionFile\n- filename: str\n- display_name: str | None\n- order: int | None"]
        FC["FileContent\n- filename: str\n- display_name: str | None\n- data: list[Section]"]
        SEC["Section\n- name: str\n- label: str\n- type: str\n- value: Any"]
    end

    subgraph infra["infra"]
        REPO["LocalTransactionRepository"]
    end

    BP --> UC
    UC --> PORT
    REPO --> PORT
    UC --> domain
    REPO --> domain
```

## 未解決の設計論点

### `terminal_id` とディレクトリ名の対応

`LocalTransactionRepository` は `root/<terminal_id>/` を走査する。
`terminal_id` に **IPアドレス** を使うか **ID**（`T001` 等）を使うかは保留。

| | IP アドレス | ID |
|---|---|---|
| メリット | 人間が見てどの端末かわかる | 安定・IP変更に強い |
| デメリット | IP変更で壊れる | ディレクトリ単体では端末の紐付け不明 |

収集フローの設計が決まるタイミングで合わせて決定する。

---

## ポート設計の意図

- `TransactionRepository` をABCとして切ることで、infraの差し替えを可能にする
- 取得元が「ローカルファイル」から「リモート」に変わっても usecase は触らない
- テスト時は `FakeTransactionRepository` に差し替えてファイルシステムなしでテストできる

