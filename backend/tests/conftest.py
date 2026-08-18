import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database.session import SessionLocal
from app.models.user import User
from scripts.seed_data import seed_database, DEAN_PASSWORD, MENTOR_PASSWORD, STUDENT_PASSWORD


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    db = SessionLocal()
    try:
        if db.query(User).count() < 121:
            seed_database()
    finally:
        db.close()


@pytest.fixture
def client():
    return TestClient(app)


def get_token(client: TestClient, email: str, password: str) -> str:
    response = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def dean_token(client: TestClient) -> str:
    return get_token(client, "dean.academics@gkce.edu.in", DEAN_PASSWORD)


@pytest.fixture
def mentor_team1_token(client: TestClient) -> str:
    return get_token(client, "mentor.01@gkce.edu.in", MENTOR_PASSWORD)


@pytest.fixture
def mentor_team2_token(client: TestClient) -> str:
    return get_token(client, "mentor.02@gkce.edu.in", MENTOR_PASSWORD)


@pytest.fixture
def student_1_token(client: TestClient) -> str:
    return get_token(client, "student.001@gkce.edu.in", STUDENT_PASSWORD)


@pytest.fixture
def student_2_token(client: TestClient) -> str:
    return get_token(client, "student.002@gkce.edu.in", STUDENT_PASSWORD)


@pytest.fixture
def student_team2_token(client: TestClient) -> str:
    return get_token(client, "student.006@gkce.edu.in", STUDENT_PASSWORD)
