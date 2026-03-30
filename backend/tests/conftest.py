import os
import pytest

from usecase.terminal.probe_port import TerminalProbe
from api.app import create_app


class FakeProbe(TerminalProbe):
    def probe(self, ip: str) -> tuple[str, str]:
        return "offline", "2026-03-28"


def _build_transactions(root):
    files = {
        ("t1", "2026-03-21", "tx001"): {
            "file_a.dat": "Line 1: Sample text content\nLine 2: Another line",
            "file_c.csv": "col1,col2\nval1,val2",
            "file_d.dat": "col1,col2\na1,a2\na3,a4",
            "file_e.json": '{"key1": "value1", "key2": 42}',
            "file_f.dat": '{"type": "section1"}',
        },
        ("t1", "2026-03-21", "tx002"): {
            "file_b.dat": "Section line A\nSection line B",
        },
        ("t1", "2026-03-21", "tx003"): {},
        ("t1", "2026-03-22", "tx010"): {
            "file_a.dat": "day2 content",
        },
    }
    for (terminal_id, date, tx_id), contents in files.items():
        tx_dir = root / terminal_id / date / tx_id
        tx_dir.mkdir(parents=True)
        for filename, content in contents.items():
            (tx_dir / filename).write_text(content, encoding="utf-8")


@pytest.fixture
def client(tmp_path):
    os.environ["MONITORING_INTERVAL_SEC"] = "99999"
    transactions_root = tmp_path / "transactions"
    _build_transactions(transactions_root)
    app = create_app(
        data_dir=tmp_path,
        probe=FakeProbe(),
        transactions_root=transactions_root,
    )
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c
