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

        # Flexible fallback by student roll number or partial username
        from app.models.student import Student
        raw_prefix = clean_input.split('@')[0]
        stmt_student = (
            select(User)
            .join(Student, Student.user_id == User.id)
            .where(
                (Student.roll_number.ilike(clean_input)) |
                (Student.roll_number.ilike(f"%{raw_prefix}%")) |
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
