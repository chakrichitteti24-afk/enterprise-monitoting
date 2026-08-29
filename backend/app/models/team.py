from typing import TYPE_CHECKING, List, Optional
from datetime import datetime, timezone
from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.mentor import Mentor
    from app.models.student import Student


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    team_number: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    mentor_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("mentors.id", ondelete="SET NULL"), index=True, nullable=True)

    # Relationships
    # A team has 1 mentor and exactly 5 students
    mentor: Mapped[Optional["Mentor"]] = relationship(
        "Mentor",
        back_populates="assigned_teams",
        uselist=False,
        foreign_keys=[mentor_id],
    )
    students: Mapped[List["Student"]] = relationship(
        "Student", back_populates="team", cascade="all, delete-orphan", foreign_keys="Student.team_id"
    )
