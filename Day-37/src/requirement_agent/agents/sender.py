from __future__ import annotations

import smtplib
from dataclasses import dataclass
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from requirement_agent.agents.formatter import FormatterOutput
from requirement_agent.base import Agent
from requirement_agent.config import Settings


@dataclass(frozen=True)
class SenderOutput:
    formatter: FormatterOutput
    sent: bool
    recipient: str


class GmailSenderAgent(Agent[FormatterOutput, SenderOutput]):
    """Sends the formatted analysis email via Gmail SMTP."""

    name = "Gmail Sender Agent"

    def __init__(self, settings: Settings) -> None:
        self.settings = settings

    def execute(self, payload: FormatterOutput) -> SenderOutput:
        recipient = self.settings.email_to
        subject = f"{self.settings.email_subject_prefix} {payload.subject}"

        if self.settings.dry_run:
            self.log(
                f"[yellow]Dry run[/yellow] — would send to [bold]{recipient}[/bold]"
            )
            return SenderOutput(formatter=payload, sent=False, recipient=recipient)

        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = self.settings.gmail_address
        message["To"] = recipient

        message.attach(MIMEText(payload.text_body, "plain", "utf-8"))
        message.attach(MIMEText(payload.html_body, "html", "utf-8"))

        self.log(f"Sending email to [bold]{recipient}[/bold] via Gmail SMTP...")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=30) as server:
            server.login(self.settings.gmail_address, self.settings.gmail_app_password)
            server.sendmail(
                self.settings.gmail_address,
                [recipient],
                message.as_string(),
            )

        self.log("[green]Email sent successfully[/green]")
        return SenderOutput(formatter=payload, sent=True, recipient=recipient)
