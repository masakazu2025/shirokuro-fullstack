from __future__ import annotations
from flask import Blueprint, jsonify, request, current_app

from usecase.terminal.terminal_usecase import TerminalUsecase
from usecase.terminal.probe_port import TerminalProbe

bp = Blueprint("terminal", __name__)


def _usecase() -> TerminalUsecase:
    return current_app.config["terminal_usecase"]

def _probe() -> TerminalProbe:
    return current_app.config["terminal_probe"]


@bp.get("/terminals/online")
def get_online():
    status = _usecase().get_status(_probe())
    return jsonify(status)


@bp.get("/terminals")
def list_terminals():
    terminals = _usecase().list_terminals()
    return jsonify([t.to_dict() for t in terminals])


@bp.post("/terminals")
def add_terminals():
    body = request.get_json(force=True, silent=True)
    if not isinstance(body, list) or len(body) == 0:
        return jsonify({"error": "リクエストボディはJSON配列で送信してください"}), 400

    created, errors = _usecase().add_terminals(body)

    if not created and errors:
        first = errors[0]
        return jsonify({"error": first["message"]}), first["code"]

    return jsonify([t.to_dict() for t in created]), 201


@bp.patch("/terminals/<terminal_id>")
def update_terminal(terminal_id: str):
    body = request.get_json(force=True, silent=True) or {}
    terminal = _usecase().update_terminal(terminal_id, body)
    if terminal is None:
        return jsonify({"error": "端末が見つかりません"}), 404
    return jsonify(terminal.to_dict())


@bp.delete("/terminals/<terminal_id>")
def delete_terminal(terminal_id: str):
    ok = _usecase().delete_terminal(terminal_id)
    if not ok:
        return jsonify({"error": "端末が見つかりません"}), 404
    return jsonify({"id": terminal_id})


@bp.delete("/terminals")
def delete_terminals():
    body = request.get_json(force=True, silent=True) or {}
    ids = body.get("ids", [])
    if not isinstance(ids, list):
        return jsonify({"error": "ids は配列で送信してください"}), 400
    deleted = _usecase().delete_terminals(ids)
    return jsonify({"ids": deleted})


# =============================================================================
# Transactions
# =============================================================================

_STUB_TRANSACTIONS = [
    {"id": "tx001", "date": "2026-03-21", "timestamp": "2026-03-21T09:12:34", "attributes": {}},
    {"id": "tx002", "date": "2026-03-21", "timestamp": "2026-03-21T10:30:22", "attributes": {}},
    {"id": "tx003", "date": "2026-03-21", "timestamp": "2026-03-21T11:00:00", "attributes": {}},
    {"id": "tx010", "date": "2026-03-22", "timestamp": "2026-03-22T09:00:00", "attributes": {}},
]

_STUB_FILES_TX001 = [
    {"filename": "file_a.dat", "display_name": "ファイルA（テキスト・単一）", "order": 1},
    {"filename": "file_b.dat", "display_name": "ファイルB（テキスト・複数）", "order": 2},
    {"filename": "file_c.dat", "display_name": "ファイルC（CSV・単一）",      "order": 3},
    {"filename": "file_d.dat", "display_name": "ファイルD（CSV・複数）",      "order": 4},
    {"filename": "file_e.dat", "display_name": "ファイルE（JSON・単一）",     "order": 5},
    {"filename": "file_f.dat", "display_name": "ファイルF（JSON・複数）",     "order": 6},
]

_STUB_FILES_TX002 = [
    {"filename": "file_a.dat", "display_name": "ファイルA", "order": 1},
]

_STUB_FILES = {
    "tx001": _STUB_FILES_TX001,
    "tx002": _STUB_FILES_TX002,
    "tx003": [],
}

_STUB_FILE_CONTENT = {
    "file_a.dat": {
        "filename": "file_a.dat",
        "display_name": "ファイルA（テキスト・単一）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "text",
             "value": "Line 1: Sample text content\nLine 2: Another line\nLine 3: End of file"},
        ],
    },
    "file_b.dat": {
        "filename": "file_b.dat",
        "display_name": "ファイルB（テキスト・複数）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "text", "value": "Section 1 line A\nSection 1 line B"},
            {"name": "section_2", "label": "セクション2", "type": "text", "value": "Section 2 line A\nSection 2 line B"},
        ],
    },
    "file_c.dat": {
        "filename": "file_c.dat",
        "display_name": "ファイルC（CSV・単一）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "csv", "value": [
                {"col1": "val1-1", "col2": "val1-2", "col3": "val1-3"},
                {"col1": "val2-1", "col2": "val2-2", "col3": "val2-3"},
                {"col1": "val3-1", "col2": "val3-2", "col3": "val3-3"},
            ]},
        ],
    },
    "file_d.dat": {
        "filename": "file_d.dat",
        "display_name": "ファイルD（CSV・複数）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "csv", "value": [
                {"col1": "a1", "col2": "a2"},
                {"col1": "a3", "col2": "a4"},
            ]},
            {"name": "section_2", "label": "セクション2", "type": "csv", "value": [
                {"col1": "b1", "col2": "b2"},
                {"col1": "b3", "col2": "b4"},
            ]},
        ],
    },
    "file_e.dat": {
        "filename": "file_e.dat",
        "display_name": "ファイルE（JSON・単一）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "json",
             "value": {"key1": "value1", "key2": 42, "key3": True, "key4": None}},
        ],
    },
    "file_f.dat": {
        "filename": "file_f.dat",
        "display_name": "ファイルF（JSON・複数）",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "json", "value": {"type": "section1", "items": [1, 2, 3]}},
            {"name": "section_2", "label": "セクション2", "type": "json", "value": {"type": "section2", "items": [4, 5, 6]}},
        ],
    },
}


@bp.get("/terminals/<terminal_id>/transactions")
def list_transactions(terminal_id: str):
    return jsonify(_STUB_TRANSACTIONS)


@bp.get("/terminals/<terminal_id>/transactions/<date>")
def list_transactions_by_date(terminal_id: str, date: str):
    return jsonify([tx for tx in _STUB_TRANSACTIONS if tx["date"] == date])


@bp.get("/terminals/<terminal_id>/transactions/<date>/<tx_id>/files")
def list_files(terminal_id: str, date: str, tx_id: str):
    return jsonify(_STUB_FILES.get(tx_id, []))


@bp.get("/terminals/<terminal_id>/transactions/<date>/<tx_id>/files/<filename>")
def get_file(terminal_id: str, date: str, tx_id: str, filename: str):
    return jsonify(_STUB_FILE_CONTENT.get(filename, {}))
