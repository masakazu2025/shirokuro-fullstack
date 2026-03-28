from __future__ import annotations
from abc import ABC, abstractmethod
from domain.terminal.terminal import Terminal


class TerminalRepository(ABC):
    @abstractmethod
    def find_all(self) -> list[Terminal]: ...

    @abstractmethod
    def find_by_id(self, terminal_id: str) -> Terminal | None: ...

    @abstractmethod
    def find_by_ip(self, ip: str) -> Terminal | None: ...

    @abstractmethod
    def save(self, terminal: Terminal) -> None: ...

    @abstractmethod
    def delete(self, terminal_id: str) -> None: ...

    @abstractmethod
    def delete_many(self, terminal_ids: list[str]) -> None: ...
