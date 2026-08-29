from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        clean_input = email.strip().lower()
        stmt = (
            select(User)
            .where(User.email == clean_input)
            .options(
                joinedload(User.student_profile),
                joinedload(User.mentor_profile),
            )
        )
        user = self.db.scalars(stmt).first()
        if user:
            return user

        # Friendly Dean / Root aliases
        if clean_input in ('dean@gkce.edu.in', 'dean.academics@gkce.edu.in', 'admin@gkce.edu.in', 'dean', 'root', 'admin', 'root@gkce.edu.in'):
            stmt_dean = (
                select(User)
                .where(User.role == 'DEAN')
                .options(
                    joinedload(User.student_profile),
                    joinedload(User.mentor_profile),
                )
            )
            dean_user = self.db.scalars(stmt_dean).first()
            if dean_user:
                return dean_user

        # Flexible fallback by student roll number or partial username / mentor name
        from app.models.student import Student
        from app.models.mentor import Mentor
        raw_prefix = clean_input.split('@')[0]

        # Check Mentor name or email prefix
        stmt_mentor = (
            select(User)
            .join(Mentor, Mentor.user_id == User.id)
            .where(
                (Mentor.email.ilike(f"%{raw_prefix}%")) |
                (Mentor.name.ilike(f"%{raw_prefix}%")) |
                (User.email.ilike(f"%{raw_prefix}%"))
            )
            .options(
                joinedload(User.student_profile),
                joinedload(User.mentor_profile),
            )
        )
        mentor_user = self.db.scalars(stmt_mentor).first()
        if mentor_user:
            return mentor_user

        stmt_student = (
            select(User)
            .join(Student, Student.user_id == User.id)
            .where(
                (Student.roll_number.ilike(clean_input)) |
                (Student.roll_number.ilike(f"%{raw_prefix}%")) |
                (Student.name.ilike(f"%{raw_prefix}%")) |
                (User.email.ilike(f"%{raw_prefix}%"))
            )
            .options(
                joinedload(User.student_profile),
                joinedload(User.mentor_profile),
            )
        )
        return self.db.scalars(stmt_student).first()

    def get_with_profiles(self, user_id: int) -> Optional[User]:
        stmt = (
            select(User)
            .where(User.id == user_id)
            .options(
                joinedload(User.student_profile),
                joinedload(User.mentor_profile),
            )
        )
        return self.db.scalars(stmt).first()
