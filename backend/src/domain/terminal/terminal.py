from __future__ import annotations
from dataclasses import dataclass
from typing import Literal

MonitoringStatus = Literal["on", "off"]
OnlineStatus = Literal["online", "offline"]


@dataclass
class Terminal:
    id: str
    name: str
    ip: str
    monitoring: MonitoringStatus = "off"
    online: OnlineStatus = "offline"
    terminal_date: str | None = None
    monitoring_date: str | None = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "ip": self.ip,
            "monitoring": self.monitoring,
            "online": self.online,
            "terminal_date": self.terminal_date,
            "monitoring_date": self.monitoring_date,
        }
