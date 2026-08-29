from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select
from app.models.mentor import Mentor
from app.models.user import User
from app.models.team import Team
from app.repositories.base import BaseRepository


class MentorRepository(BaseRepository[Mentor]):
    def __init__(self, db: Session):
        super().__init__(Mentor, db)

    def get_by_id_with_relations(self, mentor_id: int) -> Optional[Mentor]:
        stmt = (
            select(Mentor)
            .where(Mentor.id == mentor_id)
            .options(
                joinedload(Mentor.user),
                joinedload(Mentor.assigned_team),
            )
        )
        return self.db.scalars(stmt).first()

    def get_by_user_id(self, user_id: int) -> Optional[Mentor]:
        stmt = (
            select(Mentor)
            .where(Mentor.user_id == user_id)
            .options(
                joinedload(Mentor.user),
                joinedload(Mentor.assigned_team),
            )
        )
        return self.db.scalars(stmt).first()

    def get_all_with_relations(self) -> List[Mentor]:
        stmt = (
            select(Mentor)
            .options(
                joinedload(Mentor.user),
                joinedload(Mentor.assigned_team),
            )
            .order_by(Mentor.id)
        )
        return list(self.db.scalars(stmt).all())
