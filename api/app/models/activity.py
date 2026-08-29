from typing import TYPE_CHECKING, Optional
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.problem import DSAProblem


class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False
    )
    problem_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("dsa_problems.id", ondelete="SET NULL"), nullable=True
    )
    activity_type: Mapped[str] = mapped_column(String(50), nullable=False)  # e.g., SOLVED, ATTEMPTED, MILESTONE
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
        nullable=False,
    )

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="activity_logs")
    problem: Mapped[Optional["DSAProblem"]] = relationship("DSAProblem", back_populates="activity_logs")
