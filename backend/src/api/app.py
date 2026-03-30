from __future__ import annotations
import logging
import os
from dataclasses import dataclass
from pathlib import Path
from flask import Flask, jsonify

from infra.config.file_config_loader import load_file_configs
from infra.logger import setup_logging
from infra.repository.terminal_json_repository import TerminalJsonRepository
from infra.repository.local_transaction_repository import LocalTransactionRepository
from infra.system.terminal_probe import WindowsTerminalProbe
from infra.worker.monitoring_worker import MonitoringWorker
from usecase.terminal.terminal_usecase import TerminalUsecase
from usecase.terminal.probe_port import TerminalProbe
from usecase.transaction.transaction_usecase import TransactionUsecase
from domain.transaction.transaction import FileConfig

logger = logging.getLogger(__name__)


@dataclass
class AppContainer:
    terminal_usecase: TerminalUsecase
    transaction_usecase: TransactionUsecase
    terminal_probe: TerminalProbe
    monitoring_worker: MonitoringWorker


def build_container(
    data_dir: Path | None = None,
    probe: TerminalProbe | None = None,
    transactions_root: Path | None = None,
    file_configs: list[FileConfig] | None = None,
) -> AppContainer:
    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent / "data"

    repo = TerminalJsonRepository(data_dir / "terminals.json")
    terminal_usecase = TerminalUsecase(repo)

    if probe is None:
        probe = WindowsTerminalProbe()

    tx_root = transactions_root or data_dir / "transactions"

    if file_configs is None:
        file_config_path = data_dir / "file_config.json"
        file_configs = load_file_configs(file_config_path)

    tx_repo = LocalTransactionRepository(tx_root, file_configs=file_configs)
    transaction_usecase = TransactionUsecase(tx_repo)

    interval = int(os.environ.get("MONITORING_INTERVAL_SEC", "60"))
    worker = MonitoringWorker(repo, interval_sec=interval)

    return AppContainer(
        terminal_usecase=terminal_usecase,
        transaction_usecase=transaction_usecase,
        terminal_probe=probe,
        monitoring_worker=worker,
    )


def create_app(container: AppContainer | None = None, **kwargs) -> Flask:
    setup_logging()

    if container is None:
        container = build_container(**kwargs)

    app = Flask(__name__)

    app.config["terminal_usecase"] = container.terminal_usecase
    app.config["terminal_probe"] = container.terminal_probe
    app.config["transaction_usecase"] = container.transaction_usecase
    app.config["monitoring_worker"] = container.monitoring_worker

    container.monitoring_worker.start()

    logger.info("[startup] probing all terminals...")
    container.terminal_usecase.probe_and_save(container.terminal_probe)
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
