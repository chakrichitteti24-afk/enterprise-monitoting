import pytest
from fastapi.testclient import TestClient
from scripts.seed_data import DEAN_PASSWORD, MENTOR_PASSWORD, STUDENT_PASSWORD


def test_login_success_dean(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "dean.academics@gkce.edu.in", "password": DEAN_PASSWORD},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["role"] == "DEAN"
    assert data["user"]["name"] == "Dr. R. V. Raman"


def test_login_success_student(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "student.001@gkce.edu.in", "password": STUDENT_PASSWORD},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "STUDENT"
    assert data["user"]["roll_number"] == "22CSE001"
    assert data["user"]["team_id"] == 1


def test_login_invalid_password(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "dean.academics@gkce.edu.in", "password": "WrongPassword123"},
    )
    assert response.status_code == 401
    assert "Invalid institutional email or password" in response.json()["detail"]


def test_login_nonexistent_email(client: TestClient):
    response = client.post(
        "/api/auth/login",
        json={"email": "nobody@gkce.edu.in", "password": "AnyPassword"},
    )
    assert response.status_code == 401


def test_get_me_with_valid_token(client: TestClient, student_1_token: str):
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "STUDENT"
    assert data["roll_number"] == "22CSE001"


def test_get_me_missing_token(client: TestClient):
    response = client.get("/api/auth/me")
    assert response.status_code == 401
