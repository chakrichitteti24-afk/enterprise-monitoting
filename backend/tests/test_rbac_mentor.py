import pytest
from fastapi.testclient import TestClient


def test_mentor_can_access_own_profile(client: TestClient, mentor_team1_token: str):
    response = client.get(
        "/api/mentor/me",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["assigned_team_number"] == "Team 01"
    assert data["name"] == "Dr. K. Suresh Kumar"


def test_mentor_can_access_own_team_dossier(client: TestClient, mentor_team1_token: str):
    response = client.get(
        "/api/mentor/team",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["team_number"] == "Team 01"
    assert len(data["students"]) == 5


def test_mentor_can_access_own_student(client: TestClient, mentor_team1_token: str):
    # Student 1 belongs to Team 1
    response = client.get(
        "/api/mentor/students/1",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == 1
    assert data["team_number"] == "Team 01"


def test_mentor_cannot_access_other_team_student(client: TestClient, mentor_team1_token: str):
    # Student 6 belongs to Team 2
    response = client.get(
        "/api/mentor/students/6",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    # Must be 403 Forbidden
    assert response.status_code == 403
    assert "Forbidden: Mentor can only view students assigned to their own team" in response.json()["detail"]


def test_mentor_cannot_add_note_to_other_team_student(client: TestClient, mentor_team1_token: str):
    # Student 6 belongs to Team 2
    response = client.post(
        "/api/mentor/students/6/notes",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
        json={"note": "Unauthorized feedback note."},
    )
    # Must be 403 Forbidden
    assert response.status_code == 403


def test_mentor_cannot_access_dean_dashboard(client: TestClient, mentor_team1_token: str):
    response = client.get(
        "/api/dean/dashboard",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    assert response.status_code == 403


def test_mentor_cannot_access_dean_teams_list(client: TestClient, mentor_team1_token: str):
    response = client.get(
        "/api/dean/teams",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
    )
    assert response.status_code == 403
