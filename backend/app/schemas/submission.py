from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.models.enums import SubmissionStatus


class SubmissionCreate(BaseModel):
    problem_id: int
    code_snippet: Optional[str] = Field(default=None, max_length=65536)
    language: str = Field(default="Java", max_length=50)
    # Optional status override for simulation (defaults to SOLVED if test passes)
    status: SubmissionStatus = SubmissionStatus.SOLVED
    score: float = Field(default=100.0, ge=0.0, le=100.0)
    runtime_ms: int = Field(default=45, ge=0, le=60000)
    memory_mb: float = Field(default=42.1, ge=0.0, le=1024.0)


class SubmissionOut(BaseModel):
    id: int
    student_id: int
    problem_id: int
    problem_title: Optional[str] = None
    problem_topic: Optional[str] = None
    problem_difficulty: Optional[str] = None
    status: SubmissionStatus
    score: float
    runtime_ms: int
    memory_mb: float
    code_snippet: Optional[str] = None
    language: str
    submitted_at: datetime

    model_config = ConfigDict(from_attributes=True)
