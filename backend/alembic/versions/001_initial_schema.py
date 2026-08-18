"""Initial schema: Users, Teams, Mentors, Students, Problems, Submissions, Progress, Activity, Notes

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-08-19 04:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_role'), 'users', ['role'], unique=False)

    # 2. teams
    op.create_table(
        'teams',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('team_number', sa.String(length=20), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_teams_team_number'), 'teams', ['team_number'], unique=True)

    # 3. mentors
    op.create_table(
        'mentors',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assigned_team_id', sa.Integer(), sa.ForeignKey('teams.id', ondelete='SET NULL'), nullable=True),
        sa.Column('department', sa.String(length=100), server_default='Computer Science & Engineering', nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('experience_years', sa.Integer(), server_default='8', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_mentors_user_id'), 'mentors', ['user_id'], unique=True)
    op.create_index(op.f('ix_mentors_assigned_team_id'), 'mentors', ['assigned_team_id'], unique=True)

    # 4. students
    op.create_table(
        'students',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('roll_number', sa.String(length=20), nullable=False),
        sa.Column('team_id', sa.Integer(), sa.ForeignKey('teams.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('dsa_level', sa.String(length=50), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('github_username', sa.String(length=100), nullable=True),
        sa.Column('leetcode_username', sa.String(length=100), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_students_user_id'), 'students', ['user_id'], unique=True)
    op.create_index(op.f('ix_students_roll_number'), 'students', ['roll_number'], unique=True)
    op.create_index(op.f('ix_students_team_id'), 'students', ['team_id'], unique=False)
    op.create_index(op.f('ix_students_status'), 'students', ['status'], unique=False)

    # 5. dsa_problems
    op.create_table(
        'dsa_problems',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('difficulty', sa.String(length=50), nullable=False),
        sa.Column('topic', sa.String(length=50), nullable=False),
        sa.Column('platform_url', sa.String(length=255), nullable=True),
        sa.Column('acceptance_rate', sa.String(length=20), server_default='50.0%', nullable=False),
        sa.Column('total_test_cases', sa.Integer(), server_default='10', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_dsa_problems_title'), 'dsa_problems', ['title'], unique=False)
    op.create_index(op.f('ix_dsa_problems_difficulty'), 'dsa_problems', ['difficulty'], unique=False)
    op.create_index(op.f('ix_dsa_problems_topic'), 'dsa_problems', ['topic'], unique=False)

    # 6. submissions
    op.create_table(
        'submissions',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('problem_id', sa.Integer(), sa.ForeignKey('dsa_problems.id', ondelete='CASCADE'), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('score', sa.Float(), server_default='100.0', nullable=False),
        sa.Column('runtime_ms', sa.Integer(), server_default='45', nullable=False),
        sa.Column('memory_mb', sa.Float(), server_default='42.0', nullable=False),
        sa.Column('code_snippet', sa.Text(), nullable=True),
        sa.Column('language', sa.String(length=50), server_default='Java', nullable=False),
        sa.Column('submitted_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_submissions_student_id'), 'submissions', ['student_id'], unique=False)
    op.create_index(op.f('ix_submissions_problem_id'), 'submissions', ['problem_id'], unique=False)
    op.create_index(op.f('ix_submissions_status'), 'submissions', ['status'], unique=False)
    op.create_index(op.f('ix_submissions_submitted_at'), 'submissions', ['submitted_at'], unique=False)

    # 7. student_progress
    op.create_table(
        'student_progress',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('problems_solved', sa.Integer(), server_default='0', nullable=False),
        sa.Column('problems_attempted', sa.Integer(), server_default='0', nullable=False),
        sa.Column('overall_percentage', sa.Float(), server_default='0.0', nullable=False),
        sa.Column('current_streak', sa.Integer(), server_default='0', nullable=False),
        sa.Column('longest_streak', sa.Integer(), server_default='0', nullable=False),
        sa.Column('easy_solved', sa.Integer(), server_default='0', nullable=False),
        sa.Column('medium_solved', sa.Integer(), server_default='0', nullable=False),
        sa.Column('hard_solved', sa.Integer(), server_default='0', nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_student_progress_student_id'), 'student_progress', ['student_id'], unique=True)

    # 8. activity_logs
    op.create_table(
        'activity_logs',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('problem_id', sa.Integer(), sa.ForeignKey('dsa_problems.id', ondelete='SET NULL'), nullable=True),
        sa.Column('activity_type', sa.String(length=50), nullable=False),
        sa.Column('description', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_activity_logs_student_id'), 'activity_logs', ['student_id'], unique=False)
    op.create_index(op.f('ix_activity_logs_created_at'), 'activity_logs', ['created_at'], unique=False)

    # 9. mentor_notes
    op.create_table(
        'mentor_notes',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('student_id', sa.Integer(), sa.ForeignKey('students.id', ondelete='CASCADE'), nullable=False),
        sa.Column('mentor_id', sa.Integer(), sa.ForeignKey('mentors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('note', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f('ix_mentor_notes_student_id'), 'mentor_notes', ['student_id'], unique=False)
    op.create_index(op.f('ix_mentor_notes_mentor_id'), 'mentor_notes', ['mentor_id'], unique=False)


def downgrade() -> None:
    op.drop_table('mentor_notes')
    op.drop_table('activity_logs')
    op.drop_table('student_progress')
    op.drop_table('submissions')
    op.drop_table('dsa_problems')
    op.drop_table('students')
    op.drop_table('mentors')
    op.drop_table('teams')
    op.drop_table('users')
