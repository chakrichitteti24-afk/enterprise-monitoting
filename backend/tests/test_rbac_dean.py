import pytest
from fastapi.testclient import TestClient


def test_dean_dashboard_macro_kpis(client: TestClient, dean_token: str):
    response = client.get(
        "/api/dean/dashboard",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_students"] == 46
    assert data["total_teams"] == 20
    assert data["total_mentors"] == 20
    assert data["overall_progress"] > 0
    assert len(data["team_performance"]) == 20


def test_dean_access_all_teams(client: TestClient, dean_token: str):
    response = client.get(
        "/api/dean/teams",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 20


def test_dean_drilldown_into_teams(client: TestClient, dean_token: str):
    response = client.get(
        "/api/dean/teams/1",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["team_number"] == "Team 01"
    assert len(data["students"]) == 5


def test_dean_paginated_students_directory(client: TestClient, dean_token: str):
    response = client.get(
        "/api/dean/students?page=1&limit=20",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 46
    assert data["limit"] == 20
    assert data["total_pages"] == 3
    assert len(data["items"]) == 20


def test_dean_drilldown_into_any_student(client: TestClient, dean_token: str):
    # Student 1 from Team 1
    resp1 = client.get(
        "/api/dean/students/1",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp1.status_code == 200
    assert resp1.json()["id"] == 1

    # Student 27 (Chakri)
    resp27 = client.get(
        "/api/dean/students/27",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp27.status_code == 200
    assert resp27.json()["id"] == 27


def test_dean_analytics_and_reports(client: TestClient, dean_token: str):
    resp_an = client.get(
        "/api/dean/analytics",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp_an.status_code == 200
    assert "topic_mastery" in resp_an.json()
    assert "difficulty_breakdown" in resp_an.json()

    resp_rep = client.get(
        "/api/dean/reports",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp_rep.status_code == 200
    assert "document_ref" in resp_rep.json()
    assert resp_rep.json()["assigned_mentors"] == 20
    assert resp_rep.json()["enrolled_students"] == 46


def test_dean_create_dsa_problem(client: TestClient, dean_token: str):
    payload = {
        "title": "Subarray Sum Equals K",
        "description": "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
        "difficulty": "MEDIUM",
        "topic": "ARRAYS",
        "platform_url": "https://leetcode.com/problems/subarray-sum-equals-k",
        "acceptance_rate": "43.5%",
    }
    response = client.post(
        "/api/problems",
        headers={"Authorization": f"Bearer {dean_token}"},
        json=payload,
    )
    assert response.status_code == 201
    assert response.json()["title"] == "Subarray Sum Equals K"


def test_dean_create_update_and_delete_team(client: TestClient, dean_token: str):
    # 1. Create Team
    payload = {"team_number": "Team 99", "name": "Quantum Coders"}
    res_create = client.post(
        "/api/dean/teams",
        headers={"Authorization": f"Bearer {dean_token}"},
        json=payload,
    )
    assert res_create.status_code == 201
    team_id = res_create.json()["id"]
    assert res_create.json()["team_number"] == "Team 99"
    assert res_create.json()["name"] == "Quantum Coders"

    # 2. Update Team
    res_update = client.put(
        f"/api/dean/teams/{team_id}",
        headers={"Authorization": f"Bearer {dean_token}"},
        json={"name": "Quantum Coders Elite"},
    )
    assert res_update.status_code == 200
    assert res_update.json()["name"] == "Quantum Coders Elite"

    # 3. Delete Team
    res_del = client.delete(
        f"/api/dean/teams/{team_id}",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert res_del.status_code == 200


def test_dean_enroll_update_and_delete_student(client: TestClient, dean_token: str):
    # 1. Create Student in Team 1
    payload = {
        "name": "Kavya Nandini",
        "roll_number": "24F81A0599",
        "email": "kavya.24f81a0599@gkce.edu.in",
        "team_id": 1,
    }
    res_create = client.post(
        "/api/dean/students",
        headers={"Authorization": f"Bearer {dean_token}"},
        json=payload,
    )
    assert res_create.status_code == 201
    student_id = res_create.json()["id"]
    assert res_create.json()["roll_number"] == "24F81A0599"

    # 2. Update Student
    res_update = client.put(
        f"/api/dean/students/{student_id}",
        headers={"Authorization": f"Bearer {dean_token}"},
        json={"dsa_level": "INTERMEDIATE"},
    )
    assert res_update.status_code == 200
    assert res_update.json()["dsa_level"] == "INTERMEDIATE"

    # 3. Delete Student
    res_del = client.delete(
        f"/api/dean/students/{student_id}",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert res_del.status_code == 200


def test_mentor_and_student_cannot_manage_teams(client: TestClient, mentor_team1_token: str, student_1_token: str):
    # Mentor attempt
    res_m = client.post(
        "/api/dean/teams",
        headers={"Authorization": f"Bearer {mentor_team1_token}"},
        json={"team_number": "Team 88", "name": "Hackers"},
    )
    assert res_m.status_code == 403

    # Student attempt
    res_s = client.post(
        "/api/dean/students",
        headers={"Authorization": f"Bearer {student_1_token}"},
        json={"name": "Test", "roll_number": "24F81A0588", "email": "test@gkce.edu.in", "team_id": 1},
    )
    assert res_s.status_code == 403

