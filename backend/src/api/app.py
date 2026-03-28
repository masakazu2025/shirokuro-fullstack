from __future__ import annotations
import logging
import os
from pathlib import Path
from flask import Flask, jsonify, request

from infra.repository.terminal_json_repository import TerminalJsonRepository
from infra.system.terminal_probe import WindowsTerminalProbe
from infra.worker.monitoring_worker import MonitoringWorker
from usecase.terminal.terminal_usecase import TerminalUsecase

logger = logging.getLogger(__name__)


def create_app(data_dir: Path | None = None) -> Flask:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )
    app = Flask(__name__)

    if data_dir is None:
        data_dir = Path(__file__).parent.parent.parent / "data"

    repo = TerminalJsonRepository(data_dir / "terminals.json")
    usecase = TerminalUsecase(repo)
    probe = WindowsTerminalProbe()
    app.config["terminal_usecase"] = usecase
    app.config["terminal_probe"] = probe

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
