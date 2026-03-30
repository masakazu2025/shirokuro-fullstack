from __future__ import annotations

import logging
import os
from datetime import date
from pathlib import Path

_DEFAULT_LOG_DIR = Path(__file__).parent.parent.parent / "logs"


def setup_logging(log_dir: Path | None = None) -> None:
    """ルートロガーにコンソールとファイルのハンドラを設定する。

    環境変数:
      LOG_DIR       ログ出力ディレクトリ（デフォルト: backend/logs/）
      LOG_LEVEL     ログレベル（DEBUG/INFO/WARNING/ERROR、デフォルト: INFO）
      LOG_FILENAME  ファイル名のベース部分（デフォルト: application）
                    → {LOG_FILENAME}_yyyymmdd.log

    - ERROR 以上のログはトレースバックを出力するため、呼び出し元で
      logger.exception() または logger.error(..., exc_info=True) を使うこと
    """
    if log_dir is None:
        env_dir = os.environ.get("LOG_DIR")
        log_dir = Path(env_dir) if env_dir else _DEFAULT_LOG_DIR
    log_dir.mkdir(parents=True, exist_ok=True)

    level_name = os.environ.get("LOG_LEVEL", "INFO").upper()
    level = getattr(logging, level_name, logging.INFO)

    filename_base = os.environ.get("LOG_FILENAME", "application")
    log_file = log_dir / f"{filename_base}_{date.today():%Y%m%d}.log"

    fmt = "%(asctime)s %(levelname)-8s %(name)s - %(message)s"
    formatter = logging.Formatter(fmt)

    root = logging.getLogger()
    if root.handlers:
        # 多重登録を防ぐ（テスト等で create_app を複数回呼ぶ場合）
        return
    root.setLevel(level)

    console = logging.StreamHandler()
    console.setFormatter(formatter)
    root.addHandler(console)

    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setFormatter(formatter)
    root.addHandler(file_handler)
