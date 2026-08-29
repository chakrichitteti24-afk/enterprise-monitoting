from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import LoginRequest, TokenResponse, UserAuthProfile
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Authenticate user & issue JWT",
    description="Authenticates institutional credentials (Dean, Mentor, or Student) and returns a signed JWT access token.",
)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.authenticate_user(login_data)


@router.get(
    "/me",
    response_model=UserAuthProfile,
    summary="Get current user identity",
    description="Returns profile and role claims of the currently authenticated user.",
)
def get_me(current_user: User = Depends(get_current_user)):
    student_id = current_user.student_profile.id if current_user.student_profile else None
    mentor_id = current_user.mentor_profile.id if current_user.mentor_profile else None
    roll_number = current_user.student_profile.roll_number if current_user.student_profile else None

    team_id = None
    team_number = None
    assigned_team_ids = None
    assigned_teams_list = None
    
    if current_user.student_profile:
        team_id = current_user.student_profile.team_id
        if current_user.student_profile.team:
            team_number = current_user.student_profile.team.team_number
    elif current_user.mentor_profile:
        mentor = current_user.mentor_profile
        if mentor.assigned_teams:
            assigned_team_ids = [t.id for t in mentor.assigned_teams]
            assigned_teams_list = [{"id": t.id, "team_number": t.team_number, "name": t.name} for t in mentor.assigned_teams]
            team_id = assigned_team_ids[0]
            team_number = mentor.assigned_teams[0].team_number

    return UserAuthProfile(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        role=current_user.role,
        avatar_url=current_user.avatar_url,
        student_id=student_id,
        mentor_id=mentor_id,
        team_id=team_id,
        team_number=team_number,
        roll_number=roll_number,
        assigned_team_ids=assigned_team_ids,
        assigned_teams=assigned_teams_list,
    )
