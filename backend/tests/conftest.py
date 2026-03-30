import os
import pytest

from domain.transaction.transaction import FileConfig
from usecase.terminal.probe_port import TerminalProbe
from infra.processor.registry import _REGISTRY
from infra.processor._fake_multi import fake_text_multi, fake_csv_multi, fake_json_multi
from api.app import build_container, create_app


class FakeProbe(TerminalProbe):
    def probe(self, ip: str) -> tuple[str, str]:
        return "offline", "2026-03-28"


_REGISTRY["fake.multi.text"] = fake_text_multi
_REGISTRY["fake.multi.csv"] = fake_csv_multi
_REGISTRY["fake.multi.json"] = fake_json_multi


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


_MULTI_FILE_CONFIGS = [
    FileConfig(filename_pattern=r"file_b\.dat", processor="fake.multi.text"),
    FileConfig(filename_pattern=r"file_d\.dat", processor="fake.multi.csv"),
    FileConfig(filename_pattern=r"file_f\.dat", processor="fake.multi.json"),
]


@pytest.fixture
def client(tmp_path):
    os.environ["MONITORING_INTERVAL_SEC"] = "99999"
    transactions_root = tmp_path / "transactions"
    _build_transactions(transactions_root)
    container = build_container(
        data_dir=tmp_path,
        probe=FakeProbe(),
        transactions_root=transactions_root,
        file_configs=_MULTI_FILE_CONFIGS,
    )
    app = create_app(container=container)
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c
