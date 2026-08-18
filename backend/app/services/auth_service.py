from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import UserRepository
from app.core.security import verify_password, create_access_token
from app.core.exceptions import CredentialsException
from app.schemas.auth import LoginRequest, TokenResponse, UserAuthProfile
from app.models.team import Team


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def authenticate_user(self, login_data: LoginRequest) -> TokenResponse:
        user = self.user_repo.get_by_email(login_data.email)
        if not user or not verify_password(login_data.password, user.password_hash):
            raise CredentialsException(detail="Invalid institutional email or password.")

        if not user.is_active:
            raise CredentialsException(detail="Account is inactive. Contact GKCE administrator.")

        # Extract profile linkages
        student_id = user.student_profile.id if user.student_profile else None
        mentor_id = user.mentor_profile.id if user.mentor_profile else None
        roll_number = user.student_profile.roll_number if user.student_profile else None
        
        team_id = None
        team_number = None
        if user.student_profile:
            team_id = user.student_profile.team_id
            if user.student_profile.team:
                team_number = user.student_profile.team.team_number
        elif user.mentor_profile:
            team_id = user.mentor_profile.assigned_team_id
            if user.mentor_profile.assigned_team:
                team_number = user.mentor_profile.assigned_team.team_number

        # Create JWT access token
        access_token = create_access_token(
            subject=user.id,
            role=user.role.value,
            extra_claims={
                "email": user.email,
                "name": user.name,
                "student_id": student_id,
                "mentor_id": mentor_id,
                "team_id": team_id,
            },
        )

        user_profile = UserAuthProfile(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            avatar_url=user.avatar_url,
            student_id=student_id,
            mentor_id=mentor_id,
            team_id=team_id,
            team_number=team_number,
            roll_number=roll_number,
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
            user=user_profile,
        )
