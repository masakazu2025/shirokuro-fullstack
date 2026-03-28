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
    date: str | None = None

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "ip": self.ip,
            "monitoring": self.monitoring,
            "online": self.online,
            "date": self.date,
        }
