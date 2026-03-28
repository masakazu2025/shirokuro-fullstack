from __future__ import annotations
from flask import Blueprint, jsonify, request, current_app

from usecase.terminal.terminal_usecase import TerminalUsecase
from usecase.terminal.probe_port import TerminalProbe

bp = Blueprint("terminal", __name__)


def _usecase() -> TerminalUsecase:
    return current_app.config["terminal_usecase"]

def _probe() -> TerminalProbe:
    return current_app.config["terminal_probe"]


@bp.get("/terminals/status")
def get_status():
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
