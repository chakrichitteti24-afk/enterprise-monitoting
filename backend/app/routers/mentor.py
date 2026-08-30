from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_mentor, check_student_access, require_roles
from app.core.exceptions import PermissionDeniedException, ResourceNotFoundException
from app.models.user import User
from app.models.enums import UserRole
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
    description="Returns the full dossier for a specific assigned team, including all 5 students' profiles, overall progress metrics, and topic-by-topic performance.",
)
def get_mentor_team(
    team_id: Optional[int] = None,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor = current_user.mentor_profile
    if not mentor or not mentor.assigned_teams:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not assigned to any team.",
        )
    
    target_team_id = team_id if team_id else mentor.assigned_teams[0].id
    
    assigned_team_ids = [t.id for t in mentor.assigned_teams]
    if target_team_id not in assigned_team_ids:
        raise PermissionDeniedException(detail="Forbidden: Mentor can only view their assigned teams.")

    mentor_service = MentorService(db)
    return mentor_service.get_team_detail(target_team_id)


@router.get(
    "/team/students",
    response_model=List[StudentOut],
    summary="Get the 5 assigned students",
    description="Returns a lightweight list of the students assigned to the specified team.",
)
def get_mentor_team_students(
    team_id: Optional[int] = None,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor = current_user.mentor_profile
    if not mentor or not mentor.assigned_teams:
        return []
        
    mentor_service = MentorService(db)
    assigned_team_ids = [t.id for t in mentor.assigned_teams]

    if team_id:
        if team_id not in assigned_team_ids:
            raise PermissionDeniedException(detail="Forbidden: Mentor can only view their assigned teams.")
        return mentor_service.get_team_students(team_id)
    
    # Return all students for all assigned teams
    all_students = []
    for t_id in assigned_team_ids:
        all_students.extend(mentor_service.get_team_students(t_id))
    return all_students


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
    description="Returns topic-by-topic completion rates for the assigned team.",
)
def get_mentor_team_progress(
    team_id: Optional[int] = None,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor = current_user.mentor_profile
    if not mentor or not mentor.assigned_teams:
        return {}
        
    target_team_id = team_id if team_id else mentor.assigned_teams[0].id
    
    assigned_team_ids = [t.id for t in mentor.assigned_teams]
    if target_team_id not in assigned_team_ids:
        raise PermissionDeniedException(detail="Forbidden: Mentor can only view their assigned teams.")

    mentor_service = MentorService(db)
    team_detail = mentor_service.get_team_detail(target_team_id)
    return team_detail.topic_performance


@router.get(
    "/team/analytics",
    summary="Get aggregate cohort analytics",
    description="Returns high-level statistics across the assigned team.",
)
def get_mentor_team_analytics(
    team_id: Optional[int] = None,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor = current_user.mentor_profile
    if not mentor or not mentor.assigned_teams:
        return {
            "average_progress": 0.0,
            "total_solved": 0,
            "average_streak": 0.0,
            "students_at_risk": 0,
            "top_performers": 0,
        }
        
    target_team_id = team_id if team_id else mentor.assigned_teams[0].id
    
    assigned_team_ids = [t.id for t in mentor.assigned_teams]
    if target_team_id not in assigned_team_ids:
        raise PermissionDeniedException(detail="Forbidden: Mentor can only view their assigned teams.")

    mentor_service = MentorService(db)
    team_detail = mentor_service.get_team_detail(target_team_id)

    at_risk = sum(1 for s in team_detail.students if s.progress_percentage < 40)
    top_performers = sum(1 for s in team_detail.students if s.progress_percentage > 85)

    return {
        "average_progress": team_detail.average_progress,
        "total_solved": team_detail.total_problems_solved,
        "average_streak": team_detail.average_streak,
        "students_at_risk": at_risk,
        "top_performers": top_performers,
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
    current_user: User = Depends(require_roles(UserRole.MENTOR, UserRole.DEAN)),
    db: Session = Depends(get_db),
):
    check_student_access(student_id=student_id, current_user=current_user, db=db)
    mentor_id = current_user.mentor_profile.id if current_user.mentor_profile else None
    if not mentor_id:
        from app.models.student import Student
        st = db.query(Student).filter(Student.id == student_id).first()
        mentor_id = st.team.mentor_id if st and st.team and st.team.mentor_id else 1
    mentor_service = MentorService(db)
    return mentor_service.add_student_feedback_note(
        mentor_id=mentor_id,
        student_id=student_id,
        note_text=note_in.note,
    )


from app.schemas.student import StudentCreate

@router.post(
    "/students",
    response_model=StudentOut,
    status_code=status.HTTP_201_CREATED,
    summary="Add a student to mentor's assigned cohort",
    description="Creates a new student strictly assigned to the mentor's team.",
)
def create_mentor_student(
    student_in: StudentCreate,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    mentor = current_user.mentor_profile
    if not mentor or not mentor.assigned_teams:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must be assigned to at least one team before creating students.",
        )
    
    assigned_team_ids = [t.id for t in mentor.assigned_teams]
    target_team_id = student_in.team_id if student_in.team_id else assigned_team_ids[0]
    
    if target_team_id not in assigned_team_ids:
        raise PermissionDeniedException(detail="Forbidden: You can only enroll students into teams assigned to you.")
        
    student_in.team_id = target_team_id
    
    mentor_service = MentorService(db)
    return mentor_service.create_student(student_in)

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


class TeamVerifySchema(BaseModel):
    team_identifier: str
    problem_id: str
    verified: bool


@router.get("/verifications", summary="Get all verified problem completions")
def get_all_verifications(
    current_user: User = Depends(require_roles(UserRole.STUDENT, UserRole.MENTOR, UserRole.DEAN)),
    db: Session = Depends(get_db)
):
    from app.models.student import Student
    students = db.query(Student).all()
    id_to_roll = {}
    for s in students:
        id_to_roll[str(s.id)] = s.roll_number
        id_to_roll[f"student-{s.id}"] = s.roll_number
        id_to_roll[s.roll_number] = s.roll_number

    records = db.query(StudentVerifiedProblem).all()
    res: Dict[str, List[str]] = {}
    for r in records:
        canonical_id = id_to_roll.get(r.student_identifier, r.student_identifier)
        if canonical_id not in res:
            res[canonical_id] = []
        if r.problem_id not in res[canonical_id]:
            res[canonical_id].append(r.problem_id)
            
    # Include both roll_number and student-<id> formats for complete frontend compatibility
    final_res: Dict[str, List[str]] = {}
    for canonical_id, problems in res.items():
        final_res[canonical_id] = problems
        for s in students:
            if s.roll_number == canonical_id:
                final_res[f"student-{s.id}"] = problems
                final_res[str(s.id)] = problems
                break
                
    return final_res


def _sync_student_progress_db(db: Session, student_id_or_roll: str):
    from app.models.student import Student
    from app.models.progress import StudentProgress
    from app.models.team import Team

    clean_id = student_id_or_roll.strip()
    student = None
    if clean_id.isdigit():
        student = db.query(Student).filter(Student.id == int(clean_id)).first()
    
    if not student and clean_id.startswith("student-"):
        try:
            sid = int(clean_id.split("-")[1])
            student = db.query(Student).filter(Student.id == sid).first()
        except ValueError:
            pass

    if not student:
        student = db.query(Student).filter(Student.roll_number == clean_id).first()

    if not student:
        return

    # Check all possible identifier formats to ensure we don't miss any verifications
    possible_identifiers = [
        student.roll_number,
        f"student-{student.id}",
        str(student.id),
        clean_id
    ]
    
    # Deduplicate the list
    possible_identifiers = list(set(possible_identifiers))
    
    # Get verifications
    ver_records = db.query(StudentVerifiedProblem.problem_id).filter(
        StudentVerifiedProblem.student_identifier.in_(possible_identifiers)
    ).all()
    ver_ids = set()
    for (pid,) in ver_records:
        if pid.startswith("prob-"):
            try: ver_ids.add(int(pid.replace("prob-", "")))
            except: pass
        elif pid.isdigit(): ver_ids.add(int(pid))
        else: ver_ids.add(pid)

    # Get submissions
    from app.models.submission import Submission
    from app.models.enums import SubmissionStatus
    sub_records = db.query(Submission.problem_id).filter(
        Submission.student_id == student.id,
        Submission.status == SubmissionStatus.SOLVED
    ).all()
    sub_ids = {pid for (pid,) in sub_records}

    verified_count = len(ver_ids.union(sub_ids))

    total_curriculum = 100.0
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
    current_user: User = Depends(require_roles(UserRole.MENTOR, UserRole.DEAN)),
    db: Session = Depends(get_db),
):
    from app.models.student import Student
    student_id = payload.student_identifier.strip()
    problem_id = payload.problem_id.strip()

    # Resolve canonical roll number if available
    student = None
    if student_id.isdigit():
        student = db.query(Student).filter(Student.id == int(student_id)).first()
    elif student_id.startswith("student-"):
        try:
            student = db.query(Student).filter(Student.id == int(student_id.split("-")[1])).first()
        except ValueError:
            pass
    if not student:
        student = db.query(Student).filter(Student.roll_number == student_id).first()

    canonical_identifier = student.roll_number if student else student_id
    possible_identifiers = list({student_id, canonical_identifier, f"student-{student.id}" if student else student_id})

    existing = (
        db.query(StudentVerifiedProblem)
        .filter(
            StudentVerifiedProblem.student_identifier.in_(possible_identifiers),
            StudentVerifiedProblem.problem_id == problem_id,
        )
        .first()
    )

    if payload.verified:
        if not existing:
            new_record = StudentVerifiedProblem(
                student_identifier=canonical_identifier,
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
    _sync_student_progress_db(db, canonical_identifier)

    # Return updated list of verified problem IDs for this student
    verified_records = (
        db.query(StudentVerifiedProblem)
        .filter(StudentVerifiedProblem.student_identifier.in_(possible_identifiers))
        .all()
    )
    return {
        "student_identifier": canonical_identifier,
        "verified_problem_ids": [r.problem_id for r in verified_records],
    }


@router.post("/batch-verify", summary="Batch verify problems for student")
def batch_verify_problems(
    payload: BatchVerifySchema,
    current_user: User = Depends(require_roles(UserRole.MENTOR, UserRole.DEAN)),
    db: Session = Depends(get_db),
):
    from app.models.student import Student
    student_id = payload.student_identifier.strip()

    student = None
    if student_id.isdigit():
        student = db.query(Student).filter(Student.id == int(student_id)).first()
    elif student_id.startswith("student-"):
        try:
            student = db.query(Student).filter(Student.id == int(student_id.split("-")[1])).first()
        except ValueError:
            pass
    if not student:
        student = db.query(Student).filter(Student.roll_number == student_id).first()

    canonical_identifier = student.roll_number if student else student_id
    possible_identifiers = list({student_id, canonical_identifier, f"student-{student.id}" if student else student_id})

    for pid in payload.problem_ids:
        pid = pid.strip()
        existing = (
            db.query(StudentVerifiedProblem)
            .filter(
                StudentVerifiedProblem.student_identifier.in_(possible_identifiers),
                StudentVerifiedProblem.problem_id == pid,
            )
            .first()
        )
        if payload.verified:
            if not existing:
                db.add(StudentVerifiedProblem(
                    student_identifier=canonical_identifier,
                    problem_id=pid,
                    day_number=payload.day_number,
                ))
        else:
            if existing:
                db.delete(existing)

    db.commit()

    # Synchronize student progress and team metrics in database
    _sync_student_progress_db(db, canonical_identifier)

    verified_records = (
        db.query(StudentVerifiedProblem)
        .filter(StudentVerifiedProblem.student_identifier.in_(possible_identifiers))
        .all()
    )
    return {
        "student_identifier": canonical_identifier,
        "verified_problem_ids": [r.problem_id for r in verified_records],
    }


@router.post("/team-verify", summary="Verify problem for entire team")
def verify_team_problem(
    payload: TeamVerifySchema,
    current_user: User = Depends(require_roles(UserRole.MENTOR, UserRole.DEAN)),
    db: Session = Depends(get_db),
):
    from app.models.student import Student
    from app.models.team import Team

    t_id_str = payload.team_identifier.strip()
    team = None
    if t_id_str.isdigit():
        team = db.query(Team).filter(Team.id == int(t_id_str)).first()
    if not team and t_id_str.startswith("team-"):
        try:
            tid = int(t_id_str.split("-")[1])
            team = db.query(Team).filter(Team.id == tid).first()
        except ValueError:
            pass
    if not team:
        team = db.query(Team).filter(Team.team_number == t_id_str).first()

    students = team.students if team else []
    for s in students:
        possible_ids = [s.roll_number, f"student-{s.id}", str(s.id)]
        existing = (
            db.query(StudentVerifiedProblem)
            .filter(
                StudentVerifiedProblem.student_identifier.in_(possible_ids),
                StudentVerifiedProblem.problem_id == payload.problem_id.strip(),
            )
            .first()
        )
        if payload.verified:
            if not existing:
                db.add(StudentVerifiedProblem(
                    student_identifier=s.roll_number,
                    problem_id=payload.problem_id.strip(),
                ))
        else:
            if existing:
                db.delete(existing)
        _sync_student_progress_db(db, s.roll_number)

    db.commit()
    return {
        "status": "success",
        "team_identifier": payload.team_identifier,
        "problem_id": payload.problem_id,
        "verified": payload.verified,
        "affected_students": len(students),
    }

