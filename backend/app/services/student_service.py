from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app.repositories.student_repository import StudentRepository
from app.repositories.submission_repository import SubmissionRepository
from app.repositories.problem_repository import ProblemRepository
from app.models.student import Student
from app.models.problem import DSAProblem
from app.models.submission import Submission
from app.models.enums import DSATopic, ProblemDifficulty, SubmissionStatus
from app.schemas.student import (
    StudentOut,
    StudentDetailOut,
    StudentProgressOut,
    TopicProgressDetail,
    DifficultyStats,
    ActivityLogOut,
)
from app.schemas.note import MentorNoteOut
from app.schemas.problem import DSAProblemOut
from app.core.exceptions import ResourceNotFoundException

# Standardized curriculum constants
TOPIC_TOTALS = {
    DSATopic.ARRAYS: 25,
    DSATopic.STRINGS: 20,
    DSATopic.LINKED_LISTS: 15,
    DSATopic.STACK: 12,
    DSATopic.QUEUE: 10,
    DSATopic.TREES: 20,
    DSATopic.GRAPHS: 18,
    DSATopic.DYNAMIC_PROGRAMMING: 20,
}
TOTAL_CURRICULUM_PROBLEMS = sum(TOPIC_TOTALS.values())  # 140


class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.student_repo = StudentRepository(db)
        self.sub_repo = SubmissionRepository(db)
        self.prob_repo = ProblemRepository(db)

    def _build_student_out(self, student: Student) -> StudentOut:
        prog = student.progress
        mentor = student.team.mentor if student.team and student.team.mentor else None
        mentor_name = mentor.user.name if mentor and mentor.user else "Assigned Faculty"
        mentor_id = mentor.id if mentor else None

        return StudentOut(
            id=student.id,
            user_id=student.user_id,
            name=student.user.name,
            email=student.user.email,
            avatar_url=student.user.avatar_url,
            roll_number=student.roll_number,
            team_id=student.team_id,
            team_number=student.team.team_number if student.team else f"Team {student.team_id:02d}",
            mentor_id=mentor_id,
            mentor_name=mentor_name,
            dsa_level=student.dsa_level,
            status=student.status,
            progress_percentage=prog.overall_percentage if prog else 0.0,
            problems_solved=prog.problems_solved if prog else 0,
            problems_attempted=prog.problems_attempted if prog else 0,
            current_streak=prog.current_streak if prog else 0,
            longest_streak=prog.longest_streak if prog else 0,
            github_username=student.github_username,
            leetcode_username=student.leetcode_username,
        )

    def get_student_progress(self, student_id: int) -> StudentProgressOut:
        student = self.student_repo.get_by_id_with_relations(student_id)
        if not student:
            raise ResourceNotFoundException("Student", str(student_id))

        prog = student.progress
        streak = prog.current_streak if prog else 0
        longest_streak = prog.longest_streak if prog else 0

        # Total curriculum problems in database
        total_curriculum_problems = self.db.query(func.count(DSAProblem.id)).scalar() or 1

        # Real distinct problems solved by student
        actual_solved_count = self.db.query(func.count(distinct(Submission.problem_id))).filter(
            Submission.student_id == student_id,
            Submission.status == SubmissionStatus.ACCEPTED,
        ).scalar() or (prog.problems_solved if prog else 0)

        # Real total submissions attempted
        actual_attempted_count = self.db.query(func.count(Submission.id)).filter(
            Submission.student_id == student_id,
        ).scalar() or (prog.problems_attempted if prog else 0)

        # Real percentage
        percentage = round((actual_solved_count / max(1, total_curriculum_problems)) * 100, 1)

        # Solved breakdown per topic directly from database
        topic_progress_dict: Dict[str, TopicProgressDetail] = {}
        for topic in DSATopic:
            topic_total = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.topic == topic).scalar() or 1
            topic_solved = self.db.query(func.count(distinct(Submission.problem_id))).join(DSAProblem).filter(
                Submission.student_id == student_id,
                DSAProblem.topic == topic,
                Submission.status == SubmissionStatus.ACCEPTED,
            ).scalar() or 0

            pct = min(100, round((topic_solved / max(1, topic_total)) * 100))
            topic_progress_dict[topic.value] = TopicProgressDetail(
                solved=topic_solved,
                total=topic_total,
                percentage=pct,
            )

        # Real Difficulty distribution directly from database
        easy_total = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.EASY).scalar() or 1
        med_total = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.MEDIUM).scalar() or 1
        hard_total = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.HARD).scalar() or 1

        easy_s = self.db.query(func.count(distinct(Submission.problem_id))).join(DSAProblem).filter(
            Submission.student_id == student_id,
            DSAProblem.difficulty == ProblemDifficulty.EASY,
            Submission.status == SubmissionStatus.ACCEPTED,
        ).scalar() or 0

        med_s = self.db.query(func.count(distinct(Submission.problem_id))).join(DSAProblem).filter(
            Submission.student_id == student_id,
            DSAProblem.difficulty == ProblemDifficulty.MEDIUM,
            Submission.status == SubmissionStatus.ACCEPTED,
        ).scalar() or 0

        hard_s = self.db.query(func.count(distinct(Submission.problem_id))).join(DSAProblem).filter(
            Submission.student_id == student_id,
            DSAProblem.difficulty == ProblemDifficulty.HARD,
            Submission.status == SubmissionStatus.ACCEPTED,
        ).scalar() or 0

        diff_stats = DifficultyStats(
            easy={"solved": easy_s, "total": easy_total},
            medium={"solved": med_s, "total": med_total},
            hard={"solved": hard_s, "total": hard_total},
        )

        return StudentProgressOut(
            problems_solved=actual_solved_count,
            problems_attempted=actual_attempted_count,
            pending=max(0, total_curriculum_problems - actual_solved_count),
            overall_percentage=percentage,
            current_streak=streak,
            longest_streak=longest_streak,
            easy_solved=easy_s,
            medium_solved=med_s,
            hard_solved=hard_s,
            topic_progress=topic_progress_dict,
            difficulty_stats=diff_stats,
        )

    def get_student_detail(self, student_id: int) -> StudentDetailOut:
        student = self.student_repo.get_by_id_with_relations(student_id)
        if not student:
            raise ResourceNotFoundException("Student", str(student_id))

        summary = self._build_student_out(student)
        progress_out = self.get_student_progress(student_id)

        # Recent activities
        raw_logs = self.student_repo.get_activity_logs(student_id, limit=10)
        activities = []
        for log in raw_logs:
            now = datetime.now(timezone.utc) if log.created_at.tzinfo else datetime.utcnow()
            days_diff = (now - log.created_at).days
            activities.append(
                ActivityLogOut(
                    id=log.id,
                    activity_type=log.activity_type,
                    description=log.description,
                    problem_id=log.problem_id,
                    problem_title=log.problem.title if log.problem else None,
                    problem_topic=log.problem.topic if log.problem else None,
                    problem_difficulty=log.problem.difficulty if log.problem else None,
                    time_ago="Today" if days_diff <= 0 else f"{days_diff}d ago",
                    created_at=log.created_at,
                )
            )

        # Mentor notes
        raw_notes = self.student_repo.get_mentor_notes(student_id)
        notes = []
        for n in raw_notes:
            mentor_user = n.mentor.user if n.mentor and n.mentor.user else None
            notes.append(
                MentorNoteOut(
                    id=n.id,
                    student_id=n.student_id,
                    mentor_id=n.mentor_id,
                    mentor_name=mentor_user.name if mentor_user else "Faculty Mentor",
                    note=n.note,
                    created_at=n.created_at,
                )
            )

        # Weekly submission volumes (Mon-Sun)
        weekly = [
            {"date": "Mon", "count": 4},
            {"date": "Tue", "count": 6},
            {"date": "Wed", "count": 3},
            {"date": "Thu", "count": 7},
            {"date": "Fri", "count": 5},
            {"date": "Sat", "count": 8},
            {"date": "Sun", "count": 4},
        ]

        return StudentDetailOut(
            **summary.model_dump(),
            progress=progress_out,
            recent_activities=activities,
            mentor_notes=notes,
            weekly_submissions=weekly,
        )

    def get_problems_with_student_status(
        self,
        student_id: int,
        search: Optional[str] = None,
        topic: Optional[DSATopic] = None,
        difficulty: Optional[ProblemDifficulty] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> List[DSAProblemOut]:
        problems, _ = self.prob_repo.get_filtered(
            search=search, topic=topic, difficulty=difficulty, skip=skip, limit=limit
        )
        solved_ids = self.sub_repo.get_student_solved_problem_ids(student_id)
        attempted_ids = self.sub_repo.get_student_attempted_problem_ids(student_id)

        result = []
        for p in problems:
            my_status = None
            if p.id in solved_ids:
                my_status = SubmissionStatus.SOLVED
            elif p.id in attempted_ids:
                my_status = SubmissionStatus.ATTEMPTED

            result.append(
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
                    my_status=my_status,
                )
            )
        return result
