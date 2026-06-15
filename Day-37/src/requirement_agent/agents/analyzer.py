from __future__ import annotations

import json
import re
from dataclasses import dataclass

from groq import Groq

from requirement_agent.agents.reader import ReaderOutput
from requirement_agent.base import Agent
from requirement_agent.config import PROMPTS_DIR, Settings
from requirement_agent.models import RequirementAnalysis


@dataclass(frozen=True)
class AnalyzerOutput:
    reader: ReaderOutput
    analysis: RequirementAnalysis
    raw_model_response: str
    prompt_used: str


class RequirementAnalyzerAgent(Agent[ReaderOutput, AnalyzerOutput]):
    """Uses Groq LLM to extract structured requirement analysis."""

    name = "Requirement Analyzer Agent"

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = Groq(api_key=settings.groq_api_key)
        self.system_prompt = (PROMPTS_DIR / "requirement_analysis.txt").read_text(
            encoding="utf-8"
        )

    def execute(self, payload: ReaderOutput) -> AnalyzerOutput:
        user_prompt = (
            "Analyze the following client requirement email/text and return ONLY "
            "valid JSON matching the schema described in the system prompt.\n\n"
            f"--- CLIENT REQUIREMENT ---\n{payload.content}\n--- END ---"
        )

        self.log(f"Calling Groq model [bold]{self.settings.groq_model}[/bold]...")

        response = self.client.chat.completions.create(
            model=self.settings.groq_model,
            messages=[
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=4096,
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content or ""
        analysis = self._parse_analysis(raw)

        self.log(
            f"Extracted {len(analysis.functional_requirements)} functional, "
            f"{len(analysis.non_functional_requirements)} non-functional items"
        )

        return AnalyzerOutput(
            reader=payload,
            analysis=analysis,
            raw_model_response=raw,
            prompt_used=f"SYSTEM:\n{self.system_prompt}\n\nUSER:\n{user_prompt}",
        )

    def _parse_analysis(self, raw: str) -> RequirementAnalysis:
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)

        data = json.loads(cleaned)
        return RequirementAnalysis.model_validate(data)
