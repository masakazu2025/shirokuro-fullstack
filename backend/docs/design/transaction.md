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

## ポート設計の意図

- `TransactionRepository` をABCとして切ることで、infraの差し替えを可能にする
- 取得元が「ローカルファイル」から「リモート」に変わっても usecase は触らない
- テスト時は `FakeTransactionRepository` に差し替えてファイルシステムなしでテストできる

