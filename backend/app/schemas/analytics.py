from typing import List, Dict, Any
from pydantic import BaseModel
from app.schemas.team import TeamOut


class TopicMasteryStats(BaseModel):
    topic: str
    percentage: int
    total_solved: int


class DifficultyBreakdown(BaseModel):
    easy_solved: int
    medium_solved: int
    hard_solved: int
    easy_total: int
    medium_total: int
    hard_total: int


class DeanDashboardOverview(BaseModel):
    total_students: int
    total_teams: int
    total_mentors: int
    overall_progress: float
    total_problems_solved: int
    active_students: int
    needs_attention_students: int
    inactive_students: int
    top_teams: List[TeamOut] = []
    needs_attention_teams: List[TeamOut] = []
    team_performance: List[TeamOut] = []


class DeanAnalyticsOut(BaseModel):
    overall_progress: float
    total_problems_solved: int
    active_students_count: int
    needs_attention_count: int
    inactive_count: int
    topic_mastery: List[TopicMasteryStats]
    difficulty_breakdown: DifficultyBreakdown
    team_velocity_ranking: List[TeamOut]


class ReportExecutiveSummary(BaseModel):
    document_ref: str
    report_date: str
    status: str
    enrolled_students: int
    total_teams: int
    assigned_mentors: int
    batch_average_percentage: float
    topics_compliance: List[Dict[str, Any]]
    teams_matrix: List[Dict[str, Any]]
    dean_signature: str
