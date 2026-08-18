import pytest
from fastapi.testclient import TestClient


def test_dean_dashboard_macro_kpis(client: TestClient, dean_token: str):
    response = client.get(
        "/api/dean/dashboard",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total_students"] == 100
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
    # Verified each team has 5 students
    assert all(t["student_count"] == 5 for t in data)


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
    assert data["total"] == 100
    assert data["limit"] == 20
    assert data["total_pages"] == 5
    assert len(data["items"]) == 20


def test_dean_drilldown_into_any_student(client: TestClient, dean_token: str):
    # Student 1 from Team 1
    resp1 = client.get(
        "/api/dean/students/1",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp1.status_code == 200
    assert resp1.json()["id"] == 1

    # Student 87 from Team 18
    resp87 = client.get(
        "/api/dean/students/87",
        headers={"Authorization": f"Bearer {dean_token}"},
    )
    assert resp87.status_code == 200
    assert resp87.json()["id"] == 87


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
    assert resp_rep.json()["document_ref"] == "GKCE/DSA/ACAD-REP/2026-Q1"


def test_dean_create_dsa_problem(client: TestClient, dean_token: str):
    response = client.post(
        "/api/problems",
        headers={"Authorization": f"Bearer {dean_token}"},
        json={
            "title": "Subarray Sum Equals K",
            "description": "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
            "difficulty": "MEDIUM",
            "topic": "ARRAYS",
            "platform_url": "https://leetcode.com/problems/subarray-sum-equals-k",
            "acceptance_rate": "43.5%",
            "total_test_cases": 12,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Subarray Sum Equals K"
    assert data["topic"] == "ARRAYS"
