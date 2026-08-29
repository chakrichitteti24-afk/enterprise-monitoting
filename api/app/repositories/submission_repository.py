from typing import Optional, List, Set, Dict, Any, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc
from app.models.submission import Submission
from app.models.student import Student
from app.models.problem import DSAProblem
from app.models.progress import StudentProgress
from app.models.activity import ActivityLog
from app.models.enums import SubmissionStatus, ProblemDifficulty, DSATopic
from app.repositories.base import BaseRepository


class SubmissionRepository(BaseRepository[Submission]):
    def __init__(self, db: Session):
        super().__init__(Submission, db)

    def get_by_student(self, student_id: int, skip: int = 0, limit: int = 50) -> List[Submission]:
        stmt = (
            select(Submission)
            .where(Submission.student_id == student_id)
            .options(joinedload(Submission.problem))
            .order_by(desc(Submission.submitted_at))
            .offset(skip)
            .limit(limit)
        )
        return list(self.db.scalars(stmt).all())

    def get_student_solved_problem_ids(self, student_id: int) -> Set[int]:
        stmt = (
            select(Submission.problem_id)
            .where(
                Submission.student_id == student_id,
                Submission.status == SubmissionStatus.SOLVED,
            )
            .distinct()
        )
        return set(self.db.scalars(stmt).all())

    def get_student_attempted_problem_ids(self, student_id: int) -> Set[int]:
        stmt = (
            select(Submission.problem_id)
            .where(Submission.student_id == student_id)
            .distinct()
        )
        return set(self.db.scalars(stmt).all())

    def get_solved_counts_by_topic(self, student_id: int) -> Dict[DSATopic, int]:
        stmt = (
            select(DSAProblem.topic, func.count(func.distinct(DSAProblem.id)))
            .join(Submission, Submission.problem_id == DSAProblem.id)
            .where(
                Submission.student_id == student_id,
                Submission.status == SubmissionStatus.SOLVED,
            )
            .group_by(DSAProblem.topic)
        )
        return dict(self.db.execute(stmt).all())

    def get_solved_counts_by_difficulty(self, student_id: int) -> Dict[ProblemDifficulty, int]:
        stmt = (
            select(DSAProblem.difficulty, func.count(func.distinct(DSAProblem.id)))
            .join(Submission, Submission.problem_id == DSAProblem.id)
            .where(
                Submission.student_id == student_id,
                Submission.status == SubmissionStatus.SOLVED,
            )
            .group_by(DSAProblem.difficulty)
        )
        return dict(self.db.execute(stmt).all())

    def record_submission_and_sync_progress(
        self,
        student_id: int,
        problem_id: int,
        status: SubmissionStatus,
        score: float,
        runtime_ms: int,
        memory_mb: float,
        code_snippet: Optional[str],
        language: str = "Java",
    ) -> Tuple[Submission, StudentProgress]:
        # 1. Create submission
        submission = Submission(
            student_id=student_id,
            problem_id=problem_id,
            status=status,
            score=score,
            runtime_ms=runtime_ms,
            memory_mb=memory_mb,
            code_snippet=code_snippet,
            language=language,
            submitted_at=datetime.now(timezone.utc),
        )
        self.db.add(submission)

        # 2. Get problem details for log
        problem = self.db.get(DSAProblem, problem_id)
        problem_title = problem.title if problem else "Problem"

        # 3. Create Activity Log
        activity_type = "SOLVED" if status == SubmissionStatus.SOLVED else "ATTEMPTED"
        activity = ActivityLog(
            student_id=student_id,
            problem_id=problem_id,
            activity_type=activity_type,
            description=f"{activity_type.capitalize()} '{problem_title}' with score {int(score)}%",
            created_at=datetime.now(timezone.utc),
        )
        self.db.add(activity)

        # 4. Recalculate Student Progress from database truth
        progress = self.db.scalars(
            select(StudentProgress).where(StudentProgress.student_id == student_id)
        ).first()

        if not progress:
            progress = StudentProgress(student_id=student_id)
            self.db.add(progress)

        solved_ids = self.get_student_solved_problem_ids(student_id)
        if status == SubmissionStatus.SOLVED:
            solved_ids.add(problem_id)

        attempted_ids = self.get_student_attempted_problem_ids(student_id)
        attempted_ids.add(problem_id)

        total_problems_in_curriculum = self.db.scalar(select(func.count(DSAProblem.id))) or 140
        unique_solved = max(progress.problems_solved + (1 if status == SubmissionStatus.SOLVED else 0), len(solved_ids))
        unique_attempted = max(progress.problems_attempted + 1, len(attempted_ids))

        diff_counts = self.get_solved_counts_by_difficulty(student_id)
        if status == SubmissionStatus.SOLVED and problem:
            diff_counts[problem.difficulty] = diff_counts.get(problem.difficulty, 0) + (1 if problem_id not in solved_ids else 0)

        progress.problems_solved = unique_solved
        progress.problems_attempted = unique_attempted
        progress.overall_percentage = min(100.0, round((unique_solved / max(1, total_problems_in_curriculum)) * 100, 1))
        progress.easy_solved = diff_counts.get(ProblemDifficulty.EASY, 0)
        progress.medium_solved = diff_counts.get(ProblemDifficulty.MEDIUM, 0)
        progress.hard_solved = diff_counts.get(ProblemDifficulty.HARD, 0)
        
        # Increment streak if first solve today
        if status == SubmissionStatus.SOLVED:
            progress.current_streak = max(1, progress.current_streak + 1)
            progress.longest_streak = max(progress.longest_streak, progress.current_streak)

        progress.updated_at = datetime.now(timezone.utc)

        self.db.commit()
        self.db.refresh(submission)
        self.db.refresh(progress)

        return submission, progress
