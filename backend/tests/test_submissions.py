import pytest
from fastapi.testclient import TestClient


def test_student_submit_solution_and_auto_sync_progress(client: TestClient, student_1_token: str):
    # 1. Get initial progress
    initial_prog = client.get(
        "/api/student/progress",
        headers={"Authorization": f"Bearer {student_1_token}"},
    ).json()
    initial_solved = initial_prog["problems_solved"]

    # 2. Submit solution for problem #1
    submission_payload = {
        "problem_id": 1,
        "code_snippet": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{0, 1};\n    }\n}",
        "language": "Java",
        "status": "SOLVED",
        "score": 100.0,
        "runtime_ms": 48,
        "memory_mb": 41.8,
    }

    response = client.post(
        "/api/submissions",
        headers={"Authorization": f"Bearer {student_1_token}"},
        json=submission_payload,
    )
    assert response.status_code == 201
    sub_data = response.json()
    assert sub_data["problem_id"] == 1
    assert sub_data["status"] == "SOLVED"
    assert sub_data["score"] == 100.0
    assert sub_data["problem_title"] == "Two Sum"

    # 3. Check progress after submission
    updated_prog = client.get(
        "/api/student/progress",
        headers={"Authorization": f"Bearer {student_1_token}"},
    ).json()
    assert updated_prog["problems_solved"] >= initial_solved
    assert updated_prog["overall_percentage"] > 0

    # 4. Check that activity log recorded the submission
    activity_resp = client.get(
        "/api/student/activity",
        headers={"Authorization": f"Bearer {student_1_token}"},
    )
    assert activity_resp.status_code == 200
    activities = activity_resp.json()
    assert len(activities) > 0
    assert any("Two Sum" in a["description"] for a in activities)
