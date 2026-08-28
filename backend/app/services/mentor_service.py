from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func, distinct
from app.repositories.mentor_repository import MentorRepository
from app.repositories.team_repository import TeamRepository
from app.repositories.student_repository import StudentRepository
from app.services.student_service import StudentService
from app.models.note import MentorNote
from app.models.team import Team
from app.models.problem import DSAProblem
from app.models.submission import Submission
from app.models.enums import DSATopic, SubmissionStatus
from app.schemas.mentor import MentorOut
from app.schemas.team import TeamDetailOut, TeamOut
from app.schemas.student import StudentOut
from app.schemas.note import MentorNoteOut
from app.core.exceptions import ResourceNotFoundException, PermissionDeniedException


class MentorService:
    def __init__(self, db: Session):
        self.db = db
        self.mentor_repo = MentorRepository(db)
        self.team_repo = TeamRepository(db)
        self.student_repo = StudentRepository(db)
        self.student_service = StudentService(db)

    def _build_mentor_out(self, mentor) -> MentorOut:
        team_num = mentor.assigned_team.team_number if mentor.assigned_team else None
        return MentorOut(
            id=mentor.id,
            user_id=mentor.user_id,
            name=mentor.user.name,
            email=mentor.user.email,
            avatar_url=mentor.user.avatar_url,
            assigned_team_id=mentor.assigned_team_id,
            assigned_team_number=team_num,
            department=mentor.department,
            phone=mentor.phone,
            experience_years=mentor.experience_years,
            created_at=mentor.created_at,
        )

    def get_mentor_by_user_id(self, user_id: int) -> MentorOut:
        mentor = self.mentor_repo.get_by_user_id(user_id)
        if not mentor:
            raise ResourceNotFoundException("Mentor profile for user", str(user_id))
        return self._build_mentor_out(mentor)

    def get_team_detail(self, team_id: int) -> TeamDetailOut:
        team = self.team_repo.get_by_id_with_details(team_id)
        if not team:
            raise ResourceNotFoundException("Team", str(team_id))

        students_out: List[StudentOut] = [
            self.student_service._build_student_out(s) for s in team.students
        ]

        # Calculate metrics across 5 students
        total_students = len(students_out)
        avg_progress = (
            round(sum(s.progress_percentage for s in students_out) / total_students, 1)
            if total_students > 0
            else 0.0
        )
        total_solved = sum(s.problems_solved for s in students_out)
        total_attempted = sum(s.problems_attempted for s in students_out)
        avg_streak = (
            round(sum(s.current_streak for s in students_out) / total_students, 1)
            if total_students > 0
            else 0.0
        )

        # Exact Topic Performance directly from database submissions
        student_ids = [s.id for s in team.students]
        topic_perf = {}
        for topic in DSATopic:
            t_probs = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.topic == topic).scalar() or 1
            max_potential_solves = t_probs * max(1, len(student_ids))
            if student_ids:
                actual_solves = self.db.query(func.count(distinct(Submission.id))).join(DSAProblem).filter(
                    Submission.student_id.in_(student_ids),
                    DSAProblem.topic == topic,
                    Submission.status == SubmissionStatus.SOLVED,
                ).scalar() or 0
                topic_perf[topic.value] = min(100, round((actual_solves / max(1, max_potential_solves)) * 100))
            else:
                topic_perf[topic.value] = 0

        mentor_user = team.mentor.user if team.mentor and team.mentor.user else None

        status = "ACTIVE"
        if avg_progress < 60:
            status = "NEEDS_ATTENTION"

        return TeamDetailOut(
            id=team.id,
            team_number=team.team_number,
            name=team.name,
            mentor_id=team.mentor.id if team.mentor else None,
            mentor_name=mentor_user.name if mentor_user else "Unassigned",
            mentor_email=mentor_user.email if mentor_user else None,
            mentor_department=team.mentor.department if team.mentor else None,
            mentor_avatar=mentor_user.avatar_url if mentor_user else None,
            student_count=total_students,
            average_progress=avg_progress,
            total_problems_solved=total_solved,
            total_attempted=total_attempted,
            average_streak=avg_streak,
            status=status,
            rank=team.id,
            created_at=team.created_at,
            students=students_out,
            topic_performance=topic_perf,
        )

    def get_team_students(self, team_id: int) -> List[StudentOut]:
        students = self.student_repo.get_by_team_id(team_id)
        return [self.student_service._build_student_out(s) for s in students]

    def add_student_feedback_note(
        self, mentor_id: int, student_id: int, note_text: str
    ) -> MentorNoteOut:
        student = self.student_repo.get_by_id_with_relations(student_id)
        if not student:
            raise ResourceNotFoundException("Student", str(student_id))

        note = MentorNote(
            student_id=student_id,
            mentor_id=mentor_id,
            note=note_text.strip(),
        )
        self.db.add(note)
        self.db.commit()
        self.db.refresh(note)

        mentor = self.mentor_repo.get_by_id_with_relations(mentor_id)
        mentor_name = mentor.user.name if mentor and mentor.user else "Faculty Mentor"

        return MentorNoteOut(
            id=note.id,
            student_id=note.student_id,
            mentor_id=note.mentor_id,
            mentor_name=mentor_name,
            note=note.note,
            created_at=note.created_at,
        )

    def create_student(self, student_in: "StudentCreate") -> "StudentOut":
        from fastapi import HTTPException, status
        from app.models.user import User, UserRole
        from app.models.student import Student
        from app.models.progress import StudentProgress
        from app.core.security import get_password_hash

        if self.db.query(User).filter(User.email == student_in.email).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Email '{student_in.email}' is already registered.")
            
        if self.student_repo.get_by_roll_number(student_in.roll_number):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Roll number '{student_in.roll_number}' is already registered.")

        # Create User
        user = User(
            name=student_in.name,
            email=student_in.email,
            password_hash=get_password_hash(student_in.password or "Student@GKCE2026"),
            role=UserRole.STUDENT,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()

        # Create Student Profile
        student = Student(
            user_id=user.id,
            roll_number=student_in.roll_number,
            team_id=student_in.team_id,
            status=student_in.status,
            dsa_level=student_in.dsa_level,
            leetcode_username=f"{student_in.name.lower().replace(' ', '_')[:10]}_{student_in.roll_number[-4:]}",
            github_username=f"{student_in.name.lower().replace(' ', '')[:10]}_{student_in.roll_number[-4:]}",
        )
        self.db.add(student)
        self.db.flush()

        # Create Progress Tracker
        progress = StudentProgress(
            student_id=student.id,
            problems_solved=0,
            problems_attempted=0,
            overall_percentage=0.0,
            current_streak=0,
            longest_streak=0,
            easy_solved=0,
            medium_solved=0,
            hard_solved=0,
        )
        self.db.add(progress)
        self.db.commit()

        # Build output
        student_with_rel = self.student_repo.get_by_id_with_relations(student.id)
        return self.student_service._build_student_out(student_with_rel)
