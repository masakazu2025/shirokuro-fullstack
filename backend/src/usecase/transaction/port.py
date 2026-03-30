from __future__ import annotations
from abc import ABC, abstractmethod

from domain.transaction.transaction import Transaction, TransactionFile, FileContent


class TransactionRepository(ABC):
    @abstractmethod
    def find_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]: ...

    @abstractmethod
    def find_transaction_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]: ...

    @abstractmethod
    def get_transaction_file_content(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None: ...
