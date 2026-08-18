from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.student import StudentOut


class TeamOut(BaseModel):
    id: int
    team_number: str
    name: str
    mentor_id: Optional[int] = None
    mentor_name: Optional[str] = None
    mentor_email: Optional[str] = None
    mentor_department: Optional[str] = None
    mentor_avatar: Optional[str] = None
    student_count: int = 5
    average_progress: float = 0.0
    total_problems_solved: int = 0
    total_attempted: int = 0
    average_streak: float = 0.0
    status: str = "ACTIVE"
    rank: int = 1
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TeamDetailOut(TeamOut):
    students: List[StudentOut] = []
    topic_performance: Dict[str, int] = {}

    model_config = ConfigDict(from_attributes=True)
