from __future__ import annotations
from abc import ABC, abstractmethod


class TerminalProbe(ABC):
    @abstractmethod
    def probe(self, ip: str) -> tuple[str, str]:
        """Returns (online_status, date_str).
        online_status: "online" | "offline"
        date_str: "YYYY-MM-DD" (never None)
        """
        ...
