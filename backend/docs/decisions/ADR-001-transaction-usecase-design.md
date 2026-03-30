---
id: ADR-001
title: Transaction usecaseの設計方針
date: 2026-03-30
status: active
---

## 背景

Transaction閲覧APIのスタブ実装が完了した段階で、usecase以降のレイヤーを実装する方針を決定した。

## 決定事項

### クラス構成

- `TransactionUsecase` を新規作成する（`TerminalUsecase` とは分離）
- `TransactionRepository`（ABC）をポートとして定義する

### usecaseのメソッド

```python
class TransactionUsecase:
    def list_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]
    def list_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]
    def get_file(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None
```

- `date` はオプション引数で統一（メソッドを分割しない）
- dateフィルタは usecase 内で行わず、port に委譲する（infraがディレクトリ構造で最適化できるため）

### ポートのメソッド

```python
class TransactionRepository(ABC):
    def find_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]
    def find_transaction_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]
    def get_transaction_file_content(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None
```

- メソッド名は冗長でも `transaction` を含めて統一する（省略すると他メソッドとの関係が見えにくいため）

### domainの型

```python
@dataclass
class Transaction:
    id: str                     # "0001" 形式（0埋め文字列）
    date: str                   # "2026-03-21"
    timestamp: str              # "2026-03-21T09:12:34"
    attributes: dict[str, str]  # config由来のメタデータ

@dataclass
class TransactionFile:
    filename: str
    display_name: str | None = None  # 設定ファイルになければ None
    order: int | None = None         # 設定ファイルになければ None

@dataclass
class Section:
    name: str
    label: str
    type: str    # "text" / "csv" / "json" など
    value: Any   # typeによって型が変わる

@dataclass
class FileContent:
    filename: str
    display_name: str | None
    data: list[Section]
```

## 判断の理由

- ポートを切ることで、infraの差し替えとテストでのFake使用を可能にする
- `LocalTransactionRepository` はスケルトンから始め、実装は後続フェーズで行う
- `DisplayConfigRepository`（表示設定の取得）は config 未定義のため今フェーズはスコープ外

## 関連

- `docs/design/transaction.md` — レイヤー構成図
- `docs/api/terminals/transactions.md` — APIスキーマ
- `tasks/TASK-004.md` — レビュープロセス整備（未対応）
