from __future__ import annotations

import logging
from datetime import date
from pathlib import Path

_DEFAULT_LOG_DIR = Path(__file__).parent.parent.parent / "logs"


def setup_logging(log_dir: Path | None = None) -> None:
    """ルートロガーにコンソールとファイルのハンドラを設定する。

    - コンソール・ファイルともに INFO 以上を出力する
    - ファイル名: application_yyyymmdd.log
    - ERROR 以上のログはトレースバックを出力するため、呼び出し元で
      logger.exception() または logger.error(..., exc_info=True) を使うこと
    """
    if log_dir is None:
        log_dir = _DEFAULT_LOG_DIR
    log_dir.mkdir(parents=True, exist_ok=True)

    log_file = log_dir / f"application_{date.today():%Y%m%d}.log"
    fmt = "%(asctime)s %(levelname)-8s %(name)s - %(message)s"
    formatter = logging.Formatter(fmt)

    root = logging.getLogger()
    if root.handlers:
        # 多重登録を防ぐ（テスト等で create_app を複数回呼ぶ場合）
        return
    root.setLevel(logging.INFO)

    console = logging.StreamHandler()
    console.setFormatter(formatter)
    root.addHandler(console)

    file_handler = logging.FileHandler(log_file, encoding="utf-8")
    file_handler.setFormatter(formatter)
    root.addHandler(file_handler)
