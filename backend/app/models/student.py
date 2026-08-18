from typing import TYPE_CHECKING, Optional, List
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from app.models.enums import DSALevel, StudentStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.team import Team
    from app.models.progress import StudentProgress
    from app.models.submission import Submission
    from app.models.activity import ActivityLog
    from app.models.note import MentorNote


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    roll_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    team_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("teams.id", ondelete="RESTRICT"), index=True, nullable=False
    )
    dsa_level: Mapped[DSALevel] = mapped_column(
        SQLEnum(DSALevel, name="dsa_level_enum"),
        default=DSALevel.INTERMEDIATE,
        nullable=False,
    )
    status: Mapped[StudentStatus] = mapped_column(
        SQLEnum(StudentStatus, name="student_status_enum"),
        default=StudentStatus.ACTIVE,
        index=True,
        nullable=False,
    )
    github_username: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    leetcode_username: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="student_profile")
    team: Mapped["Team"] = relationship("Team", back_populates="students", foreign_keys=[team_id])
    progress: Mapped[Optional["StudentProgress"]] = relationship(
        "StudentProgress", back_populates="student", uselist=False, cascade="all, delete-orphan"
    )
    submissions: Mapped[List["Submission"]] = relationship(
        "Submission", back_populates="student", cascade="all, delete-orphan"
    )
    activity_logs: Mapped[List["ActivityLog"]] = relationship(
        "ActivityLog", back_populates="student", cascade="all, delete-orphan"
    )
    mentor_notes: Mapped[List["MentorNote"]] = relationship(
        "MentorNote", back_populates="student", cascade="all, delete-orphan"
    )
