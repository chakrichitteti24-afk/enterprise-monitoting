from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user, require_dean
from app.models.user import User
from app.models.enums import DSATopic, ProblemDifficulty, UserRole
from app.models.problem import DSAProblem
from app.repositories.problem_repository import ProblemRepository
from app.schemas.problem import DSAProblemOut, DSAProblemCreate, DSAProblemUpdate
from app.schemas.common import MessageResponse
from app.core.exceptions import ResourceNotFoundException

router = APIRouter(prefix="/problems", tags=["DSA Problems Bank"])


@router.get(
    "",
    response_model=List[DSAProblemOut],
    summary="List DSA problems in curriculum bank",
    description="Fetches problems with optional filters by topic and difficulty level.",
)
def list_problems(
    search: Optional[str] = Query(None, description="Search keyword"),
    topic: Optional[DSATopic] = Query(None, description="Filter by topic"),
    difficulty: Optional[ProblemDifficulty] = Query(None, description="Filter by difficulty"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prob_repo = ProblemRepository(db)
    problems, _ = prob_repo.get_filtered(
        search=search, topic=topic, difficulty=difficulty, skip=skip, limit=limit
    )

    return [
        DSAProblemOut(
            id=p.id,
            title=p.title,
            description=p.description,
            difficulty=p.difficulty,
            topic=p.topic,
            platform_url=p.platform_url,
            acceptance_rate=p.acceptance_rate,
            total_test_cases=p.total_test_cases,
            created_at=p.created_at,
            solved_count=len(p.submissions),
        )
        for p in problems
    ]


@router.get(
    "/{problem_id}",
    response_model=DSAProblemOut,
    summary="Get single problem statement",
    description="Returns detailed problem definition, test case count, and metadata.",
)
def get_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    prob_repo = ProblemRepository(db)
    problem = prob_repo.get_by_id(problem_id)
    if not problem:
        raise ResourceNotFoundException("DSA Problem", str(problem_id))

    return DSAProblemOut(
        id=problem.id,
        title=problem.title,
        description=problem.description,
        difficulty=problem.difficulty,
        topic=problem.topic,
        platform_url=problem.platform_url,
        acceptance_rate=problem.acceptance_rate,
        total_test_cases=problem.total_test_cases,
        created_at=problem.created_at,
        solved_count=len(problem.submissions),
    )


@router.post(
    "",
    response_model=DSAProblemOut,
    status_code=status.HTTP_201_CREATED,
    summary="Create new DSA problem (Dean Only)",
    description="Adds a new practice problem to the institutional curriculum.",
)
def create_problem(
    problem_in: DSAProblemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dean),
):
    prob_repo = ProblemRepository(db)
    new_prob = DSAProblem(**problem_in.model_dump())
    created = prob_repo.create(new_prob)
    return DSAProblemOut(
        id=created.id,
        title=created.title,
        description=created.description,
        difficulty=created.difficulty,
        topic=created.topic,
        platform_url=created.platform_url,
        acceptance_rate=created.acceptance_rate,
        total_test_cases=created.total_test_cases,
        created_at=created.created_at,
        solved_count=0,
    )


@router.put(
    "/{problem_id}",
    response_model=DSAProblemOut,
    summary="Update problem specification (Dean Only)",
    description="Modifies an existing curriculum problem definition.",
)
def update_problem(
    problem_id: int,
    problem_in: DSAProblemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dean),
):
    prob_repo = ProblemRepository(db)
    problem = prob_repo.get_by_id(problem_id)
    if not problem:
        raise ResourceNotFoundException("DSA Problem", str(problem_id))

    update_data = problem_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(problem, field, value)

    updated = prob_repo.update(problem)
    return DSAProblemOut(
        id=updated.id,
        title=updated.title,
        description=updated.description,
        difficulty=updated.difficulty,
        topic=updated.topic,
        platform_url=updated.platform_url,
        acceptance_rate=updated.acceptance_rate,
        total_test_cases=updated.total_test_cases,
        created_at=updated.created_at,
        solved_count=len(updated.submissions),
    )


@router.delete(
    "/{problem_id}",
    response_model=MessageResponse,
    summary="Delete DSA problem (Dean Only)",
    description="Removes a problem from the curriculum.",
)
def delete_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_dean),
):
    prob_repo = ProblemRepository(db)
    deleted = prob_repo.delete(problem_id)
    if not deleted:
        raise ResourceNotFoundException("DSA Problem", str(problem_id))
    return MessageResponse(message=f"Problem {problem_id} deleted successfully.")
