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


# ---------------------------------------------------------------------------
# Problem Verification Endpoints (Mentor / Dean)
# ---------------------------------------------------------------------------
from pydantic import BaseModel
from typing import Dict, Any, Optional
from app.models.verification import StudentVerifiedProblem


class SingleVerifySchema(BaseModel):
    student_identifier: str
    problem_id: str
    verified: bool
    day_number: Optional[int] = None


class BatchVerifySchema(BaseModel):
    student_identifier: str
    problem_ids: List[str]
    verified: bool
    day_number: Optional[int] = None


@router.get("/verifications", summary="Get all verified problem completions")
def get_all_verifications(db: Session = Depends(get_db)):
    records = db.query(StudentVerifiedProblem).all()
    res: Dict[str, List[str]] = {}
    for r in records:
        if r.student_identifier not in res:
            res[r.student_identifier] = []
        res[r.student_identifier].append(r.problem_id)
    return res


def _sync_student_progress_db(db: Session, student_id_or_roll: str):
    from app.models.student import Student
    from app.models.progress import StudentProgress
    from app.models.team import Team

    clean_id = student_id_or_roll.strip()
    student = None
    if clean_id.isdigit():
        student = db.query(Student).filter(Student.id == int(clean_id)).first()
    if not student:
        student = db.query(Student).filter(Student.roll_number == clean_id).first()

    if not student:
        return

    verified_count = db.query(StudentVerifiedProblem).filter(
        StudentVerifiedProblem.student_identifier == student.roll_number
    ).count()

    total_curriculum = 34.0
    prog_pct = min(100.0, round((verified_count / total_curriculum) * 100.0, 1))
    streak = max(1, verified_count // 5) if verified_count > 0 else 0

    prog = db.query(StudentProgress).filter(StudentProgress.student_id == student.id).first()
    if prog:
        prog.problems_solved = verified_count
        prog.problems_attempted = max(prog.problems_attempted, verified_count)
        prog.overall_percentage = prog_pct
        prog.current_streak = streak
        prog.longest_streak = max(prog.longest_streak, streak)
    else:
        prog = StudentProgress(
            student_id=student.id,
            problems_solved=verified_count,
            problems_attempted=verified_count,
            overall_percentage=prog_pct,
            current_streak=streak,
            longest_streak=streak,
        )
        db.add(prog)

    db.commit()

    if student.team_id:
        team_students = db.query(Student).filter(Student.team_id == student.team_id).all()
        if team_students:
            team_student_ids = [s.id for s in team_students]
            progresses = db.query(StudentProgress).filter(StudentProgress.student_id.in_(team_student_ids)).all()
            if progresses:
                avg_prog = round(sum(p.overall_percentage for p in progresses) / len(team_students), 1)
                tot_solved = sum(p.problems_solved for p in progresses)
                team = db.query(Team).filter(Team.id == student.team_id).first()
                if team:
                    team.average_progress = avg_prog
                    team.total_problems_solved = tot_solved
                    db.commit()


@router.post("/verify", summary="Toggle single problem verification")
def toggle_problem_verification(
    payload: SingleVerifySchema,
    db: Session = Depends(get_db),
):
    student_id = payload.student_identifier.strip()
    problem_id = payload.problem_id.strip()

    existing = (
        db.query(StudentVerifiedProblem)
        .filter(
            StudentVerifiedProblem.student_identifier == student_id,
            StudentVerifiedProblem.problem_id == problem_id,
        )
        .first()
    )

    if payload.verified:
        if not existing:
            new_record = StudentVerifiedProblem(
                student_identifier=student_id,
                problem_id=problem_id,
                day_number=payload.day_number,
            )
            db.add(new_record)
            db.commit()
    else:
        if existing:
            db.delete(existing)
            db.commit()

    # Synchronize student progress and team metrics in database
    _sync_student_progress_db(db, student_id)

    # Return updated list of verified problem IDs for this student
    verified_records = (
        db.query(StudentVerifiedProblem)
        .filter(StudentVerifiedProblem.student_identifier == student_id)
        .all()
    )
    return {
        "student_identifier": student_id,
        "verified_problem_ids": [r.problem_id for r in verified_records],
    }


@router.post("/batch-verify", summary="Batch verify problems for student")
def batch_verify_problems(
    payload: BatchVerifySchema,
    db: Session = Depends(get_db),
):
    student_id = payload.student_identifier.strip()

    for pid in payload.problem_ids:
        pid = pid.strip()
        existing = (
            db.query(StudentVerifiedProblem)
            .filter(
                StudentVerifiedProblem.student_identifier == student_id,
                StudentVerifiedProblem.problem_id == pid,
            )
            .first()
        )
        if payload.verified:
            if not existing:
                db.add(StudentVerifiedProblem(
                    student_identifier=student_id,
                    problem_id=pid,
                    day_number=payload.day_number,
                ))
        else:
            if existing:
                db.delete(existing)

    db.commit()

    # Synchronize student progress and team metrics in database
    _sync_student_progress_db(db, student_id)

    verified_records = (
        db.query(StudentVerifiedProblem)
        .filter(StudentVerifiedProblem.student_identifier == student_id)
        .all()
    )
    return {
        "student_identifier": student_id,
        "verified_problem_ids": [r.problem_id for r in verified_records],
    }

