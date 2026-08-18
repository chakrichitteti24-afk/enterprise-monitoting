from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MentorOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    assigned_team_id: Optional[int] = None
    assigned_team_number: Optional[str] = None
    department: str
    phone: Optional[str] = None
    experience_years: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MentorTeamSummary(BaseModel):
    mentor: MentorOut
    team_id: int
    team_number: str
    student_count: int
    average_progress: float
    total_problems_solved: int
    average_streak: float
    status: str

    model_config = ConfigDict(from_attributes=True)
