from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr


class MentorCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    department: str = Field(default="Computer Science & Engg", max_length=100)
    phone: Optional[str] = Field(default="+91 98480 10000", max_length=20)
    experience_years: int = Field(default=5, ge=0, le=50)
    assigned_team_id: Optional[int] = None
    password: Optional[str] = Field(default="Mentor@GKCE2026", min_length=6)


class MentorUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    department: Optional[str] = None
    phone: Optional[str] = None
    experience_years: Optional[int] = None
    assigned_team_id: Optional[int] = None


class AssignedTeamSummary(BaseModel):
    id: int
    team_number: str
    name: str

class MentorOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    assigned_team_ids: List[int] = []
    assigned_teams: List[AssignedTeamSummary] = []
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
