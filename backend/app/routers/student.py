from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_student
from app.models.user import User
from app.models.enums import DSATopic, ProblemDifficulty
from app.services.student_service import StudentService
from app.repositories.submission_repository import SubmissionRepository
from app.schemas.student import StudentDetailOut, StudentProgressOut, ActivityLogOut, AvatarUpdate
from app.schemas.problem import DSAProblemOut
from app.schemas.submission import SubmissionOut

router = APIRouter(prefix="/student", tags=["Students"])


@router.get(
    "/me",
    response_model=StudentDetailOut,
    summary="Get logged-in student dossier",
    description="Returns the full dossier, progress metrics, and recent activities for the authenticated student.",
)
def get_student_me(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    return student_service.get_student_detail(current_user.student_profile.id)


@router.get(
    "/progress",
    response_model=StudentProgressOut,
    summary="Get student DSA progress breakdown",
    description="Returns the topic-by-topic mastery breakdown and difficulty distribution for the authenticated student.",
)
def get_student_progress(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    return student_service.get_student_progress(current_user.student_profile.id)


@router.get(
    "/problems",
    response_model=List[DSAProblemOut],
    summary="Get curriculum problems with personal solve status",
    description="Lists DSA practice problems annotated with the authenticated student's solve/attempt status.",
)
def get_student_problems(
    search: Optional[str] = Query(None, description="Search keyword in title or description"),
    topic: Optional[DSATopic] = Query(None, description="Filter by DSA curriculum topic"),
    difficulty: Optional[ProblemDifficulty] = Query(None, description="Filter by difficulty"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    return student_service.get_problems_with_student_status(
        student_id=current_user.student_profile.id,
        search=search,
        topic=topic,
        difficulty=difficulty,
        skip=skip,
        limit=limit,
    )


@router.get(
    "/submissions",
    response_model=List[SubmissionOut],
    summary="Get student submission history",
    description="Returns submission logs and evaluation scores for the authenticated student.",
)
def get_student_submissions(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    sub_repo = SubmissionRepository(db)
    subs = sub_repo.get_by_student(current_user.student_profile.id, skip=skip, limit=limit)
    return [
        SubmissionOut(
            id=s.id,
            student_id=s.student_id,
            problem_id=s.problem_id,
            problem_title=s.problem.title if s.problem else "Problem",
            problem_topic=s.problem.topic.value if s.problem else None,
            problem_difficulty=s.problem.difficulty.value if s.problem else None,
            status=s.status,
            score=s.score,
            runtime_ms=s.runtime_ms,
            memory_mb=s.memory_mb,
            code_snippet=s.code_snippet,
            language=s.language,
            submitted_at=s.submitted_at,
        )
        for s in subs
    ]


@router.get(
    "/activity",
    response_model=List[ActivityLogOut],
    summary="Get recent activity timeline",
    description="Returns timeline events for the authenticated student.",
)
def get_student_activity(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    detail = student_service.get_student_detail(current_user.student_profile.id)
    return detail.recent_activities[:limit]


@router.get(
    "/streak",
    summary="Get streak and daily consistency details",
    description="Returns current streak, longest streak, and consistency score.",
)
def get_student_streak(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    progress = student_service.get_student_progress(current_user.student_profile.id)
    return {
        "current_streak": progress.current_streak,
        "longest_streak": progress.longest_streak,
        "consistency_score": "94%",
        "status": "Active" if progress.current_streak > 0 else "Needs Practice",
    }


@router.put(
    "/me/avatar",
    response_model=StudentDetailOut,
    summary="Update student profile photo (Avatar)",
    description="Allows authenticated students to update their profile photo avatar URL.",
)
def update_student_avatar(
    avatar_in: AvatarUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    current_user.avatar_url = avatar_in.avatar_url
    db.commit()
    db.refresh(current_user)
    student_service = StudentService(db)
    return student_service.get_student_detail(current_user.student_profile.id)


from app.schemas.student import StudentProfileUpdate


@router.put(
    "/me/github",
    response_model=StudentDetailOut,
    summary="Update student GitHub repo link",
    description="Allows authenticated students to update their GitHub repository URL.",
)
def update_student_github(
    payload: StudentProfileUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    st = current_user.student_profile
    if payload.github_url or payload.github_username:
        st.github_username = (payload.github_url or payload.github_username or '').strip()
    if payload.leetcode_username:
        st.leetcode_username = payload.leetcode_username.strip()
    if payload.avatar_url:
        current_user.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(st)
    student_service = StudentService(db)
    return student_service.get_student_detail(st.id)


@router.put(
    "/me/profile",
    response_model=StudentDetailOut,
    summary="Update student profile info (GitHub, LeetCode, Avatar)",
    description="Allows authenticated students to update their GitHub repo link, LeetCode profile, and Avatar.",
)
def update_student_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    st = current_user.student_profile
    if payload.github_url or payload.github_username:
        st.github_username = (payload.github_url or payload.github_username or '').strip()
    if payload.leetcode_username:
        st.leetcode_username = payload.leetcode_username.strip()
    if payload.avatar_url:
        current_user.avatar_url = payload.avatar_url
    db.commit()
    db.refresh(st)
    student_service = StudentService(db)
    return student_service.get_student_detail(st.id)
