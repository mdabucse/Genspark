from __future__ import annotations

import argparse
from pathlib import Path

from rich.panel import Panel

from requirement_agent.base import console
from requirement_agent.config import SAMPLES_DIR, Settings
from requirement_agent.orchestrator import RequirementPipeline


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Analyze client requirements with Groq and email the report."
    )
    parser.add_argument(
        "input_file",
        nargs="?",
        type=Path,
        default=SAMPLES_DIR / "sample_input.txt",
        help="Path to client requirement text file (default: samples/sample_input.txt)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Analyze and save outputs without sending email",
    )
    parser.add_argument(
        "--no-email",
        action="store_true",
        help="Skip the Gmail sender agent entirely",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=None,
        help="Directory for generated artifacts (default: outputs/)",
    )
    return parser


def cli() -> None:
    parser = build_parser()
    args = parser.parse_args()

    settings = Settings.from_env(dry_run=args.dry_run)
    settings.validate_for_run(send_email=not args.no_email)

    pipeline = RequirementPipeline(settings)
    result = pipeline.run(
        args.input_file,
        send_email=not args.no_email,
        output_dir=args.output_dir,
    )

    summary = (
        f"[bold]Input:[/bold] {result.input_path}\n"
        f"[bold]Output:[/bold] {result.output_dir}\n"
        f"[bold]Email subject:[/bold] {result.email_subject}\n"
        f"[bold]Email sent:[/bold] {'Yes' if result.email_sent else 'No'}"
    )
    console.print(Panel(summary, title="Pipeline Complete", border_style="green"))


if __name__ == "__main__":
    cli()
