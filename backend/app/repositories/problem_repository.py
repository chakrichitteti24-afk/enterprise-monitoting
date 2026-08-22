from typing import Optional, List, Tuple
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select, func, or_
from app.models.problem import DSAProblem
from app.models.enums import ProblemDifficulty, DSATopic
from app.repositories.base import BaseRepository


class ProblemRepository(BaseRepository[DSAProblem]):
    def __init__(self, db: Session):
        super().__init__(DSAProblem, db)

    def get_filtered(
        self,
        search: Optional[str] = None,
        topic: Optional[DSATopic] = None,
        difficulty: Optional[ProblemDifficulty] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Tuple[List[DSAProblem], int]:
        stmt = select(DSAProblem)

        if search:
            term = f"%{search.strip()}%"
            stmt = stmt.where(
                or_(
                    DSAProblem.title.ilike(term),
                    DSAProblem.description.ilike(term),
                )
            )

        if topic:
            stmt = stmt.where(DSAProblem.topic == topic)

        if difficulty:
            stmt = stmt.where(DSAProblem.difficulty == difficulty)

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = self.db.scalar(count_stmt) or 0

        items_stmt = (
            stmt.options(selectinload(DSAProblem.submissions))
            .order_by(DSAProblem.id)
            .offset(skip)
            .limit(limit)
        )
        items = list(self.db.scalars(items_stmt).all())

        return items, total

    def count_by_topic(self) -> dict[DSATopic, int]:
        stmt = (
            select(DSAProblem.topic, func.count(DSAProblem.id))
            .group_by(DSAProblem.topic)
        )
        return dict(self.db.execute(stmt).all())
