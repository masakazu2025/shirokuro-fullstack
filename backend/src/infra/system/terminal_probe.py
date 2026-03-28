from __future__ import annotations
import re
import subprocess
from datetime import date

from usecase.terminal.probe_port import TerminalProbe

# net time の日付パターン: YYYY/MM/DD or M/D/YYYY
_DATE_PATTERN = re.compile(r'(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})|(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})')


def _today() -> str:
    return date.today().isoformat()


class WindowsTerminalProbe(TerminalProbe):
    def probe(self, ip: str) -> tuple[str, str]:
        online = self._ping(ip)
        probe_date = self._get_date(ip) if online else _today()
        return ("online" if online else "offline"), probe_date

    def _ping(self, ip: str) -> bool:
        try:
            result = subprocess.run(
                ["ping", "-n", "1", "-w", "500", ip],
                capture_output=True,
                timeout=3,
            )
            return result.returncode == 0
        except Exception:
            return False

    def _get_date(self, ip: str) -> str:
        try:
            result = subprocess.run(
                ["net", "time", f"\\\\{ip}"],
                capture_output=True,
                timeout=5,
            )
            output = result.stdout.decode("cp932", errors="ignore")
            m = _DATE_PATTERN.search(output)
            if m:
                if m.group(1):  # YYYY/MM/DD
                    return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
                else:           # M/D/YYYY
                    return f"{m.group(6)}-{int(m.group(4)):02d}-{int(m.group(5)):02d}"
        except Exception:
            pass
        return _today()
