from typing import Optional
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base


class StudentVerifiedProblem(Base):
    __tablename__ = "student_verified_problems"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_identifier: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # student_id or roll_number
    problem_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # prob-1 ... prob-100
    day_number: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    verified_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
