from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.enums import ProblemDifficulty, DSATopic, SubmissionStatus


class DSAProblemBase(BaseModel):
    title: str
    description: str
    difficulty: ProblemDifficulty
    topic: DSATopic
    platform_url: Optional[str] = None
    acceptance_rate: str = "50.0%"
    total_test_cases: int = 10


class DSAProblemCreate(DSAProblemBase):
    pass


class DSAProblemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[ProblemDifficulty] = None
    topic: Optional[DSATopic] = None
    platform_url: Optional[str] = None
    acceptance_rate: Optional[str] = None
    total_test_cases: Optional[int] = None


class DSAProblemOut(DSAProblemBase):
    id: int
    created_at: datetime
    solved_count: int = 0
    my_status: Optional[SubmissionStatus] = None

    model_config = ConfigDict(from_attributes=True)
