from typing import Optional, List, Dict
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.student import StudentOut


class TeamCreate(BaseModel):
    team_number: str = Field(..., min_length=1, max_length=50, description="e.g. Team 21")
    name: str = Field(..., min_length=1, max_length=100, description="e.g. Code Knights")
    mentor_id: Optional[int] = None
    mentor_name: Optional[str] = None


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    mentor_id: Optional[int] = None
    mentor_name: Optional[str] = None
    status: Optional[str] = None


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
