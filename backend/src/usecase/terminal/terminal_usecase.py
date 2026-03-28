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
        if "terminal_date" in patch:
            terminal.terminal_date = patch["terminal_date"]
        if "monitoring_date" in patch:
            terminal.monitoring_date = patch["monitoring_date"]

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
        """全端末の online ステータスをプローブして返す。repo への書き戻しは行わない。"""
        terminals = self._repo.find_all()
        results: dict[str, dict] = {}

        def _probe(t: Terminal) -> dict:
            online, _ = probe.probe(t.ip)
            return {"id": t.id, "online": online}

        with ThreadPoolExecutor(max_workers=20) as executor:
            futures = {executor.submit(_probe, t): t for t in terminals}
            for future in as_completed(futures):
                result = future.result()
                results[result["id"]] = result

        # 元の順序を保持
        return [results[t.id] for t in terminals if t.id in results]

    def probe_and_save(self, probe: TerminalProbe) -> None:
        """全端末をプローブして online + date を repo に書き戻す。起動時に使用。"""
        terminals = self._repo.find_all()
        terminal_map = {t.id: t for t in terminals}

        def _probe(t: Terminal) -> tuple[str, str, str]:
            online, probe_date = probe.probe(t.ip)
            return t.id, online, probe_date

        with ThreadPoolExecutor(max_workers=20) as executor:
            results = list(executor.map(_probe, terminals))

        for terminal_id, online, probe_date in results:
            t = terminal_map[terminal_id]
            t.online = online
            t.terminal_date = probe_date
            if t.monitoring == "on":
                t.monitoring_date = probe_date
            self._repo.save(t)
