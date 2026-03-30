import pytest

from domain.transaction.transaction import Transaction, TransactionFile, FileContent, Section
from usecase.transaction.transaction_usecase import TransactionUsecase
from tests.unit.fake.fake_transaction_repository import FakeTransactionRepository


TX1 = Transaction(id="0001", date="2026-03-21", timestamp="2026-03-21T09:00:00", attributes={})
TX2 = Transaction(id="0002", date="2026-03-21", timestamp="2026-03-21T10:00:00", attributes={})
TX3 = Transaction(id="0003", date="2026-03-22", timestamp="2026-03-22T09:00:00", attributes={})

FILE_A = TransactionFile(filename="file_a.dat", display_name="ファイルA", order=1)
FILE_B = TransactionFile(filename="file_b.dat", display_name="ファイルB", order=2)

CONTENT_A = FileContent(
    filename="file_a.dat",
    display_name="ファイルA",
    data=[Section(name="section_1", label="セクション1", type="text", value="sample text")],
)


# --- list_transactions ---

def test_list_transactions_returns_all():
    repo = FakeTransactionRepository(transactions=[TX1, TX2, TX3])
    usecase = TransactionUsecase(repo)
    result = usecase.list_transactions("t1")
    assert len(result) == 3


def test_list_transactions_filters_by_date():
    repo = FakeTransactionRepository(transactions=[TX1, TX2, TX3])
    usecase = TransactionUsecase(repo)
    result = usecase.list_transactions("t1", date="2026-03-21")
    assert len(result) == 2
    assert all(tx.date == "2026-03-21" for tx in result)


def test_list_transactions_returns_empty_when_no_match():
    repo = FakeTransactionRepository(transactions=[TX1, TX2, TX3])
    usecase = TransactionUsecase(repo)
    result = usecase.list_transactions("t1", date="2099-01-01")
    assert result == []


# --- list_files ---

def test_list_files_returns_files_for_tx():
    repo = FakeTransactionRepository(files={"0001": [FILE_A, FILE_B]})
    usecase = TransactionUsecase(repo)
    result = usecase.list_files("t1", "0001")
    assert len(result) == 2
    assert result[0].filename == "file_a.dat"
    assert result[1].filename == "file_b.dat"


def test_list_files_returns_empty_when_no_files():
    repo = FakeTransactionRepository(files={})
    usecase = TransactionUsecase(repo)
    result = usecase.list_files("t1", "0001")
    assert result == []


# --- get_file ---

def test_get_file_returns_content():
    repo = FakeTransactionRepository(file_contents={"file_a.dat": CONTENT_A})
    usecase = TransactionUsecase(repo)
    result = usecase.get_file("t1", "0001", "file_a.dat")
    assert result is not None
    assert result.filename == "file_a.dat"
    assert len(result.data) == 1
    assert result.data[0].type == "text"
    assert result.data[0].value == "sample text"


def test_get_file_returns_none_when_not_found():
    repo = FakeTransactionRepository(file_contents={})
    usecase = TransactionUsecase(repo)
    result = usecase.get_file("t1", "0001", "missing.dat")
    assert result is None
