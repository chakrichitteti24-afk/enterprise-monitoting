from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_mentor, check_student_access
from app.models.user import User
from app.services.mentor_service import MentorService
from app.services.student_service import StudentService
from app.schemas.mentor import MentorOut
from app.schemas.team import TeamDetailOut
from app.schemas.student import StudentOut, StudentDetailOut
from app.schemas.note import MentorNoteCreate, MentorNoteOut

router = APIRouter(prefix="/mentor", tags=["Mentors"])


@router.get(
    "/me",
    response_model=MentorOut,
    summary="Get authenticated mentor profile",
    description="Returns the mentor's profile details and assigned cohort identification.",
)
def get_mentor_me(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    return mentor_service.get_mentor_by_user_id(current_user.id)


@router.get(
    "/team",
    response_model=TeamDetailOut,
    summary="Get assigned team dossier",
    description="Returns details, metrics, and all 5 student profiles for the mentor's assigned cohort.",
)
def get_mentor_team(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    return mentor_service.get_team_detail(current_user.mentor_profile.assigned_team_id)


@router.get(
    "/team/students",
    response_model=List[StudentOut],
    summary="Get the 5 assigned students",
    description="Lists the exactly 5 students assigned to this mentor's cohort.",
)
def get_mentor_team_students(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    return mentor_service.get_team_students(current_user.mentor_profile.assigned_team_id)


@router.get(
    "/students/{student_id}",
    response_model=StudentDetailOut,
    summary="Inspect individual student dossier (team boundary enforced)",
    description="Returns detailed student performance. Raises 403 Forbidden if the student does not belong to the mentor's assigned team.",
)
def get_mentor_student_detail(
    student_id: int,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    # Enforces strict backend team boundary verification
    check_student_access(student_id=student_id, current_user=current_user, db=db)
    student_service = StudentService(db)
    return student_service.get_student_detail(student_id)


@router.get(
    "/team/progress",
    summary="Get team topic mastery matrix",
    description="Returns topic-by-topic completion rates for the assigned 5-student team.",
)
def get_mentor_team_progress(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    team_detail = mentor_service.get_team_detail(current_user.mentor_profile.assigned_team_id)
    return {
        "team_id": team_detail.id,
        "team_number": team_detail.team_number,
        "average_progress": team_detail.average_progress,
        "topic_performance": team_detail.topic_performance,
    }


@router.get(
    "/team/analytics",
    summary="Get aggregate cohort analytics",
    description="Returns high-level statistics across the assigned 5 students.",
)
def get_mentor_team_analytics(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    team_detail = mentor_service.get_team_detail(current_user.mentor_profile.assigned_team_id)
    return {
        "team_number": team_detail.team_number,
        "student_count": team_detail.student_count,
        "average_progress": team_detail.average_progress,
        "total_problems_solved": team_detail.total_problems_solved,
        "average_streak": team_detail.average_streak,
        "status": team_detail.status,
    }


@router.post(
    "/students/{student_id}/notes",
    response_model=MentorNoteOut,
    status_code=status.HTTP_201_CREATED,
    summary="Add mentor feedback note for student",
    description="Logs a qualitative feedback or intervention note on the student's academic record.",
)
def add_mentor_note(
    student_id: int,
    note_in: MentorNoteCreate,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    # Enforces strict backend team boundary verification
    check_student_access(student_id=student_id, current_user=current_user, db=db)
    mentor_service = MentorService(db)
    return mentor_service.add_student_feedback_note(
        mentor_id=current_user.mentor_profile.id,
        student_id=student_id,
        note_text=note_in.note,
    )
