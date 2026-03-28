from __future__ import annotations
import uuid
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

from domain.terminal.terminal import Terminal, MonitoringStatus
from usecase.terminal.port import TerminalRepository
from usecase.terminal.probe_port import TerminalProbe

_IP_PATTERN = re.compile(
    r"^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$"
)


def _validate_ip(ip: str) -> bool:
    return bool(_IP_PATTERN.match(ip))


class TerminalUsecase:
    def __init__(self, repo: TerminalRepository) -> None:
        self._repo = repo

    def list_terminals(self) -> list[Terminal]:
        return self._repo.find_all()

    def add_terminals(self, items: list[dict]) -> tuple[list[Terminal], list[dict]]:
        """
        Returns (created, errors).
        errors: list of {"ip": ..., "code": 400|409, "message": ...}
        """
        created: list[Terminal] = []
        errors: list[dict] = []

        for item in items:
            ip = item.get("ip", "")
            name = item.get("name") or ip

            if not _validate_ip(ip):
                errors.append({"ip": ip, "code": 400, "message": "IPアドレスが不正です"})
                continue

            if self._repo.find_by_ip(ip) is not None:
                errors.append({"ip": ip, "code": 409, "message": "IPアドレスが重複しています"})
                continue

            terminal = Terminal(id=str(uuid.uuid4()), name=name, ip=ip)
            self._repo.save(terminal)
            created.append(terminal)

        return created, errors

    def update_terminal(self, terminal_id: str, patch: dict) -> Terminal | None:
        terminal = self._repo.find_by_id(terminal_id)
        if terminal is None:
            return None

        if "name" in patch:
            terminal.name = patch["name"]
        if "monitoring" in patch:
            terminal.monitoring = patch["monitoring"]
        if "date" in patch:
            terminal.date = patch["date"]

        self._repo.save(terminal)
        return terminal

    def delete_terminal(self, terminal_id: str) -> bool:
        if self._repo.find_by_id(terminal_id) is None:
            return False
        self._repo.delete(terminal_id)
        return True

    def delete_terminals(self, terminal_ids: list[str]) -> list[str]:
        existing = {t.id for t in self._repo.find_all()}
        ids_to_delete = [i for i in terminal_ids if i in existing]
        if ids_to_delete:
            self._repo.delete_many(ids_to_delete)
        return ids_to_delete

    def get_status(self, probe: TerminalProbe) -> list[dict]:
        terminals = self._repo.find_all()
        results: dict[str, dict] = {}

        def _probe(t: Terminal) -> dict:
            online, probe_date = probe.probe(t.ip)
            return {"id": t.id, "online": online, "date": probe_date}

        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = {executor.submit(_probe, t): t for t in terminals}
            for future in as_completed(futures):
                result = future.result()
                results[result["id"]] = result

        # 元の順序を保持
        return [results[t.id] for t in terminals if t.id in results]
