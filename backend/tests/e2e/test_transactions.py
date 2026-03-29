import pytest
from pathlib import Path


def _add_terminal(client, ip="192.168.1.101"):
    res = client.post("/api/terminals", json=[{"ip": ip}])
    return res.json[0]["id"]


@pytest.fixture
def tx_fixture(client, tmp_path):
    """端末を登録し、取引ファイルのディレクトリ構造を作成する"""
    terminal_id = _add_terminal(client)
    root: Path = tmp_path / "transactions" / terminal_id

    # 2026-03-21 / tx001 / file_a.dat
    tx_dir = root / "2026-03-21" / "tx001"
    tx_dir.mkdir(parents=True)
    (tx_dir / "file_a.dat").write_text("col1,col2\nval1,val2", encoding="utf-8")

    # 2026-03-21 / tx002 / file_b.dat
    tx_dir2 = root / "2026-03-21" / "tx002"
    tx_dir2.mkdir(parents=True)
    (tx_dir2 / "file_b.dat").write_text("hello", encoding="utf-8")

    # 2026-03-22 / tx003 / file_c.dat
    tx_dir3 = root / "2026-03-22" / "tx003"
    tx_dir3.mkdir(parents=True)
    (tx_dir3 / "file_c.dat").write_text("line1\nline2", encoding="utf-8")

    return {"terminal_id": terminal_id, "root": root}


# --- GET /terminals/:id/transactions ---

def test_list_all_transactions_returns_flat_list(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) == 3
    tx = data[0]
    assert "id" in tx
    assert "date" in tx
    assert "timestamp" in tx


def test_list_all_transactions_not_found(client):
    res = client.get("/api/terminals/nonexistent/transactions")
    assert res.status_code == 404


# --- GET /terminals/:id/transactions/:date ---

def test_list_transactions_by_date(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2026-03-21")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) == 2
    assert all(tx["date"] == "2026-03-21" for tx in data)


def test_list_transactions_by_date_not_found_terminal(client):
    res = client.get("/api/terminals/nonexistent/transactions/2026-03-21")
    assert res.status_code == 404


def test_list_transactions_by_date_not_found_date(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2099-01-01")
    assert res.status_code == 404


# --- GET /terminals/:id/transactions/:date/:tx_id/files ---

def test_list_files(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2026-03-21/tx001/files")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) == 1
    f = data[0]
    assert "filename" in f
    assert "display_name" in f
    assert "order" in f


def test_list_files_not_found_terminal(client):
    res = client.get("/api/terminals/nonexistent/transactions/2026-03-21/tx001/files")
    assert res.status_code == 404


def test_list_files_not_found_tx(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2026-03-21/nonexistent/files")
    assert res.status_code == 404


# --- GET /terminals/:id/transactions/:date/:tx_id/files/:filename ---

def test_get_file(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2026-03-21/tx001/files/file_a.dat")
    assert res.status_code == 200
    data = res.json
    assert data["filename"] == "file_a.dat"
    assert "display_name" in data
    assert "data" in data
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1
    section = data["data"][0]
    assert "name" in section
    assert "label" in section
    assert "type" in section
    assert "value" in section


def test_get_file_not_found_terminal(client):
    res = client.get("/api/terminals/nonexistent/transactions/2026-03-21/tx001/files/file_a.dat")
    assert res.status_code == 404


def test_get_file_not_found_file(client, tx_fixture):
    tid = tx_fixture["terminal_id"]
    res = client.get(f"/api/terminals/{tid}/transactions/2026-03-21/tx001/files/nonexistent.dat")
    assert res.status_code == 404
