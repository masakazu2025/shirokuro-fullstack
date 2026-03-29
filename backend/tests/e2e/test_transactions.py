def test_list_all_transactions(client):
    res = client.get("/api/terminals/t1/transactions")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) >= 1
    tx = data[0]
    assert "id" in tx
    assert "date" in tx
    assert "timestamp" in tx
    assert "attributes" in tx


def test_list_transactions_by_date(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) >= 1
    assert all(tx["date"] == "2026-03-21" for tx in data)


def test_list_files(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files")
    assert res.status_code == 200
    data = res.json
    assert isinstance(data, list)
    assert len(data) >= 1
    f = data[0]
    assert "filename" in f
    assert "display_name" in f
    assert "order" in f


def _assert_file_response(res, filename: str):
    assert res.status_code == 200
    data = res.json
    assert data["filename"] == filename
    assert "display_name" in data
    assert isinstance(data["data"], list)
    assert len(data["data"]) >= 1
    section = data["data"][0]
    assert "name" in section
    assert "label" in section
    assert section["type"] in ("text", "csv", "json")
    assert "value" in section


# --- ファイル内容取得: text × 単一セクション ---
def test_get_file_text_single(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files/file_a.dat")
    _assert_file_response(res, "file_a.dat")
    assert len(res.json["data"]) == 1
    assert res.json["data"][0]["type"] == "text"


# --- ファイル内容取得: text × 複数セクション ---
def test_get_file_text_multi(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx002/files/file_b.dat")
    _assert_file_response(res, "file_b.dat")
    assert len(res.json["data"]) >= 2
    assert res.json["data"][0]["type"] == "text"


# --- ファイル内容取得: csv × 単一セクション ---
def test_get_file_csv_single(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files/file_c.dat")
    _assert_file_response(res, "file_c.dat")
    assert len(res.json["data"]) == 1
    assert res.json["data"][0]["type"] == "csv"
    assert isinstance(res.json["data"][0]["value"], list)


# --- ファイル内容取得: csv × 複数セクション ---
def test_get_file_csv_multi(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files/file_d.dat")
    _assert_file_response(res, "file_d.dat")
    assert len(res.json["data"]) >= 2
    assert res.json["data"][0]["type"] == "csv"
    assert isinstance(res.json["data"][0]["value"], list)


# --- ファイル内容取得: json × 単一セクション ---
def test_get_file_json_single(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files/file_e.dat")
    _assert_file_response(res, "file_e.dat")
    assert len(res.json["data"]) == 1
    assert res.json["data"][0]["type"] == "json"
    assert isinstance(res.json["data"][0]["value"], dict)


# --- ファイル内容取得: json × 複数セクション ---
def test_get_file_json_multi(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx001/files/file_f.dat")
    _assert_file_response(res, "file_f.dat")
    assert len(res.json["data"]) >= 2
    assert res.json["data"][0]["type"] == "json"
    assert isinstance(res.json["data"][0]["value"], dict)


# --- ファイルなしの取引 ---
def test_list_files_empty(client):
    res = client.get("/api/terminals/t1/transactions/2026-03-21/tx003/files")
    assert res.status_code == 200
    assert res.json == []
