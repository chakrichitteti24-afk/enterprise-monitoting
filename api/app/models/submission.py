from typing import TYPE_CHECKING, Optional
from datetime import datetime, timezone
from sqlalchemy import Text, Integer, Float, ForeignKey, DateTime, String, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.models.enums import SubmissionStatus

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.problem import DSAProblem


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False
    )
    problem_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("dsa_problems.id", ondelete="CASCADE"), index=True, nullable=False
    )
    status: Mapped[SubmissionStatus] = mapped_column(
        SQLEnum(SubmissionStatus, name="submission_status_enum"),
        index=True,
        nullable=False,
    )
    score: Mapped[float] = mapped_column(Float, default=100.0)
    runtime_ms: Mapped[int] = mapped_column(Integer, default=50)
    memory_mb: Mapped[float] = mapped_column(Float, default=42.0)
    code_snippet: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[str] = mapped_column(String(50), default="Java")
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False,
    )

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="submissions")
    problem: Mapped["DSAProblem"] = relationship("DSAProblem", back_populates="submissions")
