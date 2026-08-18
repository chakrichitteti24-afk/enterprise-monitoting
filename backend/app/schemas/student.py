from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.enums import DSALevel, StudentStatus, ProblemDifficulty, DSATopic
from app.schemas.note import MentorNoteOut


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
