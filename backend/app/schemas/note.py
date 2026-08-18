from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime


class MentorNoteCreate(BaseModel):
    note: str = Field(..., min_length=1, max_length=2000, description="Feedback text up to 2000 characters")


class MentorNoteOut(BaseModel):
    id: int
    student_id: int
    mentor_id: int
    mentor_name: str
    note: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
