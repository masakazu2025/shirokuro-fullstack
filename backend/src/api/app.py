from __future__ import annotations
import logging
import os
from pathlib import Path
from flask import Flask, jsonify, request

from infra.config.file_config_loader import load_file_configs
from infra.logger import setup_logging
from infra.repository.terminal_json_repository import TerminalJsonRepository
from infra.repository.local_transaction_repository import LocalTransactionRepository
from infra.system.terminal_probe import WindowsTerminalProbe
from infra.worker.monitoring_worker import MonitoringWorker
from usecase.terminal.terminal_usecase import TerminalUsecase
from usecase.terminal.probe_port import TerminalProbe
from usecase.transaction.transaction_usecase import TransactionUsecase

logger = logging.getLogger(__name__)


def create_app(data_dir: Path | None = None, probe: TerminalProbe | None = None, transactions_root: Path | None = None) -> Flask:
    setup_logging()
    app = Flask(__name__)

    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent / "data"

    repo = TerminalJsonRepository(data_dir / "terminals.json")
    usecase = TerminalUsecase(repo)
    if probe is None:
        probe = WindowsTerminalProbe()
    app.config["terminal_usecase"] = usecase
    app.config["terminal_probe"] = probe
    tx_root = transactions_root or Path(__file__).parent.parent.parent / "data" / "transactions"
    file_config_path = Path(__file__).parent.parent.parent / "data" / "file_config.json"
    file_configs = load_file_configs(file_config_path)
    tx_repo = LocalTransactionRepository(tx_root, file_configs=file_configs)
    app.config["transaction_usecase"] = TransactionUsecase(tx_repo)

    interval = int(os.environ.get("MONITORING_INTERVAL_SEC", "60"))
    worker = MonitoringWorker(repo, interval_sec=interval)
    app.config["monitoring_worker"] = worker
    worker.start()

    logger.info("[startup] probing all terminals...")
    usecase.probe_and_save(probe)
    logger.info("[startup] probe complete")

    @app.after_request
    def add_cors(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        return response

    @app.route("/api/<path:path>", methods=["OPTIONS"])
    @app.route("/api", methods=["OPTIONS"])
    def options_handler(**_):
        return "", 204

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    from api.terminal.blueprint import bp as terminal_bp
    app.register_blueprint(terminal_bp, url_prefix="/api")

    return app
