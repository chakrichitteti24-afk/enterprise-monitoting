from typing import Optional, List, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.security import decode_access_token
from app.core.exceptions import CredentialsException, PermissionDeniedException, ResourceNotFoundException
from app.models.user import User
from app.models.student import Student
from app.models.mentor import Mentor
from app.models.team import Team
from app.models.enums import UserRole
from app.repositories.user_repository import UserRepository

oauth2_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    if not auth or not auth.credentials:
        raise CredentialsException(detail="Not authenticated. Bearer token missing.")

    token = auth.credentials
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise CredentialsException(detail="Invalid or expired token.")

    user_id = payload.get("user_id") or int(payload["sub"])
    user_repo = UserRepository(db)
    user = user_repo.get_with_profiles(user_id)

    if not user:
        raise CredentialsException(detail="User no longer exists.")

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user account.",
        )

    return user


def require_roles(*allowed_roles: UserRole) -> Callable[[User], User]:
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise PermissionDeniedException(
                detail=f"Action requires one of the following roles: {[r.value for r in allowed_roles]}."
            )
        return current_user

    return role_checker


# Specific Role Shortcuts
def require_student(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.STUDENT:
        raise PermissionDeniedException(detail="Access restricted to enrolled Students only.")
    if not current_user.student_profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    return current_user


def require_mentor(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.MENTOR:
        raise PermissionDeniedException(detail="Access restricted to Faculty Mentors only.")
    if not current_user.mentor_profile:
        raise HTTPException(status_code=404, detail="Mentor profile not found.")
    return current_user


def require_dean(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.DEAN:
        raise PermissionDeniedException(detail="Access restricted to Dean / Academic Admin only.")
    return current_user


# Strict Ownership & Team Isolation Checks
def check_student_access(student_id: int, current_user: User, db: Session) -> Student:
    student = db.get(Student, student_id)
    if not student:
        raise ResourceNotFoundException("Student", str(student_id))

    # 1. Dean can access all students
    if current_user.role == UserRole.DEAN:
        return student

    # 2. Mentor can ONLY access students in their assigned teams
    if current_user.role == UserRole.MENTOR:
        mentor = current_user.mentor_profile
        assigned_team_ids = [t.id for t in mentor.assigned_teams] if mentor else []
        if student.team_id not in assigned_team_ids:
            raise PermissionDeniedException(
                detail="Forbidden: Mentor can only view students assigned to their own team(s)."
            )
        return student

    # 3. Student can ONLY access their own record
    if current_user.role == UserRole.STUDENT:
        if not current_user.student_profile or current_user.student_profile.id != student_id:
            raise PermissionDeniedException(
                detail="Forbidden: Students are not permitted to access other students' records."
            )
        return student

    raise PermissionDeniedException()


def check_team_access(team_id: int, current_user: User, db: Session) -> Team:
    team = db.get(Team, team_id)
    if not team:
        raise ResourceNotFoundException("Team", str(team_id))

    # 1. Dean can access all 20 teams
    if current_user.role == UserRole.DEAN:
        return team

    # 2. Mentor can ONLY access their assigned team
    if current_user.role == UserRole.MENTOR:
        mentor = current_user.mentor_profile
        assigned_team_ids = [t.id for t in mentor.assigned_teams] if mentor else []
        if team_id not in assigned_team_ids:
            raise PermissionDeniedException(
                detail=f"Forbidden: Mentor is only authorized to access their assigned team(s) ({assigned_team_ids})."
            )
        return team

    # 3. Student cannot access team management endpoints
    raise PermissionDeniedException(detail="Forbidden: Students cannot access team management.")
