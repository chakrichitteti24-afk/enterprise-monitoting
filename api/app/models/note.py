from typing import TYPE_CHECKING
from datetime import datetime, timezone
from sqlalchemy import Text, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.mentor import Mentor


class MentorNote(Base):
    __tablename__ = "mentor_notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), index=True, nullable=False
    )
    mentor_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("mentors.id", ondelete="CASCADE"), index=True, nullable=False
    )
    note: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    student: Mapped["Student"] = relationship("Student", back_populates="mentor_notes")
    mentor: Mapped["Mentor"] = relationship("Mentor", back_populates="feedback_notes")
