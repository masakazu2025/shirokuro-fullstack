from __future__ import annotations

from domain.transaction.transaction import Transaction, TransactionFile, FileContent
from usecase.transaction.port import TransactionRepository


class TransactionUsecase:
    def __init__(self, repo: TransactionRepository) -> None:
        self._repo = repo

    def list_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]:
        return self._repo.find_transactions(terminal_id, date)

    def list_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]:
        return self._repo.find_transaction_files(terminal_id, tx_id)

    def get_file(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None:
        return self._repo.get_transaction_file_content(terminal_id, tx_id, filename)
