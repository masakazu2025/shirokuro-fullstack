import pytest
from pathlib import Path

from domain.transaction.transaction import FileConfig
from infra.repository.local_transaction_repository import LocalTransactionRepository


@pytest.fixture
def repo(tmp_path):
    root = tmp_path / "transactions"

    tx1 = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx1.mkdir(parents=True)
    (tx1 / "file_a.dat").write_text("hello world", encoding="utf-8")
    (tx1 / "file_b.dat").write_text("another file", encoding="utf-8")

    tx2 = root / "t1" / "2026-03-21" / "TX-20260321103022"
    tx2.mkdir(parents=True)
    # ファイルなし

    tx3 = root / "t1" / "2026-03-22" / "TX-20260322090000"
    tx3.mkdir(parents=True)
    (tx3 / "file_c.dat").write_text("day2 content", encoding="utf-8")

    return LocalTransactionRepository(root)


# --- find_transactions ---

def test_find_transactions_all(repo):
    result = repo.find_transactions("t1")
    assert len(result) == 3


def test_find_transactions_by_date(repo):
    result = repo.find_transactions("t1", date="2026-03-21")
    assert len(result) == 2
    assert all(tx.date == "2026-03-21" for tx in result)


def test_find_transactions_timestamp_parsed(repo):
    result = repo.find_transactions("t1", date="2026-03-21")
    tx = next(tx for tx in result if tx.id == "TX-20260321091234")
    assert tx.timestamp == "2026-03-21T09:12:34"


def test_find_transactions_date_fallback_when_no_digits(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-UNKNOWN"
    tx.mkdir(parents=True)
    repo = LocalTransactionRepository(root)
    result = repo.find_transactions("t1")
    assert result[0].timestamp == "2026-03-21T00:00:00"


def test_find_transactions_empty_when_no_terminal(repo):
    assert repo.find_transactions("unknown") == []


def test_find_transactions_empty_when_no_date_data(repo):
    assert repo.find_transactions("t1", date="9999-01-01") == []


# --- find_transaction_files ---

def test_find_transaction_files(repo):
    result = repo.find_transaction_files("t1", "TX-20260321091234")
    filenames = [f.filename for f in result]
    assert "file_a.dat" in filenames
    assert "file_b.dat" in filenames
    assert all(f.display_name is None for f in result)
    assert all(f.order is None for f in result)


def test_find_transaction_files_empty_tx(repo):
    result = repo.find_transaction_files("t1", "TX-20260321103022")
    assert result == []


def test_find_transaction_files_tx_not_found(repo):
    result = repo.find_transaction_files("t1", "TX-99999999999999")
    assert result == []


# --- get_transaction_file_content ---

def test_get_transaction_file_content(repo):
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "file_a.dat")
    assert result is not None
    assert result.filename == "file_a.dat"
    assert result.display_name is None
    assert len(result.data) == 1
    assert result.data[0].type == "text"
    assert result.data[0].value == "hello world"
    assert result.warnings == []


def test_get_transaction_file_content_not_found(repo):
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "missing.dat")
    assert result is None


def test_get_transaction_file_content_tx_not_found(repo):
    result = repo.get_transaction_file_content("t1", "TX-99999999999999", "file_a.dat")
    assert result is None


# --- binary ---

def test_binary_file_returns_binary_type(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "data.bin").write_bytes(b"\x00\x01\x02\x03binary content")
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "data.bin")
    assert result is not None
    assert result.data[0].type == "binary"
    assert result.data[0].value is None
    assert result.warnings == []


# --- encoding ---

def test_encoding_config_used_when_specified(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "sjis.dat").write_bytes("テスト".encode("cp932"))
    configs = [FileConfig(filename_pattern=r"sjis\.dat", encoding="cp932")]
    repo = LocalTransactionRepository(root, file_configs=configs)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "sjis.dat")
    assert result is not None
    assert result.data[0].value == "テスト"
    assert result.warnings == []


def test_encoding_warning_when_replace_used(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    # CP932でもUTF-8でも正常に読めないバイト列
    (tx / "broken.dat").write_bytes(b"\x80\x81\x82")
    # UTF-8 で読むよう config 指定（UTF-8 では無効なバイト列）
    configs = [FileConfig(filename_pattern=r"broken\.dat", encoding="utf-8")]
    repo = LocalTransactionRepository(root, file_configs=configs)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "broken.dat")
    assert result is not None
    assert len(result.warnings) == 1
    assert "encoding error" in result.warnings[0]


# --- 拡張子による type 判定 ---

def test_csv_extension_returns_csv_type(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "data.csv").write_text("val1,val2\nval3,val4", encoding="utf-8")
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "data.csv")
    assert result is not None
    assert result.data[0].type == "csv"
    assert result.data[0].value == [{"col_0": "val1", "col_1": "val2"}, {"col_0": "val3", "col_1": "val4"}]
    assert result.warnings == []


def test_json_extension_returns_json_type(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "data.json").write_text('{"key": "value"}', encoding="utf-8")
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "data.json")
    assert result is not None
    assert result.data[0].type == "json"
    assert result.data[0].value == {"key": "value"}
    assert result.warnings == []


def test_csv_parse_failure_falls_back_to_text(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "data.csv").write_text("", encoding="utf-8")
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "data.csv")
    assert result is not None
    assert result.data[0].type == "text"
    assert len(result.warnings) == 1
    assert "csv parse error" in result.warnings[0]


def test_json_parse_failure_falls_back_to_text(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    (tx / "data.json").write_text("not json", encoding="utf-8")
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "data.json")
    assert result is not None
    assert result.data[0].type == "text"
    assert len(result.warnings) == 1
    assert "json parse error" in result.warnings[0]


def test_encoding_fallback_cp932_to_utf8(tmp_path):
    root = tmp_path / "transactions"
    tx = root / "t1" / "2026-03-21" / "TX-20260321091234"
    tx.mkdir(parents=True)
    # UTF-8 のみ有効なバイト列（CP932 では読めない）
    (tx / "utf8only.dat").write_bytes("日本語".encode("utf-8"))
    repo = LocalTransactionRepository(root)
    result = repo.get_transaction_file_content("t1", "TX-20260321091234", "utf8only.dat")
    assert result is not None
    assert result.data[0].value == "日本語"
    assert result.warnings == []
