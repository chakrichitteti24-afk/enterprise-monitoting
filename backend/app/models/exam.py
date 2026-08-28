from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import String, Integer, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class WeeklyExam(Base):
    __tablename__ = "weekly_exams"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    week_number: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    tier: Mapped[Optional[str]] = mapped_column(String(20), default="EASY", nullable=True)
    tier_badge: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    topic_focus: Mapped[str] = mapped_column(String(255), default="DSA Core Curriculum", nullable=False)
    scheduled_date: Mapped[str] = mapped_column(String(20), nullable=False)
    start_time: Mapped[str] = mapped_column(String(20), default="10:00 AM", nullable=False)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=60, nullable=False)
    total_marks: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    pass_marks: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="SCHEDULED", index=True, nullable=False)
    created_by: Mapped[str] = mapped_column(String(100), default="Root (Dean of Academic Affairs / Sudo Admin)", nullable=False)
    questions: Mapped[List[Dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    submissions: Mapped[List["StudentExamSubmission"]] = relationship(
        "StudentExamSubmission", back_populates="exam", cascade="all, delete-orphan"
    )


class StudentExamSubmission(Base):
    __tablename__ = "student_exam_submissions"

    id: Mapped[str] = mapped_column(String(100), primary_key=True, index=True)
    exam_id: Mapped[str] = mapped_column(
        String(50), ForeignKey("weekly_exams.id", ondelete="CASCADE"), index=True, nullable=False
    )
    student_id: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    student_name: Mapped[str] = mapped_column(String(100), nullable=False)
    student_roll_no: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    team_number: Mapped[str] = mapped_column(String(50), default="Team 01", nullable=False)
    randomized_set_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(30), default="EVALUATED", nullable=False)
    score: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_marks: Mapped[int] = mapped_column(Integer, default=100, nullable=False)
    questions_solved: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    passed_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_question_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    time_spent_minutes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    answers: Mapped[Dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    exam: Mapped["WeeklyExam"] = relationship("WeeklyExam", back_populates="submissions")
