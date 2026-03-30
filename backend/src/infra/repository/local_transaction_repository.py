from __future__ import annotations
from pathlib import Path

from domain.transaction.transaction import Transaction, TransactionFile, FileContent
from usecase.transaction.port import TransactionRepository


class LocalTransactionRepository(TransactionRepository):
    def __init__(self, root: Path) -> None:
        self._root = root

    def find_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]:
        raise NotImplementedError

    def find_transaction_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]:
        raise NotImplementedError

    def get_transaction_file_content(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None:
        raise NotImplementedError
