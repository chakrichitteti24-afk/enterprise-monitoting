from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import UserRole


class LoginRequest(BaseModel):
    email: str
    password: str


class UserAuthProfile(BaseModel):
    id: int
    name: str
    email: str
    role: UserRole
    avatar_url: Optional[str] = None
    student_id: Optional[int] = None
    mentor_id: Optional[int] = None
    team_id: Optional[int] = None
    team_number: Optional[str] = None
    roll_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserAuthProfile


class TokenPayload(BaseModel):
    sub: str
    user_id: int
    role: UserRole
    exp: Optional[int] = None
