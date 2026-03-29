from __future__ import annotations
from flask import Blueprint, jsonify

bp = Blueprint("transaction", __name__)


@bp.get("/terminals/<terminal_id>/transactions")
def list_transactions(terminal_id: str):
    return jsonify({"error": "not implemented"}), 501


@bp.get("/terminals/<terminal_id>/transactions/<date>")
def list_transactions_by_date(terminal_id: str, date: str):
    return jsonify({"error": "not implemented"}), 501


@bp.get("/terminals/<terminal_id>/transactions/<date>/<tx_id>/files")
def list_files(terminal_id: str, date: str, tx_id: str):
    return jsonify({"error": "not implemented"}), 501


@bp.get("/terminals/<terminal_id>/transactions/<date>/<tx_id>/files/<filename>")
def get_file(terminal_id: str, date: str, tx_id: str, filename: str):
    return jsonify({"error": "not implemented"}), 501
