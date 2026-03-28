from __future__ import annotations
import logging
import threading
from datetime import datetime

from usecase.terminal.port import TerminalRepository

logger = logging.getLogger(__name__)


class MonitoringWorker:
    """監視対象端末に対して定期的に処理を実行するバックグラウンドワーカー。

    現在はログ出力のみ。将来的にはファイル収集処理をここに実装する。
    """

    def __init__(self, repo: TerminalRepository, interval_sec: int = 60) -> None:
        self._repo = repo
        self._interval = interval_sec
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()

    def start(self) -> None:
        self._stop.clear()
        self._thread = threading.Thread(target=self._run, daemon=True, name="monitoring-worker")
        self._thread.start()
        logger.info("[monitoring] worker started (interval=%ds)", self._interval)

    def stop(self) -> None:
        self._stop.set()
        logger.info("[monitoring] worker stopped")

    def _run(self) -> None:
        while not self._stop.wait(self._interval):
            self._tick()

    def _tick(self) -> None:
        targets = [t for t in self._repo.find_all() if t.monitoring == "on"]
        if not targets:
            logger.debug("[monitoring] tick - no targets")
            return

        now = datetime.now().isoformat(timespec="seconds")
        for t in targets:
            logger.info("[monitoring] tick - %s (%s) at %s", t.name, t.ip, now)
            # TODO: ファイル収集処理
            #   - 端末からログ・データファイルを取得する
            #   - 取得結果を保存・集計する
            #   - エラー発生時の通知ロジック
