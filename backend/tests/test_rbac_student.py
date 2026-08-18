import pytest
from fastapi.testclient import TestClient


def test_student_can_access_own_profile(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/student/me",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["roll_number"] == "22CSE001"
    assert data["name"] == "Aarav Sharma"
    assert "progress" in data
    assert "topic_progress" in data["progress"]


def test_student_can_access_own_progress(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/student/progress",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "overall_percentage" in data
    assert "problems_solved" in data
    assert "difficulty_stats" in data


def test_student_can_access_own_streak(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/student/streak",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "current_streak" in data


def test_student_cannot_access_mentor_team_dashboard(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/mentor/team",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    # Must return 403 Forbidden
    assert response.status_code == 403
    assert "Access restricted to Faculty Mentors" in response.json()["detail"]


def test_student_cannot_access_dean_dashboard(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/dean/dashboard",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    # Must return 403 Forbidden
    assert response.status_code == 403
    assert "Access restricted to Dean" in response.json()["detail"]


def test_student_cannot_access_dean_students_directory(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/dean/students",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    # Must return 403 Forbidden
    assert response.status_code == 403
