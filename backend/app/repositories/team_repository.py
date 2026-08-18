from typing import Optional, List, Dict
from sqlalchemy.orm import Session, joinedload, selectinload
from sqlalchemy import select
from app.models.team import Team
from app.models.mentor import Mentor
from app.models.student import Student
from app.models.user import User
from app.models.progress import StudentProgress
from app.repositories.base import BaseRepository


class TeamRepository(BaseRepository[Team]):
    def __init__(self, db: Session):
        super().__init__(Team, db)

    def get_by_id_with_details(self, team_id: int) -> Optional[Team]:
        stmt = (
            select(Team)
            .where(Team.id == team_id)
            .options(
                joinedload(Team.mentor).joinedload(Mentor.user),
                selectinload(Team.students).joinedload(Student.user),
                selectinload(Team.students).joinedload(Student.progress),
            )
        )
        return self.db.scalars(stmt).first()

    def get_by_team_number(self, team_number: str) -> Optional[Team]:
        stmt = (
            select(Team)
            .where(Team.team_number == team_number)
            .options(
                joinedload(Team.mentor).joinedload(Mentor.user),
                selectinload(Team.students).joinedload(Student.user),
                selectinload(Team.students).joinedload(Student.progress),
            )
        )
        return self.db.scalars(stmt).first()

    def get_all_with_details(self) -> List[Team]:
        stmt = (
            select(Team)
            .options(
                joinedload(Team.mentor).joinedload(Mentor.user),
                selectinload(Team.students).joinedload(Student.user),
                selectinload(Team.students).joinedload(Student.progress),
            )
            .order_by(Team.id)
        )
        return list(self.db.scalars(stmt).all())
