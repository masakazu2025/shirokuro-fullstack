from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any


@dataclass
class Transaction:
    id: str
    date: str
    timestamp: str
    attributes: dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "date": self.date,
            "timestamp": self.timestamp,
            "attributes": self.attributes,
        }


@dataclass
class TransactionFile:
    filename: str
    display_name: str | None = None
    order: int | None = None

    def to_dict(self) -> dict:
        return {
            "filename": self.filename,
            "display_name": self.display_name,
            "order": self.order,
        }


@dataclass
class Section:
    name: str
    label: str
    type: str
    value: Any

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "label": self.label,
            "type": self.type,
            "value": self.value,
        }


@dataclass
class FileContent:
    filename: str
    display_name: str | None
    data: list[Section]

    def to_dict(self) -> dict:
        return {
            "filename": self.filename,
            "display_name": self.display_name,
            "data": [s.to_dict() for s in self.data],
        }
