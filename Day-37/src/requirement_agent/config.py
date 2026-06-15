from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parents[2]
PROMPTS_DIR = PROJECT_ROOT / "prompts"
OUTPUTS_DIR = PROJECT_ROOT / "outputs"
SAMPLES_DIR = PROJECT_ROOT / "samples"


@dataclass(frozen=True)
class Settings:
    groq_api_key: str
    groq_model: str
    gmail_address: str
    gmail_app_password: str
    email_to: str
    email_subject_prefix: str
    dry_run: bool = False

    @classmethod
    def from_env(cls, *, dry_run: bool = False) -> Settings:
        load_dotenv(PROJECT_ROOT / ".env")
        return cls(
            groq_api_key=os.environ.get("GROQ_API_KEY", ""),
            groq_model=os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile"),
            gmail_address=os.environ.get("GMAIL_ADDRESS", ""),
            gmail_app_password=os.environ.get("GMAIL_APP_PASSWORD", ""),
            email_to=os.environ.get("EMAIL_TO", ""),
            email_subject_prefix=os.environ.get(
                "EMAIL_SUBJECT_PREFIX", "[Requirement Analysis]"
            ),
            dry_run=dry_run,
        )

    def validate_for_run(self, *, send_email: bool) -> None:
        if not self.groq_api_key:
            raise ValueError("GROQ_API_KEY is required. Copy .env.example to .env and set it.")
        if send_email and not self.dry_run:
            missing = [
                name
                for name, value in [
                    ("GMAIL_ADDRESS", self.gmail_address),
                    ("GMAIL_APP_PASSWORD", self.gmail_app_password),
                    ("EMAIL_TO", self.email_to),
                ]
                if not value
            ]
            if missing:
                raise ValueError(
                    f"Missing email settings: {', '.join(missing)}. "
                    "Use --dry-run to skip sending."
                )
