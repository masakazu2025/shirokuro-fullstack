from __future__ import annotations
import json
from pathlib import Path

from domain.terminal.terminal import Terminal
from usecase.terminal.port import TerminalRepository


class TerminalJsonRepository(TerminalRepository):
    def __init__(self, data_path: Path) -> None:
        self._path = data_path
        self._path.parent.mkdir(parents=True, exist_ok=True)

    def _load(self) -> list[dict]:
        if not self._path.exists():
            return []
        with self._path.open(encoding="utf-8") as f:
            return json.load(f)

    def _save(self, records: list[dict]) -> None:
        with self._path.open("w", encoding="utf-8") as f:
            json.dump(records, f, ensure_ascii=False, indent=2)

    def _to_terminal(self, d: dict) -> Terminal:
        return Terminal(
            id=d["id"],
            name=d["name"],
            ip=d["ip"],
            monitoring=d.get("monitoring", "off"),
            online=d.get("online", "offline"),
            terminal_date=d.get("terminal_date"),
            monitoring_date=d.get("monitoring_date"),
        )

    def find_all(self) -> list[Terminal]:
        return [self._to_terminal(d) for d in self._load()]

    def find_by_id(self, terminal_id: str) -> Terminal | None:
        for d in self._load():
            if d["id"] == terminal_id:
                return self._to_terminal(d)
        return None

    def find_by_ip(self, ip: str) -> Terminal | None:
        for d in self._load():
            if d["ip"] == ip:
                return self._to_terminal(d)
        return None

    def save(self, terminal: Terminal) -> None:
        records = self._load()
        for i, d in enumerate(records):
            if d["id"] == terminal.id:
                records[i] = terminal.to_dict()
                self._save(records)
                return
        records.append(terminal.to_dict())
        self._save(records)

    def delete(self, terminal_id: str) -> None:
        records = [d for d in self._load() if d["id"] != terminal_id]
        self._save(records)

    def delete_many(self, terminal_ids: list[str]) -> None:
        id_set = set(terminal_ids)
        records = [d for d in self._load() if d["id"] not in id_set]
        self._save(records)
