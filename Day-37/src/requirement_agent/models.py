from __future__ import annotations

from pydantic import BaseModel, Field


class RequirementAnalysis(BaseModel):
    """Structured output from the analyzer agent."""

    functional_requirements: list[str] = Field(
        description="Specific functional capabilities the system must deliver."
    )
    non_functional_requirements: list[str] = Field(
        description="Performance, security, scalability, and quality attributes."
    )
    risks: list[str] = Field(description="Delivery, technical, and business risks.")
    assumptions: list[str] = Field(
        description="Assumptions made while interpreting the requirement."
    )
    questions_to_client: list[str] = Field(
        description="Clarifying questions to send back to the client."
    )
    executive_summary: str = Field(
        default="",
        description="Brief overview of the requirement and analysis.",
    )


class PipelineResult(BaseModel):
    input_path: str
    raw_requirement: str
    analysis: RequirementAnalysis
    email_subject: str
    email_html: str
    email_text: str
    output_dir: str
    email_sent: bool = False
