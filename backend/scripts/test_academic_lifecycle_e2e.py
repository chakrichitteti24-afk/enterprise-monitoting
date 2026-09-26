import sys
import os
import time
import json
import requests

# Ensure UTF-8 output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.database.session import SessionLocal
from app.models.user import User, UserRole
from app.models.team import Team
from app.models.student import Student
from app.models.mentor import Mentor
from app.models.exam import WeeklyExam, StudentExamSubmission
from app.models.verification import StudentVerifiedProblem

client = TestClient(app)

DEAN_EMAIL = "root@gkce.edu.in"
DEAN_PASSWORD = "gkce@1234"
STUDENT_EMAIL = "ananthalakshmi23f81a0502@gkce.edu.in"
STUDENT_PASSWORD = "gkce@1234"

PASSED_COUNT = 0
FAILED_COUNT = 0

def check(assertion, message):
    global PASSED_COUNT, FAILED_COUNT
    if assertion:
        PASSED_COUNT += 1
        print(f"  ✓ {message}", flush=True)
    else:
        FAILED_COUNT += 1
        print(f"  ✗ FAILED: {message}", flush=True)
        assert False, message

def main():
    print("=" * 70)
    print("GKCE E2E SYSTEM INTEGRATION & LIFECYCLE TEST SUITE")
    print("=" * 70)

    # -------------------------------------------------------------
    # Step 1: Root / Dean Authentication
    # -------------------------------------------------------------
    print("\n[Phase 1] Root (Dean) & Student Authentication...")
    dean_login_resp = client.post("/api/auth/login", json={"email": DEAN_EMAIL, "password": DEAN_PASSWORD})
    check(dean_login_resp.status_code == 200, "Root login successful (HTTP 200)")
    dean_token = dean_login_resp.json()["access_token"]
    dean_headers = {"Authorization": f"Bearer {dean_token}"}
    check("access_token" in dean_login_resp.json(), "Root received signed JWT access token")
    check(dean_login_resp.json()["user"]["role"] == "DEAN", "Root user role confirmed as DEAN")

    student_login_resp = client.post("/api/auth/login", json={"email": STUDENT_EMAIL, "password": STUDENT_PASSWORD})
    check(student_login_resp.status_code == 200, "Student login successful (HTTP 200)")
    student_token = student_login_resp.json()["access_token"]
    student_headers = {"Authorization": f"Bearer {student_token}"}
    check(student_login_resp.json()["user"]["role"] == "STUDENT", "Student user role confirmed as STUDENT")

    # -------------------------------------------------------------
    # Step 2: Root Adds Student
    # -------------------------------------------------------------
    print("\n[Phase 2] Root Adds New Student...")
    test_roll = "24F81A0599"
    test_student_email = "test.e2e.student@gkce.edu.in"
    
    # Clean up prior test student if exists
    db = SessionLocal()
    prior_user = db.query(User).filter((User.email == test_student_email) | (User.name == "Test E2E Student")).first()
    if prior_user:
        prior_st = db.query(Student).filter(Student.user_id == prior_user.id).first()
        if prior_st:
            db.delete(prior_st)
        db.delete(prior_user)
        db.commit()
    db.close()

    add_student_payload = {
        "name": "Test E2E Student",
        "email": test_student_email,
        "roll_number": test_roll,
        "team_id": 3,  # Team 01
        "dsa_level": "INTERMEDIATE",
        "status": "ACTIVE",
        "password": "gkce@1234",
    }
    create_st_resp = client.post("/api/dean/students", headers=dean_headers, json=add_student_payload)
    check(create_st_resp.status_code == 201, f"Root created student (HTTP 201): {create_st_resp.status_code}")
    created_student = create_st_resp.json()
    created_student_id = created_student["id"]
    check(created_student["roll_number"] == test_roll, f"Student roll number matches: {test_roll}")
    check(created_student["name"] == "Test E2E Student", "Student name matches")

    # -------------------------------------------------------------
    # Step 3: Root Creates Mentor
    # -------------------------------------------------------------
    print("\n[Phase 3] Root Creates New Faculty Mentor...")
    test_mentor_email = "test.mentor.e2e@gkce.edu.in"

    # Clean up prior test mentor if exists
    db = SessionLocal()
    prior_m_user = db.query(User).filter(User.email == test_mentor_email).first()
    if prior_m_user:
        prior_m = db.query(Mentor).filter(Mentor.user_id == prior_m_user.id).first()
        if prior_m:
            db.delete(prior_m)
        db.delete(prior_m_user)
        db.commit()
    db.close()

    create_mentor_payload = {
        "name": "Dr. Test Mentor E2E",
        "email": test_mentor_email,
        "password": "Mentor@GKCE2026",
        "department": "Computer Science & Engineering",
        "phone": "+91 98480 99999",
        "experience_years": 10,
    }
    create_mentor_resp = client.post("/api/dean/mentors", headers=dean_headers, json=create_mentor_payload)
    check(create_mentor_resp.status_code == 201, "Root created faculty mentor (HTTP 201)")
    created_mentor = create_mentor_resp.json()
    created_mentor_id = created_mentor["id"]
    check(created_mentor["name"] == "Dr. Test Mentor E2E", "Mentor name matches")
    check(created_mentor["email"] == test_mentor_email, "Mentor email matches")

    # -------------------------------------------------------------
    # Step 4: Root Reassigns / Changes Mentor for a Team
    # -------------------------------------------------------------
    print("\n[Phase 4] Root Changes / Reassigns Mentor to Team...")
    team_detail_resp = client.get("/api/dean/teams/3", headers=dean_headers)
    check(team_detail_resp.status_code == 200, "Fetched Team 01 detail dossier")
    original_mentor_id = team_detail_resp.json().get("mentor_id")

    # Assign newly created mentor to Team 3 (Team 01)
    update_team_payload = {
        "name": "Algorithm Aces",
        "mentor_id": created_mentor_id,
    }
    update_team_resp = client.put("/api/dean/teams/3", headers=dean_headers, json=update_team_payload)
    check(update_team_resp.status_code == 200, "Root re-assigned mentor for Team 01")
    check(update_team_resp.json()["mentor_id"] == created_mentor_id, "Team 01 mentor_id points to new mentor")

    # Revert back to original mentor
    revert_team_payload = {
        "name": "Algorithm Aces",
        "mentor_id": original_mentor_id,
    }
    revert_resp = client.put("/api/dean/teams/3", headers=dean_headers, json=revert_team_payload)
    check(revert_resp.status_code == 200, "Team 01 reverted to original faculty mentor")

    # -------------------------------------------------------------
    # Step 5: Root Deletes Student
    # -------------------------------------------------------------
    print("\n[Phase 5] Root Deletes Student...")
    del_st_resp = client.delete(f"/api/dean/students/{created_student_id}", headers=dean_headers)
    check(del_st_resp.status_code in [200, 204], f"Root de-enrolled student (HTTP {del_st_resp.status_code})")

    # Verify student is gone
    get_st_resp = client.get(f"/api/dean/students/{created_student_id}", headers=dean_headers)
    check(get_st_resp.status_code == 404, "Student no longer exists in roster (HTTP 404 confirmed)")

    # -------------------------------------------------------------
    # Step 6: Root Selects Particular Questions and Creates Exam
    # -------------------------------------------------------------
    print("\n[Phase 6] Root Selects Particular Questions & Creates Exam...")
    test_exam_id = f"test-exam-e2e-{int(time.time())}"

    # Two specific questions chosen by Dean:
    # Q1: Two Sum / Subarray Sum with specific test cases
    # Q2: Reverse String / Palindrome with specific test cases
    particular_questions = [
        {
            "id": "q1-math-double",
            "questionNumber": 1,
            "title": "Double the Integer",
            "description": "Given integer N, output N * 2.",
            "topic": "Mathematics",
            "marks": 50,
            "testCases": [
                {"input": "5", "expectedOutput": "10", "isHidden": False},
                {"input": "12", "expectedOutput": "24", "isHidden": False},
                {"input": "0", "expectedOutput": "0", "isHidden": True},
            ],
        },
        {
            "id": "q2-string-length",
            "questionNumber": 2,
            "title": "String Character Count",
            "description": "Given a string S, return its character count.",
            "topic": "Strings",
            "marks": 50,
            "testCases": [
                {"input": "hello", "expectedOutput": "5", "isHidden": False},
                {"input": "GKCE", "expectedOutput": "4", "isHidden": False},
            ],
        },
    ]

    create_exam_payload = {
        "id": test_exam_id,
        "weekNumber": 2,
        "tier": "EASY",
        "tierBadge": "🟢 Tier 1: Easy Foundations",
        "title": "GKCE Official E2E Assessment",
        "description": "Comprehensive live assessment with selected particular questions.",
        "topicFocus": "Mathematics & Strings",
        "scheduledDate": "2026-09-26",
        "startTime": "10:00 AM",
        "durationMinutes": 90,
        "totalMarks": 100,
        "passMarks": 50,
        "status": "LIVE",  # Launched directly by Dean
        "questions": particular_questions,
    }

    create_exam_resp = client.post("/api/dean/exams", headers=dean_headers, json=create_exam_payload)
    check(create_exam_resp.status_code == 201, f"Root created and launched exam: {create_exam_resp.status_code}")
    exam_data = create_exam_resp.json()
    check(len(exam_data["questions"]) == 2, "Exam contains exactly the 2 selected particular questions")
    check(exam_data["status"] == "LIVE", "Exam status is LIVE")

    # -------------------------------------------------------------
    # Step 7: Compiler Sandbox Precision (Multi-Language Execution)
    # -------------------------------------------------------------
    print("\n[Phase 7] Compiler Sandbox High-Precision Execution...")

    # Python
    py_run_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": "def solve(n):\n    return int(n) * 2",
            "language": "python",
            "test_cases": [
                {"input": "5", "expectedOutput": "10"},
                {"input": "12", "expectedOutput": "24"},
            ],
        },
    )
    check(py_run_resp.status_code == 200, "Python execution responded HTTP 200")
    check(py_run_resp.json()["status"] == "ACCEPTED", f"Python result: {py_run_resp.json()['status']}")
    check(py_run_resp.json()["passed_count"] == 2, "Python passed 2/2 test cases")

    # JavaScript
    js_run_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": "function solve(n) { return Number(n) * 2; }",
            "language": "javascript",
            "test_cases": [
                {"input": "5", "expectedOutput": "10"},
                {"input": "12", "expectedOutput": "24"},
            ],
        },
    )
    check(js_run_resp.status_code == 200, "JavaScript execution responded HTTP 200")
    check(js_run_resp.json()["status"] == "ACCEPTED", f"JavaScript result: {js_run_resp.json()['status']}")

    # Java
    java_code = """
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        if (sc.hasNextInt()) {
            int n = sc.nextInt();
            System.out.println(n * 2);
        }
    }
}
"""
    java_run_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": java_code,
            "language": "java",
            "test_cases": [{"input": "5", "expectedOutput": "10"}],
        },
    )
    check(java_run_resp.status_code == 200, "Java execution responded HTTP 200")
    check(java_run_resp.json()["status"] == "ACCEPTED", f"Java result: {java_run_resp.json()['status']}")

    # C++
    cpp_code = """
#include <iostream>
using namespace std;
int main() {
    int n;
    if (cin >> n) {
        cout << (n * 2) << endl;
    }
    return 0;
}
"""
    cpp_run_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": cpp_code,
            "language": "cpp",
            "test_cases": [{"input": "5", "expectedOutput": "10"}],
        },
    )
    check(cpp_run_resp.status_code == 200, "C++ execution responded HTTP 200")
    check(cpp_run_resp.json()["status"] == "ACCEPTED", f"C++ result: {cpp_run_resp.json()['status']}")

    # Syntax Error & Wrong Answer Precision Checks
    wrong_run_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": "def solve(n):\n    return int(n) + 1",  # Wrong calculation
            "language": "python",
            "test_cases": [{"input": "5", "expectedOutput": "10"}],
        },
    )
    check(wrong_run_resp.json()["status"] == "WRONG_ANSWER", "Wrong calculation accurately evaluated as WRONG_ANSWER")

    syntax_err_resp = client.post(
        "/api/code/run",
        headers=student_headers,
        json={
            "code": "def solve(n) return n * 2",  # Missing colon
            "language": "python",
            "test_cases": [{"input": "5", "expectedOutput": "10"}],
        },
    )
    check(syntax_err_resp.json()["status"] == "COMPILATION_ERROR", "Syntax error accurately evaluated as COMPILATION_ERROR")

    # -------------------------------------------------------------
    # Step 8: Student Attempts and Submits Exam
    # -------------------------------------------------------------
    print("\n[Phase 8] Student Attempts & Submits Exam...")
    student_profile = student_login_resp.json()["user"]
    student_id = student_profile["student_id"]
    student_roll = student_profile["roll_number"]
    student_name = student_profile["name"]

    student_answers = {
        "q1-math-double": {
            "code": "def solve(n):\n    return int(n) * 2",
            "language": "python",
        },
        "q2-string-length": {
            "code": "def solve(s):\n    return len(s.strip())",
            "language": "python",
        },
    }

    submit_payload = {
        "studentId": str(student_id),
        "studentName": student_name,
        "studentRollNo": student_roll,
        "teamNumber": "Team 01",
        "randomizedSetCode": "SET-A1",
        "answers": student_answers,
    }

    submit_resp = client.post(
        f"/api/student/exams/{test_exam_id}/submit",
        headers=student_headers,
        json=submit_payload,
    )
    check(submit_resp.status_code == 201, f"Student submitted exam solution: {submit_resp.status_code}")
    submission_data = submit_resp.json()
    check(submission_data["status"] == "EVALUATED", f"Submission evaluated: {submission_data['status']}")
    check(submission_data["score"] == 100, f"Full marks awarded: {submission_data['score']}/100")
    check(submission_data["questionsSolved"] == 2, f"Both particular questions solved: {submission_data['questionsSolved']}/2")

    # -------------------------------------------------------------
    # Step 9: Verify RBAC Security Boundaries
    # -------------------------------------------------------------
    print("\n[Phase 9] Validating RBAC Security Boundaries...")

    # 1. Anonymous user cannot run sandbox code
    anon_code_resp = client.post("/api/code/run", json={"code": "print(1)", "language": "python", "test_cases": []})
    check(anon_code_resp.status_code in [401, 403], f"Anonymous code execution blocked: HTTP {anon_code_resp.status_code}")

    # 2. Student cannot submit exam for another student ID
    spoofed_submit_payload = {
        "studentId": "99999",
        "studentName": "Attacker",
        "studentRollNo": "23F81A0599",
        "answers": {},
    }
    spoof_resp = client.post(
        f"/api/student/exams/{test_exam_id}/submit",
        headers=student_headers,
        json=spoofed_submit_payload,
    )
    check(spoof_resp.status_code == 403, f"Cross-student exam spoofing blocked: HTTP {spoof_resp.status_code}")

    # 3. Mentor cannot verify student from another team
    mentor_login_resp = client.post("/api/auth/login", json={"email": "ksgayathri@gkce.edu.in", "password": "Mentor@GKCE2026"})
    check(mentor_login_resp.status_code == 200, "Mentor logged in")
    mentor_token = mentor_login_resp.json()["access_token"]
    mentor_headers = {"Authorization": f"Bearer {mentor_token}"}

    # Habeeba belongs to Team 2 (id 4), whereas ksgayathri mentors Team 1 (id 3)
    unauthorized_verify_payload = {
        "student_identifier": "23F81A0510",  # Habeeba (Team 2)
        "problem_id": "prob-1",
        "verified": True,
    }
    unauthorized_verify_resp = client.post("/api/mentor/verify", headers=mentor_headers, json=unauthorized_verify_payload)
    check(unauthorized_verify_resp.status_code == 403, f"Cross-team mentor verification blocked: HTTP {unauthorized_verify_resp.status_code}")

    # -------------------------------------------------------------
    # Step 10: Clean up Test Exam and Mentor
    # -------------------------------------------------------------
    print("\n[Phase 10] Cleaning up temporary test artifacts...")
    del_exam_resp = client.delete(f"/api/dean/exams/{test_exam_id}", headers=dean_headers)
    check(del_exam_resp.status_code == 200, "Test exam cleanly deleted")

    del_mentor_resp = client.delete(f"/api/dean/mentors/{created_mentor_id}", headers=dean_headers)
    check(del_mentor_resp.status_code == 200, "Test mentor cleanly removed")

    print("\n" + "=" * 70)
    print(f"E2E TEST SUMMARY: {PASSED_COUNT} PASSED, {FAILED_COUNT} FAILED")
    print("=" * 70)
    if FAILED_COUNT == 0:
        print("✨ ALL END-TO-END SCENARIOS SUCCEEDED WITH 100% PASS RATE!")

if __name__ == "__main__":
    main()
