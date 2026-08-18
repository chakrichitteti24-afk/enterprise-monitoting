from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_email(self, email: str) -> Optional[User]:
        stmt = (
            select(User)
            .where(User.email == email.strip().lower())
            .options(
                joinedload(User.student_profile),
                joinedload(User.mentor_profile),
            )
        )
        return self.db.scalars(stmt).first()

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
