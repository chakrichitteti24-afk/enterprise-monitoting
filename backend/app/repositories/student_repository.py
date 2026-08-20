from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select, func, desc, or_
from app.models.student import Student
from app.models.user import User
from app.models.team import Team
from app.models.mentor import Mentor
from app.models.progress import StudentProgress
from app.models.activity import ActivityLog
from app.models.note import MentorNote
from app.models.submission import Submission
from app.models.problem import DSAProblem
from app.models.enums import StudentStatus, DSALevel
from app.repositories.base import BaseRepository


class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session):
        super().__init__(Student, db)

    def get_by_roll_number(self, roll_number: str) -> Optional[Student]:
        stmt = (
            select(Student)
            .where(Student.roll_number == roll_number)
            .options(
                joinedload(Student.user),
                joinedload(Student.team),
                joinedload(Student.progress),
            )
        )
        return self.db.scalars(stmt).first()

    def get_by_id_with_relations(self, student_id: int) -> Optional[Student]:
        stmt = (
            select(Student)
            .where(Student.id == student_id)
            .options(
                joinedload(Student.user),
                joinedload(Student.team).joinedload(Team.mentor).joinedload(Mentor.user),
                joinedload(Student.progress),
                selectinload(Student.mentor_notes).joinedload(MentorNote.mentor).joinedload(Mentor.user),
            )
        )
        return self.db.scalars(stmt).first()

    def get_by_user_id(self, user_id: int) -> Optional[Student]:
        stmt = (
            select(Student)
            .where(Student.user_id == user_id)
            .options(
                joinedload(Student.user),
                joinedload(Student.team),
                joinedload(Student.progress),
            )
        )
        return self.db.scalars(stmt).first()

    def get_by_team_id(self, team_id: int) -> List[Student]:
        stmt = (
            select(Student)
            .where(Student.team_id == team_id)
            .options(
                joinedload(Student.user),
                joinedload(Student.team),
                joinedload(Student.progress),
            )
            .order_by(Student.id)
        )
        return list(self.db.scalars(stmt).all())

    def get_paginated_filtered(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        team_id: Optional[int] = None,
        team_number: Optional[str] = None,
        status: Optional[StudentStatus] = None,
        level: Optional[DSALevel] = None,
    ) -> Tuple[List[Student], int]:
        stmt = (
            select(Student)
            .join(User, Student.user_id == User.id)
            .join(Team, Student.team_id == Team.id)
            .options(
                joinedload(Student.user),
                joinedload(Student.team),
                joinedload(Student.progress),
            )
        )

        if search:
            search_term = f"%{search.strip()}%"
            stmt = stmt.where(
                or_(
                    User.name.ilike(search_term),
                    Student.roll_number.ilike(search_term),
                    User.email.ilike(search_term),
                )
            )

        if team_id is not None:
            stmt = stmt.where(Student.team_id == team_id)

        if team_number is not None and team_number != "All":
            stmt = stmt.where(Team.team_number == team_number)

        if status is not None:
            stmt = stmt.where(Student.status == status)

        if level is not None:
            stmt = stmt.where(Student.dsa_level == level)

        # Count total matching rows
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = self.db.scalar(count_stmt) or 0

        # Apply pagination
        offset = (page - 1) * limit
        items_stmt = stmt.order_by(Student.id).offset(offset).limit(limit)
        items = list(self.db.scalars(items_stmt).all())

        return items, total

    def get_activity_logs(self, student_id: int, limit: int = 10) -> List[ActivityLog]:
        stmt = (
            select(ActivityLog)
            .where(ActivityLog.student_id == student_id)
            .options(joinedload(ActivityLog.problem))
            .order_by(desc(ActivityLog.created_at))
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def get_mentor_notes(self, student_id: int) -> List[MentorNote]:
        stmt = (
            select(MentorNote)
            .where(MentorNote.student_id == student_id)
            .options(joinedload(MentorNote.mentor).joinedload(Mentor.user))
            .order_by(desc(MentorNote.created_at))
        )
        return list(self.db.scalars(stmt).all())
