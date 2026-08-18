from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.models.enums import ProblemDifficulty, DSATopic

if TYPE_CHECKING:
    from app.models.submission import Submission
    from app.models.activity import ActivityLog


class DSAProblem(Base):
    __tablename__ = "dsa_problems"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[ProblemDifficulty] = mapped_column(
        SQLEnum(ProblemDifficulty, name="problem_difficulty_enum"),
        index=True,
        nullable=False,
    )
    topic: Mapped[DSATopic] = mapped_column(
        SQLEnum(DSATopic, name="dsa_topic_enum"),
        index=True,
        nullable=False,
    )
    platform_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    acceptance_rate: Mapped[str] = mapped_column(String(20), default="50.0%")
    total_test_cases: Mapped[int] = mapped_column(Integer, default=10)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    submissions: Mapped[List["Submission"]] = relationship(
        "Submission", back_populates="problem", cascade="all, delete-orphan"
    )
    activity_logs: Mapped[List["ActivityLog"]] = relationship(
        "ActivityLog", back_populates="problem"
    )
