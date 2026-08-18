from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_student, get_current_user, check_student_access
from app.models.user import User
from app.models.submission import Submission
from app.repositories.submission_repository import SubmissionRepository
from app.repositories.problem_repository import ProblemRepository
from app.schemas.submission import SubmissionCreate, SubmissionOut
from app.core.exceptions import ResourceNotFoundException

router = APIRouter(prefix="/submissions", tags=["Submissions & Automated Test Bench"])


@router.post(
    "",
    response_model=SubmissionOut,
    status_code=status.HTTP_201_CREATED,
    summary="Submit DSA problem solution",
    description="Records student code submission and automatically recomputes solved counts, accuracy, streaks, and activity logs on the backend.",
)
def submit_solution(
    submission_in: SubmissionCreate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_id = current_user.student_profile.id
    prob_repo = ProblemRepository(db)
    problem = prob_repo.get_by_id(submission_in.problem_id)
    if not problem:
        raise ResourceNotFoundException("DSA Problem", str(submission_in.problem_id))

    sub_repo = SubmissionRepository(db)
    submission, _ = sub_repo.record_submission_and_sync_progress(
        student_id=student_id,
        problem_id=submission_in.problem_id,
        status=submission_in.status,
        score=submission_in.score,
        runtime_ms=submission_in.runtime_ms,
        memory_mb=submission_in.memory_mb,
        code_snippet=submission_in.code_snippet,
        language=submission_in.language,
    )

    return SubmissionOut(
        id=submission.id,
        student_id=submission.student_id,
        problem_id=submission.problem_id,
        problem_title=problem.title,
        problem_topic=problem.topic.value,
        problem_difficulty=problem.difficulty.value,
        status=submission.status,
        score=submission.score,
        runtime_ms=submission.runtime_ms,
        memory_mb=submission.memory_mb,
        code_snippet=submission.code_snippet,
        language=submission.language,
        submitted_at=submission.submitted_at,
    )


@router.get(
    "/{submission_id}",
    response_model=SubmissionOut,
    summary="Get submission details by ID",
    description="Returns detailed execution metrics for a specific submission (subject to student/mentor/dean authorization).",
)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    sub_repo = SubmissionRepository(db)
    submission = sub_repo.get_by_id(submission_id)
    if not submission:
        raise ResourceNotFoundException("Submission", str(submission_id))

    # Ownership check: student self, mentor of student's team, or Dean
    check_student_access(student_id=submission.student_id, current_user=current_user, db=db)

    problem = submission.problem
    return SubmissionOut(
        id=submission.id,
        student_id=submission.student_id,
        problem_id=submission.problem_id,
        problem_title=problem.title if problem else "Problem",
        problem_topic=problem.topic.value if problem else None,
        problem_difficulty=problem.difficulty.value if problem else None,
        status=submission.status,
        score=submission.score,
        runtime_ms=submission.runtime_ms,
        memory_mb=submission.memory_mb,
        code_snippet=submission.code_snippet,
        language=submission.language,
        submitted_at=submission.submitted_at,
    )
