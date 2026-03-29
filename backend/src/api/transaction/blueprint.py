from __future__ import annotations
from flask import Blueprint, jsonify

bp = Blueprint("transaction", __name__)

_STUB_TRANSACTIONS = [
    {"id": "tx001", "date": "2026-03-21", "timestamp": "2026-03-21T09:00:00", "attributes": {}},
    {"id": "tx002", "date": "2026-03-21", "timestamp": "2026-03-21T10:00:00", "attributes": {}},
    {"id": "tx003", "date": "2026-03-21", "timestamp": "2026-03-21T11:00:00", "attributes": {}},
    {"id": "tx010", "date": "2026-03-22", "timestamp": "2026-03-22T09:00:00", "attributes": {}},
]

_STUB_FILES = [
    {"filename": "file_a.dat", "display_name": "ファイルA", "order": 1},
    {"filename": "file_b.dat", "display_name": "ファイルB", "order": 2},
]

_STUB_FILE_CONTENT = {
    "file_a.dat": {
        "filename": "file_a.dat",
        "display_name": "ファイルA",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "text", "value": "sample text"},
        ],
    },
    "file_b.dat": {
        "filename": "file_b.dat",
        "display_name": "ファイルB",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "text", "value": "section 1"},
            {"name": "section_2", "label": "セクション2", "type": "text", "value": "section 2"},
        ],
    },
    "file_c.dat": {
        "filename": "file_c.dat",
        "display_name": "ファイルC",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "csv", "value": [{"col1": "val1"}]},
        ],
    },
    "file_d.dat": {
        "filename": "file_d.dat",
        "display_name": "ファイルD",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "csv", "value": [{"col1": "a1"}]},
            {"name": "section_2", "label": "セクション2", "type": "csv", "value": [{"col1": "b1"}]},
        ],
    },
    "file_e.dat": {
        "filename": "file_e.dat",
        "display_name": "ファイルE",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "json", "value": {"key": "value"}},
        ],
    },
    "file_f.dat": {
        "filename": "file_f.dat",
        "display_name": "ファイルF",
        "data": [
            {"name": "section_1", "label": "セクション1", "type": "json", "value": {"key": "val1"}},
            {"name": "section_2", "label": "セクション2", "type": "json", "value": {"key": "val2"}},
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
    if tx_id == "tx003":
        return jsonify([])
    return jsonify(_STUB_FILES)


@bp.get("/terminals/<terminal_id>/transactions/<date>/<tx_id>/files/<filename>")
def get_file(terminal_id: str, date: str, tx_id: str, filename: str):
    return jsonify(_STUB_FILE_CONTENT.get(filename, {}))
