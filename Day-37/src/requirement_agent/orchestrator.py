from __future__ import annotations

import json
from pathlib import Path

from requirement_agent.agents.analyzer import RequirementAnalyzerAgent
from requirement_agent.agents.formatter import EmailFormatterAgent
from requirement_agent.agents.reader import RequirementReaderAgent, ReaderInput
from requirement_agent.agents.sender import GmailSenderAgent
from requirement_agent.base import console
from requirement_agent.config import OUTPUTS_DIR, Settings
from requirement_agent.models import PipelineResult


class RequirementPipeline:
    """Orchestrates the four-agent requirement analysis workflow."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.reader = RequirementReaderAgent()
        self.analyzer = RequirementAnalyzerAgent(settings)
        self.formatter = EmailFormatterAgent()
        self.sender = GmailSenderAgent(settings)

    def run(
        self,
        input_path: Path,
        *,
        send_email: bool = True,
        output_dir: Path | None = None,
    ) -> PipelineResult:
        console.print("\n[bold magenta]Requirement Analysis Pipeline[/bold magenta]\n")

        reader_out = self.reader.run(ReaderInput(file_path=input_path))
        analyzer_out = self.analyzer.run(reader_out)
        formatter_out = self.formatter.run(analyzer_out)

        sender_out = None
        if send_email:
            sender_out = self.sender.run(formatter_out)

        run_dir = self._persist_outputs(
            output_dir or OUTPUTS_DIR,
            input_path,
            analyzer_out,
            formatter_out,
        )

        subject = f"{self.settings.email_subject_prefix} {formatter_out.subject}"

        return PipelineResult(
            input_path=str(input_path.resolve()),
            raw_requirement=reader_out.content,
            analysis=analyzer_out.analysis,
            email_subject=subject,
            email_html=formatter_out.html_body,
            email_text=formatter_out.text_body,
            output_dir=str(run_dir),
            email_sent=bool(sender_out and sender_out.sent),
        )

    def _persist_outputs(self, base_dir, input_path, analyzer_out, formatter_out) -> Path:
        stamp = Path(input_path).stem
        run_dir = base_dir / stamp
        run_dir.mkdir(parents=True, exist_ok=True)

        (run_dir / "analysis.json").write_text(
            analyzer_out.analysis.model_dump_json(indent=2),
            encoding="utf-8",
        )
        (run_dir / "email.html").write_text(formatter_out.html_body, encoding="utf-8")
        (run_dir / "email.txt").write_text(formatter_out.text_body, encoding="utf-8")
        (run_dir / "prompt_used.txt").write_text(
            analyzer_out.prompt_used,
            encoding="utf-8",
        )
        (run_dir / "model_response.json").write_text(
            analyzer_out.raw_model_response,
            encoding="utf-8",
        )

        conversation = {
            "model": self.settings.groq_model,
            "messages": [
                {"role": "system", "content": self.analyzer.system_prompt},
                {
                    "role": "user",
                    "content": (
                        "Analyze the following client requirement email/text...\n\n"
                        f"{analyzer_out.reader.content}"
                    ),
                },
                {"role": "assistant", "content": analyzer_out.raw_model_response},
            ],
        }
        (run_dir / "groq_conversation.json").write_text(
            json.dumps(conversation, indent=2),
            encoding="utf-8",
        )

        console.print(f"\n[blue]Artifacts saved to[/blue] {run_dir}")
        return run_dir
