from __future__ import annotations

from domain.transaction.transaction import Transaction, TransactionFile, FileContent, Section
from usecase.transaction.port import TransactionRepository


class FakeTransactionRepository(TransactionRepository):
    def __init__(
        self,
        transactions: list[Transaction] | None = None,
        files: dict[str, list[TransactionFile]] | None = None,
        file_contents: dict[str, FileContent] | None = None,
    ) -> None:
        self._transactions = transactions or []
        self._files = files or {}
        self._file_contents = file_contents or {}

    def find_transactions(self, terminal_id: str, date: str | None = None) -> list[Transaction]:
        txs = self._transactions
        if date:
            txs = [tx for tx in txs if tx.date == date]
        return txs

    def find_transaction_files(self, terminal_id: str, tx_id: str) -> list[TransactionFile]:
        return self._files.get(tx_id, [])

    def get_transaction_file_content(self, terminal_id: str, tx_id: str, filename: str) -> FileContent | None:
        return self._file_contents.get(filename)
