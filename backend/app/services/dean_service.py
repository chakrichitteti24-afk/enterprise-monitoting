from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, func, distinct
from app.repositories.team_repository import TeamRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.mentor_repository import MentorRepository
from app.repositories.problem_repository import ProblemRepository
from app.repositories.submission_repository import SubmissionRepository
from app.repositories.user_repository import UserRepository
from app.services.student_service import StudentService
from app.services.mentor_service import MentorService
from app.core.security import get_password_hash
from app.models.user import User
from app.models.student import Student
from app.models.team import Team
from app.models.mentor import Mentor
from app.models.progress import StudentProgress
from app.models.problem import DSAProblem
from app.models.submission import Submission
from app.models.enums import UserRole, StudentStatus, DSALevel, DSATopic, ProblemDifficulty, SubmissionStatus
from app.schemas.team import TeamOut, TeamDetailOut, TeamCreate, TeamUpdate
from app.schemas.student import StudentOut, StudentCreate, StudentUpdate
from app.schemas.mentor import MentorOut, MentorCreate, MentorUpdate
from app.schemas.analytics import (
    DeanDashboardOverview,
    DeanAnalyticsOut,
    TopicMasteryStats,
    DifficultyBreakdown,
    ReportExecutiveSummary,
)
from app.schemas.common import PaginatedResponse


class DeanService:
    def __init__(self, db: Session):
        self.db = db
        self.team_repo = TeamRepository(db)
        self.student_repo = StudentRepository(db)
        self.mentor_repo = MentorRepository(db)
        self.prob_repo = ProblemRepository(db)
        self.sub_repo = SubmissionRepository(db)
        self.student_service = StudentService(db)
        self.mentor_service = MentorService(db)

    def get_all_teams_summaries(self) -> List[TeamOut]:
        teams = self.team_repo.get_all_with_details()
        result = []
        for idx, t in enumerate(teams):
            st_outs = [self.student_service._build_student_out(s) for s in t.students]
            count = len(st_outs)
            avg_p = (
                round(sum(s.progress_percentage for s in st_outs) / count, 1)
                if count > 0
                else 0.0
            )
            tot_s = sum(s.problems_solved for s in st_outs)
            tot_a = sum(s.problems_attempted for s in st_outs)
            avg_str = (
                round(sum(s.current_streak for s in st_outs) / count, 1)
                if count > 0
                else 0.0
            )
            mentor_user = t.mentor.user if t.mentor and t.mentor.user else None

            status = "ACTIVE"
            if avg_p < 60:
                status = "NEEDS_ATTENTION"

            result.append(
                TeamOut(
                    id=t.id,
                    team_number=t.team_number,
                    name=t.name,
                    mentor_id=t.mentor.id if t.mentor else None,
                    mentor_name=mentor_user.name if mentor_user else "Unassigned",
                    mentor_email=mentor_user.email if mentor_user else None,
                    mentor_department=t.mentor.department if t.mentor else None,
                    mentor_avatar=mentor_user.avatar_url if mentor_user else None,
                    student_count=count,
                    average_progress=avg_p,
                    total_problems_solved=tot_s,
                    total_attempted=tot_a,
                    average_streak=avg_str,
                    status=status,
                    rank=idx + 1,
                    created_at=t.created_at,
                )
            )

        # Sort by average progress descending and assign ranks
        result.sort(key=lambda x: x.average_progress, reverse=True)
        for i, tm in enumerate(result):
            tm.rank = i + 1

        return result

    def get_dashboard_overview(self) -> DeanDashboardOverview:
        total_students = self.student_repo.count()
        total_teams = self.team_repo.count()
        total_mentors = self.mentor_repo.count()

        teams_summary = self.get_all_teams_summaries()

        # Overall student stats
        all_students = self.student_repo.get_all(limit=200)
        st_outs = [self.student_service._build_student_out(s) for s in all_students]

        total_solved = sum(s.problems_solved for s in st_outs)
        overall_progress = (
            round(sum(s.progress_percentage for s in st_outs) / max(1, len(st_outs)), 1)
            if st_outs
            else 76.0
        )

        active_count = sum(1 for s in st_outs if s.status == StudentStatus.ACTIVE)
        attention_count = sum(1 for s in st_outs if s.status == StudentStatus.NEEDS_ATTENTION)
        inactive_count = sum(1 for s in st_outs if s.status == StudentStatus.INACTIVE)

        top_teams = teams_summary[:3]
        needs_attention = [t for t in teams_summary if t.status == "NEEDS_ATTENTION"]

        return DeanDashboardOverview(
            total_students=total_students,
            total_teams=total_teams,
            total_mentors=total_mentors,
            overall_progress=overall_progress,
            total_problems_solved=total_solved,
            active_students=active_count,
            needs_attention_students=attention_count,
            inactive_students=inactive_count,
            top_teams=top_teams,
            needs_attention_teams=needs_attention,
            team_performance=teams_summary,
        )

    def get_paginated_students(
        self,
        page: int = 1,
        limit: int = 20,
        search: Optional[str] = None,
        team_id: Optional[int] = None,
        team_number: Optional[str] = None,
        status: Optional[StudentStatus] = None,
        level: Optional[DSALevel] = None,
    ) -> PaginatedResponse[StudentOut]:
        students, total = self.student_repo.get_paginated_filtered(
            page=page,
            limit=limit,
            search=search,
            team_id=team_id,
            team_number=team_number,
            status=status,
            level=level,
        )
        items = [self.student_service._build_student_out(s) for s in students]
        total_pages = (total + limit - 1) // max(1, limit)

        return PaginatedResponse[StudentOut](
            items=items,
            page=page,
            limit=limit,
            total=total,
            total_pages=total_pages,
        )

    def get_macro_analytics(self) -> DeanAnalyticsOut:
        overview = self.get_dashboard_overview()
        total_students = max(1, self.student_repo.count())

        # Exact difficulty breakdown from real problems & submissions
        total_easy_probs = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.EASY).scalar() or 1
        total_med_probs = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.MEDIUM).scalar() or 1
        total_hard_probs = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.difficulty == ProblemDifficulty.HARD).scalar() or 1

        easy_solved = self.db.query(func.count(distinct(Submission.id))).join(DSAProblem).filter(
            DSAProblem.difficulty == ProblemDifficulty.EASY,
            Submission.status == SubmissionStatus.SOLVED
        ).scalar() or 0

        med_solved = self.db.query(func.count(distinct(Submission.id))).join(DSAProblem).filter(
            DSAProblem.difficulty == ProblemDifficulty.MEDIUM,
            Submission.status == SubmissionStatus.SOLVED
        ).scalar() or 0

        hard_solved = self.db.query(func.count(distinct(Submission.id))).join(DSAProblem).filter(
            DSAProblem.difficulty == ProblemDifficulty.HARD,
            Submission.status == SubmissionStatus.SOLVED
        ).scalar() or 0

        diff_breakdown = DifficultyBreakdown(
            easy_solved=easy_solved,
            medium_solved=med_solved,
            hard_solved=hard_solved,
            easy_total=total_easy_probs * total_students,
            medium_total=total_med_probs * total_students,
            hard_total=total_hard_probs * total_students,
        )

        # Exact topic mastery stats directly from database
        topic_stats = []
        for topic in DSATopic:
            t_probs = self.db.query(func.count(DSAProblem.id)).filter(DSAProblem.topic == topic).scalar() or 1
            t_total_potential = t_probs * total_students
            t_solved = self.db.query(func.count(distinct(Submission.id))).join(DSAProblem).filter(
                DSAProblem.topic == topic,
                Submission.status == SubmissionStatus.SOLVED
            ).scalar() or 0
            t_pct = round((t_solved / max(1, t_total_potential)) * 100, 1)
            topic_stats.append(
                TopicMasteryStats(
                    topic=topic.value,
                    percentage=t_pct,
                    total_solved=t_solved,
                )
            )

        return DeanAnalyticsOut(
            overall_progress=overview.overall_progress,
            total_problems_solved=overview.total_problems_solved,
            active_students_count=overview.active_students,
            needs_attention_count=overview.needs_attention_students,
            inactive_count=overview.inactive_students,
            topic_mastery=topic_stats,
            difficulty_breakdown=diff_breakdown,
            team_velocity_ranking=overview.team_performance,
        )

    def get_formal_report(self) -> ReportExecutiveSummary:
        overview = self.get_dashboard_overview()
        teams = self.get_all_teams_summaries()
        macro_analytics = self.get_macro_analytics()
        topic_map = {ts.topic: ts.percentage for ts in macro_analytics.topic_mastery}

        topics = [
            {
                "topic": "Arrays & Strings",
                "benchmark": "80%",
                "compliance": f"{round((topic_map.get('ARRAYS', 0) + topic_map.get('STRINGS', 0)) / 2, 1)}%",
                "status": "Met" if ((topic_map.get('ARRAYS', 0) + topic_map.get('STRINGS', 0)) / 2) >= 80 else "In Progress",
            },
            {
                "topic": "Linked Lists & Queues",
                "benchmark": "75%",
                "compliance": f"{round((topic_map.get('LINKED_LISTS', 0) + topic_map.get('QUEUE', 0)) / 2, 1)}%",
                "status": "Met" if ((topic_map.get('LINKED_LISTS', 0) + topic_map.get('QUEUE', 0)) / 2) >= 75 else "In Progress",
            },
            {
                "topic": "Trees & Binary Search",
                "benchmark": "70%",
                "compliance": f"{topic_map.get('TREES', 0)}%",
                "status": "Met" if topic_map.get('TREES', 0) >= 70 else "In Progress",
            },
            {
                "topic": "Graphs & Algorithms",
                "benchmark": "65%",
                "compliance": f"{topic_map.get('GRAPHS', 0)}%",
                "status": "Met" if topic_map.get('GRAPHS', 0) >= 65 else "In Progress",
            },
            {
                "topic": "Dynamic Programming",
                "benchmark": "60%",
                "compliance": f"{topic_map.get('DYNAMIC_PROGRAMMING', 0)}%",
                "status": "Met" if topic_map.get('DYNAMIC_PROGRAMMING', 0) >= 60 else "Intervention Active",
            },
        ]

        teams_matrix = [
            {
                "team": tm.team_number,
                "mentor": tm.mentor_name,
                "students": tm.student_count,
                "progress": f"{tm.average_progress}%",
                "solved": tm.total_problems_solved,
                "rating": "A+" if tm.average_progress >= 85 else "A" if tm.average_progress >= 75 else "B",
            }
            for tm in teams
        ]

        return ReportExecutiveSummary(
            document_ref="GKCE/DSA/ACAD-REP/2026-Q1",
            report_date="August 2026",
            status="ACCREDITED / IN COMPLIANCE",
            enrolled_students=overview.total_students,
            total_teams=overview.total_teams,
            assigned_mentors=overview.total_mentors,
            batch_average_percentage=overview.overall_progress,
            topics_compliance=topics,
            teams_matrix=teams_matrix,
            dean_signature="Dr. R. V. Raman, Ph.D. — Dean of Academics",
        )

    # -------------------------------------------------------------
    # Team Administrative Management
    # -------------------------------------------------------------
    def _build_team_out(self, team: Team) -> TeamOut:
        st_outs = [self.student_service._build_student_out(s) for s in (team.students or [])]
        count = len(st_outs)
        avg_p = (
            round(sum(s.progress_percentage for s in st_outs) / count, 1)
            if count > 0
            else 0.0
        )
        tot_s = sum(s.problems_solved for s in st_outs)
        tot_a = sum(s.problems_attempted for s in st_outs)
        avg_str = (
            round(sum(s.current_streak for s in st_outs) / count, 1)
            if count > 0
            else 0.0
        )
        mentor_user = team.mentor.user if team.mentor and team.mentor.user else None

        status = "ACTIVE"
        if avg_p < 60:
            status = "NEEDS_ATTENTION"

        return TeamOut(
            id=team.id,
            team_number=team.team_number,
            name=team.name,
            mentor_id=team.mentor.id if team.mentor else None,
            mentor_name=mentor_user.name if mentor_user else "Unassigned",
            mentor_email=mentor_user.email if mentor_user else None,
            mentor_department=team.mentor.department if team.mentor else None,
            mentor_avatar=mentor_user.avatar_url if mentor_user else None,
            student_count=count,
            average_progress=avg_p,
            total_problems_solved=tot_s,
            total_attempted=tot_a,
            average_streak=avg_str,
            status=status,
            rank=1,
            created_at=team.created_at,
        )

    def create_team(self, team_in: TeamCreate) -> TeamOut:
        existing = self.team_repo.get_by_team_number(team_in.team_number)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team with number '{team_in.team_number}' already exists.",
            )

        team = Team(
            team_number=team_in.team_number,
            name=team_in.name,
        )
        self.db.add(team)
        self.db.flush()

        if team_in.mentor_id:
            mentor = self.mentor_repo.get_by_id(team_in.mentor_id)
            if mentor:
                mentor.assigned_team_id = team.id
        elif team_in.mentor_name:
            mentor = self.db.query(Mentor).join(User).filter(User.name == team_in.mentor_name).first()
            if mentor:
                mentor.assigned_team_id = team.id

        self.db.commit()
        full_team = self.team_repo.get_by_id_with_details(team.id) or team
        return self._build_team_out(full_team)

    def update_team(self, team_id: int, team_in: TeamUpdate) -> TeamOut:
        team = self.team_repo.get_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Team {team_id} not found.",
            )

        if team_in.name is not None:
            team.name = team_in.name

        if team_in.mentor_id is not None:
            # Clear old mentor assigned to this team
            old_mentor = self.db.query(Mentor).filter(Mentor.assigned_team_id == team.id).first()
            if old_mentor and old_mentor.id != team_in.mentor_id:
                old_mentor.assigned_team_id = None

            if team_in.mentor_id > 0:
                new_mentor = self.mentor_repo.get_by_id(team_in.mentor_id)
                if new_mentor:
                    new_mentor.assigned_team_id = team.id
        elif team_in.mentor_name is not None:
            old_mentor = self.db.query(Mentor).filter(Mentor.assigned_team_id == team.id).first()
            if old_mentor:
                old_mentor.assigned_team_id = None
            
            new_mentor = self.db.query(Mentor).join(User).filter(User.name == team_in.mentor_name).first()
            if new_mentor:
                new_mentor.assigned_team_id = team.id

        self.db.commit()
        full_team = self.team_repo.get_by_id_with_details(team.id) or team
        return self._build_team_out(full_team)

    def delete_team(self, team_id: int):
        team = self.team_repo.get_by_id(team_id)
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Team {team_id} not found.",
            )

        # Unassign mentor
        mentor = self.db.query(Mentor).filter(Mentor.assigned_team_id == team.id).first()
        if mentor:
            mentor.assigned_team_id = None

        self.db.delete(team)
        self.db.commit()
        return {"detail": f"Team {team.team_number} successfully deleted."}

    # -------------------------------------------------------------
    # Student Administrative Management
    # -------------------------------------------------------------
    def create_student(self, student_in: StudentCreate) -> StudentOut:
        user_repo = UserRepository(self.db)
        if user_repo.get_by_email(student_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{student_in.email}' is already registered.",
            )

        if self.student_repo.get_by_roll_number(student_in.roll_number):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Roll number '{student_in.roll_number}' is already registered.",
            )

        team = None
        if student_in.team_id:
            team = self.team_repo.get_by_id(student_in.team_id)
        if not team and student_in.team_number:
            team = self.team_repo.get_by_team_number(student_in.team_number)
        if not team and student_in.team_id:
            team = self.team_repo.get_by_team_number(f"Team {student_in.team_id:02d}") or self.team_repo.get_by_team_number(f"Team {student_in.team_id}")
        if not team:
            team = self.db.query(Team).first()

        if not team:
            identifier = student_in.team_number or student_in.team_id or "Unknown"
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Target team '{identifier}' does not exist.",
            )

        # 1. Create User
        user = User(
            name=student_in.name,
            email=student_in.email,
            password_hash=get_password_hash(student_in.password or "Student@GKCE2026"),
            role=UserRole.STUDENT,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()

        # 2. Create Student Profile
        student = Student(
            user_id=user.id,
            roll_number=student_in.roll_number,
            team_id=team.id,
            status=student_in.status,
            dsa_level=student_in.dsa_level,
            leetcode_username=f"{student_in.name.lower().replace(' ', '_')[:10]}_{student_in.roll_number[-4:]}",
            github_username=f"{student_in.name.lower().replace(' ', '')[:10]}_{student_in.roll_number[-4:]}",
        )
        self.db.add(student)
        self.db.flush()

        # 3. Create Progress Tracker
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
        full_student = self.student_repo.get_by_id_with_relations(student.id) or student
        return self.student_service._build_student_out(full_student)

    def update_student(self, student_id: int, student_in: StudentUpdate) -> StudentOut:
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student {student_id} not found.",
            )

        if student_in.name and student.user:
            student.user.name = student_in.name

        if student_in.email and student.user:
            existing_user = self.db.query(User).filter(User.email == student_in.email, User.id != student.user_id).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email already in use.")
            student.user.email = student_in.email

        if student_in.roll_number:
            existing_roll = self.db.query(Student).filter(Student.roll_number == student_in.roll_number, Student.id != student.id).first()
            if existing_roll:
                raise HTTPException(status_code=400, detail="Roll number already in use.")
            student.roll_number = student_in.roll_number

        if student_in.team_id:
            team = self.team_repo.get_by_id(student_in.team_id)
            if not team:
                raise HTTPException(status_code=404, detail="Target team not found.")
            student.team_id = team.id
        elif student_in.team_number:
            team = self.team_repo.get_by_team_number(student_in.team_number)
            if team:
                student.team_id = team.id

        if student_in.dsa_level:
            student.dsa_level = student_in.dsa_level

        if student_in.status:
            student.status = student_in.status

        self.db.commit()
        full_student = self.student_repo.get_by_id_with_relations(student.id) or student
        return self.student_service._build_student_out(full_student)

    def delete_student(self, student_id: int):
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Student {student_id} not found.",
            )

        user_id = student.user_id
        self.db.delete(student)
        if user_id:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                self.db.delete(user)

        self.db.commit()
        return {"detail": f"Student {student_id} successfully de-enrolled."}

    # -------------------------------------------------------------
    # Mentor Administrative Management
    # -------------------------------------------------------------
    def create_mentor(self, mentor_in: MentorCreate) -> MentorOut:
        user_repo = UserRepository(self.db)
        if user_repo.get_by_email(mentor_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Email '{mentor_in.email}' is already registered.",
            )

        user = User(
            name=mentor_in.name,
            email=mentor_in.email,
            password_hash=get_password_hash(mentor_in.password or "Mentor@GKCE2026"),
            role=UserRole.MENTOR,
            is_active=True,
        )
        self.db.add(user)
        self.db.flush()

        mentor = Mentor(
            user_id=user.id,
            department=mentor_in.department,
            phone=mentor_in.phone,
            experience_years=mentor_in.experience_years,
            assigned_team_id=mentor_in.assigned_team_id,
        )
        self.db.add(mentor)
        self.db.commit()
        return self.mentor_service._build_mentor_out(mentor)

    def delete_mentor(self, mentor_id: int):
        mentor = self.mentor_repo.get_by_id(mentor_id)
        if not mentor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Mentor {mentor_id} not found.",
            )

        user_id = mentor.user_id
        self.db.delete(mentor)
        if user_id:
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                self.db.delete(user)

        self.db.commit()
        return {"detail": f"Mentor {mentor_id} successfully removed."}
