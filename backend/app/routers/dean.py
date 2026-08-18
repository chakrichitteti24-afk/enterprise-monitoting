from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_dean
from app.models.user import User
from app.models.enums import StudentStatus, DSALevel
from app.services.dean_service import DeanService
from app.services.mentor_service import MentorService
from app.services.student_service import StudentService
from app.schemas.team import TeamOut, TeamDetailOut
from app.schemas.student import StudentOut, StudentDetailOut
from app.schemas.analytics import (
    DeanDashboardOverview,
    DeanAnalyticsOut,
    ReportExecutiveSummary,
)
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/dean", tags=["Dean & Institutional Oversight"])


@router.get(
    "/dashboard",
    response_model=DeanDashboardOverview,
    summary="Get Dean macro oversight dashboard",
    description="Returns aggregate institutional KPIs across all 100 students, 20 teams, and 20 mentors.",
)
def get_dean_dashboard(
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    dean_service = DeanService(db)
    return dean_service.get_dashboard_overview()


@router.get(
    "/teams",
    response_model=List[TeamOut],
    summary="Get all 20 monitored teams",
    description="Lists all 20 teams with performance metrics, rank, and assigned faculty mentors.",
)
def get_dean_teams(
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    dean_service = DeanService(db)
    return dean_service.get_all_teams_summaries()


@router.get(
    "/teams/{team_id}",
    response_model=TeamDetailOut,
    summary="Drilldown into specific team",
    description="Returns detailed cohort dossier and member roster for any of the 20 teams.",
)
def get_dean_team_detail(
    team_id: int,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    return mentor_service.get_team_detail(team_id)


@router.get(
    "/teams/{team_id}/students",
    response_model=List[StudentOut],
    summary="Get 5 students of a team",
    description="Lists the 5 student profiles in a specific team.",
)
def get_dean_team_students(
    team_id: int,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    mentor_service = MentorService(db)
    return mentor_service.get_team_students(team_id)


@router.get(
    "/students",
    response_model=PaginatedResponse[StudentOut],
    summary="Search & filter 100 students directory",
    description="Paginated student roster supporting search by name/roll number and filtering by team, status, or DSA level.",
)
def get_dean_students(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search by student name or roll number"),
    team_id: Optional[int] = Query(None, description="Filter by Team ID"),
    team_number: Optional[str] = Query(None, description="Filter by Team Number (e.g. 'Team 07')"),
    status: Optional[StudentStatus] = Query(None, description="Filter by student status"),
    level: Optional[DSALevel] = Query(None, description="Filter by DSA competency level"),
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    dean_service = DeanService(db)
    return dean_service.get_paginated_students(
        page=page,
        limit=limit,
        search=search,
        team_id=team_id,
        team_number=team_number,
        status=status,
        level=level,
    )


@router.get(
    "/students/{student_id}",
    response_model=StudentDetailOut,
    summary="Drilldown into individual student record",
    description="Privileged access to full dossier, activities, submissions, and mentor notes for any student.",
)
def get_dean_student_detail(
    student_id: int,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    student_service = StudentService(db)
    return student_service.get_student_detail(student_id)


@router.get(
    "/analytics",
    response_model=DeanAnalyticsOut,
    summary="Get macro analytics and topic mastery breakdown",
    description="Returns institution-wide topic mastery percentages, difficulty distributions, and velocity rankings.",
)
def get_dean_analytics(
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    dean_service = DeanService(db)
    return dean_service.get_macro_analytics()


@router.get(
    "/reports",
    response_model=ReportExecutiveSummary,
    summary="Get formal academic accreditation report",
    description="Generates an executive compliance summary and team matrix suitable for institutional audits.",
)
def get_dean_reports(
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    dean_service = DeanService(db)
    return dean_service.get_formal_report()
