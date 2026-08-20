from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, EmailStr, field_validator
from app.models.enums import DSALevel, StudentStatus, ProblemDifficulty, DSATopic
from app.schemas.note import MentorNoteOut


class StudentCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    roll_number: str = Field(..., min_length=4, max_length=20)
    email: EmailStr
    team_id: int
    password: Optional[str] = Field(default="Student@GKCE2026", min_length=6)
    dsa_level: DSALevel = DSALevel.BEGINNER
    status: StudentStatus = StudentStatus.ACTIVE


class StudentUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    roll_number: Optional[str] = Field(default=None, min_length=4, max_length=20)
    email: Optional[EmailStr] = None
    team_id: Optional[int] = None
    dsa_level: Optional[DSALevel] = None
    status: Optional[StudentStatus] = None


class AvatarUpdate(BaseModel):
    avatar_url: str = Field(..., min_length=5, max_length=500000, description="Image URL or base64 data string")

    @field_validator("avatar_url")
    @classmethod
    def validate_avatar_scheme(cls, v: str) -> str:
        v_clean = v.strip()
        allowed_prefixes = ("http://", "https://", "data:image/", "/")
        if not any(v_clean.startswith(prefix) for prefix in allowed_prefixes):
            raise ValueError("Avatar URL must begin with https://, http://, data:image/, or /")
        # Prevent dangerous characters or javascript injections
        if any(bad in v_clean.lower() for bad in ("<script", "javascript:", "vbscript:", "onload=")):
            raise ValueError("Invalid avatar URL format.")
        return v_clean


class TopicProgressDetail(BaseModel):
    solved: int
    total: int
    percentage: int


class DifficultyStats(BaseModel):
    easy: Dict[str, int]
    medium: Dict[str, int]
    hard: Dict[str, int]


class ActivityLogOut(BaseModel):
    id: int
    activity_type: str
    description: str
    problem_id: Optional[int] = None
    problem_title: Optional[str] = None
    problem_topic: Optional[DSATopic] = None
    problem_difficulty: Optional[ProblemDifficulty] = None
    time_ago: str = ""
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentProgressOut(BaseModel):
    problems_solved: int
    problems_attempted: int
    pending: int
    overall_percentage: float
    current_streak: int
    longest_streak: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    topic_progress: Dict[str, TopicProgressDetail] = {}
    difficulty_stats: DifficultyStats

    model_config = ConfigDict(from_attributes=True)


class StudentOut(BaseModel):
    id: int
    user_id: int
    name: str
    email: str
    avatar_url: Optional[str] = None
    roll_number: str
    team_id: int
    team_number: str
    mentor_id: Optional[int] = None
    mentor_name: Optional[str] = None
    dsa_level: DSALevel
    status: StudentStatus
    progress_percentage: float
    problems_solved: int
    problems_attempted: int
    current_streak: int
    longest_streak: int
    github_username: Optional[str] = None
    leetcode_username: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class StudentDetailOut(StudentOut):
    progress: StudentProgressOut
    recent_activities: List[ActivityLogOut] = []
    mentor_notes: List[MentorNoteOut] = []
    weekly_submissions: List[Dict[str, Any]] = []

    model_config = ConfigDict(from_attributes=True)
