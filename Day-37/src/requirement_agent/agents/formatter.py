from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from jinja2 import Template

from requirement_agent.agents.analyzer import AnalyzerOutput
from requirement_agent.base import Agent


EMAIL_HTML_TEMPLATE = Template(
    """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{ subject }}</title>
  <style>
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; line-height: 1.6; max-width: 760px; margin: 0 auto; padding: 24px; }
    h1 { color: #111827; border-bottom: 3px solid #2563eb; padding-bottom: 8px; }
    h2 { color: #1d4ed8; margin-top: 28px; }
    .meta { background: #f3f4f6; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; }
    ul { padding-left: 20px; }
    li { margin-bottom: 8px; }
    .summary { background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0; }
    footer { margin-top: 32px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 12px; }
  </style>
</head>
<body>
  <h1>Requirement Analysis Report</h1>
  <div class="meta">
    <strong>Source file:</strong> {{ source_file }}<br>
    <strong>Generated:</strong> {{ generated_at }} UTC<br>
    <strong>Prepared by:</strong> Requirement Analysis Agent (Groq)
  </div>

  {% if executive_summary %}
  <div class="summary">
    <strong>Executive Summary</strong><br>
    {{ executive_summary }}
  </div>
  {% endif %}

  <h2>Functional Requirements</h2>
  <ul>
  {% for item in functional_requirements %}
    <li>{{ item }}</li>
  {% endfor %}
  </ul>

  <h2>Non-Functional Requirements</h2>
  <ul>
  {% for item in non_functional_requirements %}
    <li>{{ item }}</li>
  {% endfor %}
  </ul>

  <h2>Risks</h2>
  <ul>
  {% for item in risks %}
    <li>{{ item }}</li>
  {% endfor %}
  </ul>

  <h2>Assumptions</h2>
  <ul>
  {% for item in assumptions %}
    <li>{{ item }}</li>
  {% endfor %}
  </ul>

  <h2>Questions to Client</h2>
  <ul>
  {% for item in questions_to_client %}
    <li>{{ item }}</li>
  {% endfor %}
  </ul>

  <footer>
    This report was automatically generated from the submitted client requirement text.
    Please review and confirm assumptions and open questions before development begins.
  </footer>
</body>
</html>
"""
)


@dataclass(frozen=True)
class FormatterOutput:
    analyzer: AnalyzerOutput
    subject: str
    html_body: str
    text_body: str


class EmailFormatterAgent(Agent[AnalyzerOutput, FormatterOutput]):
    """Builds a client-ready HTML and plain-text email from analysis."""

    name = "Email Formatter Agent"

    def execute(self, payload: AnalyzerOutput) -> FormatterOutput:
        analysis = payload.analysis
        generated_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M")
        source_file = payload.reader.file_path.name
        subject = f"Requirement Analysis — {source_file}"

        html_body = EMAIL_HTML_TEMPLATE.render(
            subject=subject,
            source_file=source_file,
            generated_at=generated_at,
            executive_summary=analysis.executive_summary,
            functional_requirements=analysis.functional_requirements,
            non_functional_requirements=analysis.non_functional_requirements,
            risks=analysis.risks,
            assumptions=analysis.assumptions,
            questions_to_client=analysis.questions_to_client,
        )

        text_body = self._build_text(analysis, source_file, generated_at)
        self.log(f"Prepared email subject: [bold]{subject}[/bold]")

        return FormatterOutput(
            analyzer=payload,
            subject=subject,
            html_body=html_body,
            text_body=text_body,
        )

    def _build_text(self, analysis, source_file: str, generated_at: str) -> str:
        sections = [
            ("EXECUTIVE SUMMARY", [analysis.executive_summary] if analysis.executive_summary else []),
            ("FUNCTIONAL REQUIREMENTS", analysis.functional_requirements),
            ("NON-FUNCTIONAL REQUIREMENTS", analysis.non_functional_requirements),
            ("RISKS", analysis.risks),
            ("ASSUMPTIONS", analysis.assumptions),
            ("QUESTIONS TO CLIENT", analysis.questions_to_client),
        ]

        lines = [
            "REQUIREMENT ANALYSIS REPORT",
            f"Source file: {source_file}",
            f"Generated: {generated_at} UTC",
            "",
        ]

        for title, items in sections:
            if not items:
                continue
            lines.append(title)
            lines.append("-" * len(title))
            for index, item in enumerate(items, start=1):
                lines.append(f"{index}. {item}")
            lines.append("")

        return "\n".join(lines).strip()
