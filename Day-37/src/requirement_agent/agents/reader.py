from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from requirement_agent.base import Agent


@dataclass(frozen=True)
class ReaderInput:
    file_path: Path


@dataclass(frozen=True)
class ReaderOutput:
    file_path: Path
    content: str
    line_count: int
    word_count: int


class RequirementReaderAgent(Agent[ReaderInput, ReaderOutput]):
    """Reads raw client requirement text from a file."""

    name = "Requirement Reader Agent"

    def execute(self, payload: ReaderInput) -> ReaderOutput:
        path = payload.file_path.expanduser().resolve()
        if not path.exists():
            raise FileNotFoundError(f"Requirement file not found: {path}")
        if not path.is_file():
            raise ValueError(f"Path is not a file: {path}")

        content = path.read_text(encoding="utf-8").strip()
        if not content:
            raise ValueError(f"Requirement file is empty: {path}")

        words = content.split()
        self.log(
            f"Loaded [bold]{path.name}[/bold] — "
            f"{len(content.splitlines())} lines, {len(words)} words"
        )

        return ReaderOutput(
            file_path=path,
            content=content,
            line_count=len(content.splitlines()),
            word_count=len(words),
        )
