import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.database.session import SessionLocal
from app.models.user import User
from scripts.seed_data import seed as seed_database, DEAN_PASSWORD, MENTOR_PASSWORD, STUDENT_PASSWORD


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
    return get_token(client, "root@gkce.edu.in", DEAN_PASSWORD)


@pytest.fixture
def mentor_team1_token(client: TestClient) -> str:
    return get_token(client, "suresh.kumar@gkce.edu.in", MENTOR_PASSWORD)


@pytest.fixture
def mentor_team2_token(client: TestClient) -> str:
    return get_token(client, "radhika.p@gkce.edu.in", MENTOR_PASSWORD)


@pytest.fixture
def student_1_token(client: TestClient) -> str:
    return get_token(client, "ananthalakshmi23f81a0502@gkce.edu.in", STUDENT_PASSWORD)


@pytest.fixture
def student_2_token(client: TestClient) -> str:
    return get_token(client, "devika23f81a0507@gkce.edu.in", STUDENT_PASSWORD)


@pytest.fixture
def student_team2_token(client: TestClient) -> str:
    return get_token(client, "habeeba23f81a0510@gkce.edu.in", STUDENT_PASSWORD)
