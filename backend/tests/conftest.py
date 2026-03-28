import os
import pytest

from usecase.terminal.probe_port import TerminalProbe
from api.app import create_app


class FakeProbe(TerminalProbe):
    def probe(self, ip: str) -> tuple[str, str]:
        return "offline", "2026-03-28"


@pytest.fixture
def client(tmp_path):
    os.environ["MONITORING_INTERVAL_SEC"] = "99999"
    app = create_app(data_dir=tmp_path, probe=FakeProbe())
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c
