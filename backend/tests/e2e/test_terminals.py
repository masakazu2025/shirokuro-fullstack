def _add(client, ip="192.168.1.101", name=None):
    body = [{"ip": ip}] if name is None else [{"ip": ip, "name": name}]
    return client.post("/api/terminals", json=body)


# B: BB-001
def test_get_terminals(client):
    _add(client)
    res = client.get("/api/terminals")
    assert res.status_code == 200
    assert len(res.json) == 1


# B: BB-002
def test_add_terminal(client):
    res = _add(client, name="端末-01")
    assert res.status_code == 201
    data = res.json[0]
    assert data["ip"] == "192.168.1.101"
    assert data["name"] == "端末-01"
    assert "id" in data


# B: BB-003
def test_delete_terminal(client):
    terminal_id = _add(client).json[0]["id"]
    res = client.delete(f"/api/terminals/{terminal_id}")
    assert res.status_code == 200
    assert res.json["id"] == terminal_id
    assert client.get("/api/terminals").json == []


# B: BB-004
def test_toggle_monitoring(client):
    terminal_id = _add(client).json[0]["id"]
    res = client.patch(f"/api/terminals/{terminal_id}", json={"monitoring": "on"})
    assert res.status_code == 200
    assert res.json["monitoring"] == "on"


# B: BB-005
def test_name_defaults_to_ip(client):
    res = client.post("/api/terminals", json=[{"ip": "192.168.1.101"}])
    assert res.status_code == 201
    assert res.json[0]["name"] == "192.168.1.101"
