from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from app.repositories.mentor_repository import MentorRepository
from app.repositories.team_repository import TeamRepository
from app.repositories.student_repository import StudentRepository
from app.services.student_service import StudentService, TOPIC_TOTALS
from app.models.note import MentorNote
from app.models.team import Team
from app.models.enums import DSATopic
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

        # Topic performance
        topic_perf = {}
        for topic in DSATopic:
            topic_total = TOPIC_TOTALS.get(topic, 15) * max(1, total_students)
            # Estimate team solved
            est_ratio = min(1.0, (avg_progress / 100.0))
            topic_perf[topic.value] = min(100, round(est_ratio * 100))

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
