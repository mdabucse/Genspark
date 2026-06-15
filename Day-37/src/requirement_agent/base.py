from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Generic, TypeVar

from rich.console import Console

TIn = TypeVar("TIn")
TOut = TypeVar("TOut")

console = Console()


class Agent(ABC, Generic[TIn, TOut]):
    """Base class for pipeline agents."""

    name: str = "Agent"

    def run(self, payload: TIn) -> TOut:
        console.rule(f"[bold cyan]{self.name}[/bold cyan]")
        result = self.execute(payload)
        console.print(f"[green]✓[/green] {self.name} completed")
        return result

    @abstractmethod
    def execute(self, payload: TIn) -> TOut:
        raise NotImplementedError

    def log(self, message: str, **kwargs: Any) -> None:
        console.print(message, **kwargs)
