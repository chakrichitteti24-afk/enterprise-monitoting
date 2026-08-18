from typing import TYPE_CHECKING, Optional, List
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.team import Team
    from app.models.note import MentorNote


class Mentor(Base):
    __tablename__ = "mentors"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )
    assigned_team_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("teams.id", ondelete="SET NULL"), unique=True, index=True, nullable=True
    )
    department: Mapped[str] = mapped_column(String(100), default="Computer Science & Engineering")
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    experience_years: Mapped[int] = mapped_column(Integer, default=8)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="mentor_profile")
    assigned_team: Mapped[Optional["Team"]] = relationship(
        "Team", back_populates="mentor", foreign_keys=[assigned_team_id]
    )
    feedback_notes: Mapped[List["MentorNote"]] = relationship(
        "MentorNote", back_populates="mentor", cascade="all, delete-orphan"
    )
