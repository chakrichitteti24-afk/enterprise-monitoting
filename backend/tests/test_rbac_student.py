import pytest
from fastapi.testclient import TestClient


def test_student_can_access_own_profile(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/student/me",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["roll_number"] == "23F81A0502"
    assert data["name"] == "BODDU ANANTHALAKSHMI"
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


def test_student_can_change_profile_photo(client: TestClient, student_1_token: str):
    new_avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
    response = client.put(
        "/api/student/me/avatar",
        headers={"Authorization": f"Bearer {student_1_token}"},
        json={"avatar_url": new_avatar},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["avatar_url"] == new_avatar


