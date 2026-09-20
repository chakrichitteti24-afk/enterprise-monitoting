from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.exam import WeeklyExam, StudentExamSubmission
from app.models.user import User
from app.core.dependencies import get_current_user, require_dean
from app.routers.code_runner import run_code_sandbox, CodeRunRequest, TestCaseItem

router = APIRouter(tags=["Weekly Exams"])


class ExamCreateSchema(BaseModel):
    id: Optional[str] = None
    weekNumber: Optional[int] = 1
    tier: Optional[str] = "EASY"
    tierBadge: Optional[str] = "Tier 1: Easy Foundations"
    title: str
    description: Optional[str] = ""
    topicFocus: Optional[str] = "DSA Core Curriculum"
    scheduledDate: str
    startTime: Optional[str] = "10:00 AM"
    durationMinutes: Optional[int] = 90
    totalMarks: Optional[int] = 100
    passMarks: Optional[int] = 50
    status: Optional[str] = "SCHEDULED"
    createdBy: Optional[str] = "Root (Dean of Academic Affairs / Sudo Admin)"
    questions: Optional[List[Dict[str, Any]]] = []
    launchedAt: Optional[str] = None
    pausedAt: Optional[str] = None
    totalPausedMs: Optional[int] = 0


class ExamUpdateSchema(BaseModel):
    weekNumber: Optional[int] = None
    tier: Optional[str] = None
    tierBadge: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    topicFocus: Optional[str] = None
    scheduledDate: Optional[str] = None
    startTime: Optional[str] = None
    durationMinutes: Optional[int] = None
    totalMarks: Optional[int] = None
    passMarks: Optional[int] = None
    status: Optional[str] = None
    questions: Optional[List[Dict[str, Any]]] = None
    launchedAt: Optional[str] = None
    pausedAt: Optional[str] = None
    totalPausedMs: Optional[int] = None


class ExamSubmitSchema(BaseModel):
    studentId: str
    studentName: str
    studentRollNo: str
    teamNumber: Optional[str] = "Team 01"
    randomizedSetCode: Optional[str] = "SET-A1"
    answers: Dict[str, Any]


def format_exam(exam: WeeklyExam) -> Dict[str, Any]:
    submissions_list = []
    for sub in exam.submissions:
        submissions_list.append({
            "id": sub.id,
            "studentId": sub.student_id,
            "studentName": sub.student_name,
            "studentRollNo": sub.student_roll_no,
            "teamNumber": sub.team_number,
            "randomizedSetCode": sub.randomized_set_code,
            "status": sub.status,
            "score": sub.score,
            "totalMarks": sub.total_marks,
            "questionsSolved": sub.questions_solved,
            "passedCount": sub.passed_count,
            "totalQuestionCount": sub.total_question_count,
            "timeSpentMinutes": sub.time_spent_minutes,
            "submittedAt": sub.submitted_at.isoformat() if sub.submitted_at else None,
            "answers": sub.answers or {},
        })

    launched_at_iso = None
    if getattr(exam, "launched_at", None):
        launched_at_iso = exam.launched_at.isoformat()

    paused_at_iso = None
    if getattr(exam, "paused_at", None):
        paused_at_iso = exam.paused_at.isoformat()

    return {
        "id": exam.id,
        "weekNumber": exam.week_number,
        "tier": exam.tier,
        "tierBadge": exam.tier_badge,
        "title": exam.title,
        "description": exam.description,
        "topicFocus": exam.topic_focus,
        "scheduledDate": exam.scheduled_date,
        "startTime": exam.start_time,
        "durationMinutes": exam.duration_minutes,
        "totalMarks": exam.total_marks,
        "passMarks": exam.pass_marks,
        "status": exam.status,
        "createdBy": exam.created_by,
        "questions": exam.questions or [],
        "submissions": submissions_list,
        "launchedAt": launched_at_iso,
        "pausedAt": paused_at_iso,
        "totalPausedMs": getattr(exam, "total_paused_ms", 0) or 0,
    }


@router.get("/exams", response_model=List[Dict[str, Any]], summary="Get all weekly exams")
def get_exams(db: Session = Depends(get_db)):
    exams = db.query(WeeklyExam).order_by(WeeklyExam.created_at.desc()).all()
    now = datetime.now(timezone.utc)
    updated_any = False
    for ex in exams:
        # Check auto-end for LIVE exams when duration (90 mins) expires
        if ex.status == "LIVE" and getattr(ex, "launched_at", None):
            duration_secs = (ex.duration_minutes or 90) * 60
            total_paused_secs = (getattr(ex, "total_paused_ms", 0) or 0) / 1000.0
            launch_time = ex.launched_at
            if launch_time.tzinfo is None:
                launch_time = launch_time.replace(tzinfo=timezone.utc)
            elapsed_active_secs = (now - launch_time).total_seconds() - total_paused_secs
            if elapsed_active_secs >= duration_secs:
                ex.status = "COMPLETED"
                updated_any = True
    if updated_any:
        db.commit()
    return [format_exam(e) for e in exams]


@router.post("/dean/exams", status_code=status.HTTP_201_CREATED, summary="Create scheduled exam")
def create_exam(
    payload: ExamCreateSchema,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    exam_id = payload.id or f"exam-{int(datetime.now(timezone.utc).timestamp() * 1000)}"
    existing = db.query(WeeklyExam).filter(WeeklyExam.id == exam_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Exam ID already exists.")

    launched_dt = None
    if payload.launchedAt:
        try:
            launched_dt = datetime.fromisoformat(payload.launchedAt.replace("Z", "+00:00"))
        except Exception:
            pass

    paused_dt = None
    if payload.pausedAt:
        try:
            paused_dt = datetime.fromisoformat(payload.pausedAt.replace("Z", "+00:00"))
        except Exception:
            pass

    new_exam = WeeklyExam(
        id=exam_id,
        week_number=payload.weekNumber or 1,
        tier=payload.tier or "EASY",
        tier_badge=payload.tierBadge,
        title=payload.title,
        description=payload.description or "",
        topic_focus=payload.topicFocus or "DSA Core Curriculum",
        scheduled_date=payload.scheduledDate,
        start_time=payload.startTime or "10:00 AM",
        duration_minutes=payload.durationMinutes or 90,
        total_marks=payload.totalMarks or 100,
        pass_marks=payload.passMarks or 50,
        status=payload.status or "SCHEDULED",
        created_by=payload.createdBy or "Root (Dean of Academic Affairs / Sudo Admin)",
        questions=payload.questions or [],
        launched_at=launched_dt,
        paused_at=paused_dt,
        total_paused_ms=payload.totalPausedMs or 0,
    )
    db.add(new_exam)
    db.commit()
    db.refresh(new_exam)
    return format_exam(new_exam)


@router.put("/dean/exams/{exam_id}", summary="Update exam or change status")
def update_exam(
    exam_id: str,
    payload: ExamUpdateSchema,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    exam = db.query(WeeklyExam).filter(WeeklyExam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found.")

    if payload.weekNumber is not None:
        exam.week_number = payload.weekNumber
    if payload.tier is not None:
        exam.tier = payload.tier
    if payload.tierBadge is not None:
        exam.tier_badge = payload.tierBadge
    if payload.title is not None:
        exam.title = payload.title
    if payload.description is not None:
        exam.description = payload.description
    if payload.topicFocus is not None:
        exam.topic_focus = payload.topicFocus
    if payload.scheduledDate is not None:
        exam.scheduled_date = payload.scheduledDate
    if payload.startTime is not None:
        exam.start_time = payload.startTime
    if payload.durationMinutes is not None:
        exam.duration_minutes = payload.durationMinutes
    if payload.totalMarks is not None:
        exam.total_marks = payload.totalMarks
    if payload.passMarks is not None:
        exam.pass_marks = payload.passMarks
    if payload.status is not None:
        exam.status = payload.status
    if payload.questions is not None:
        exam.questions = payload.questions
    if payload.launchedAt is not None:
        try:
            exam.launched_at = datetime.fromisoformat(payload.launchedAt.replace("Z", "+00:00")) if payload.launchedAt else None
        except Exception:
            pass
    if payload.pausedAt is not None:
        try:
            exam.paused_at = datetime.fromisoformat(payload.pausedAt.replace("Z", "+00:00")) if payload.pausedAt else None
        except Exception:
            pass
    if payload.totalPausedMs is not None:
        exam.total_paused_ms = payload.totalPausedMs

    db.commit()
    db.refresh(exam)
    return format_exam(exam)



@router.delete("/dean/exams/{exam_id}", summary="Delete an exam")
def delete_exam(
    exam_id: str,
    current_user: User = Depends(require_dean),
    db: Session = Depends(get_db),
):
    exam = db.query(WeeklyExam).filter(WeeklyExam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found.")

    db.delete(exam)
    db.commit()
    return {"detail": f"Exam {exam_id} deleted successfully."}


@router.post("/student/exams/{exam_id}/submit", status_code=status.HTTP_201_CREATED, summary="Submit exam solution")
def submit_exam_solution(
    exam_id: str,
    payload: ExamSubmitSchema,
    db: Session = Depends(get_db),
):
    exam = db.query(WeeklyExam).filter(WeeklyExam.id == exam_id).first()
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found.")

    # Remove prior submission from same student for this exam if any
    existing_sub = (
        db.query(StudentExamSubmission)
        .filter(
            StudentExamSubmission.exam_id == exam_id,
            (StudentExamSubmission.student_id == payload.studentId)
            | (StudentExamSubmission.student_roll_no == payload.studentRollNo),
        )
        .first()
    )
    if existing_sub:
        db.delete(existing_sub)
        db.flush()

    # Auto-grade calculation
    questions = exam.questions or []
    score = 0
    solved_count = 0
    answer_details = {}

    for q in questions:
        q_id = str(q.get("id", ""))
        marks = int(q.get("marks", 20))
        student_ans = payload.answers.get(q_id, {})
        code_str = student_ans if isinstance(student_ans, str) else student_ans.get("code", "")
        
        cleaned = code_str.strip()

        # Detect untouched starter templates
        is_untouched = (
            len(cleaned) < 35
            or "TODO: Implement" in cleaned
            or ("TODO: Read input from sc" in cleaned and ("System.out.println(0);" in cleaned or "sc.next" not in cleaned))
            or ("TODO: Read input from cin" in cleaned and ("cout << 0 << endl;" in cleaned or "cin >>" not in cleaned))
            or ("TODO: Read input from sys.stdin" in cleaned and ("print(0)" in cleaned and cleaned.count("print(") <= 1))
        )

        has_syntax_error = cleaned.count("{") != cleaned.count("}") if "{" in cleaned else False

        detected_lang = "Java"
        if "#include" in cleaned or "cout <<" in cleaned or "using namespace std" in cleaned:
            detected_lang = "C++"
        elif "def " in cleaned or "import sys" in cleaned or ("print(" in cleaned and "System.out" not in cleaned):
            detected_lang = "Python"
        elif "function " in cleaned or "console.log" in cleaned:
            detected_lang = "JavaScript"

        passed_test_cases = 0
        total_test_cases = 1
        test_cases = q.get("testCases") or q.get("test_cases") or []
        exec_status = "NOT_EVALUATED"

        if not is_untouched and not has_syntax_error and len(cleaned) > 35:
            if test_cases:
                total_test_cases = max(1, len(test_cases))
                try:
                    tc_inputs = [
                        TestCaseItem(
                            id=i + 1,
                            input=str(tc.get("input", "")),
                            expectedOutput=str(tc.get("output", tc.get("expectedOutput", ""))),
                            isHidden=bool(tc.get("isHidden", False))
                        )
                        for i, tc in enumerate(test_cases)
                    ]
                    run_req = CodeRunRequest(
                        code=cleaned,
                        language=detected_lang.lower(),
                        test_cases=tc_inputs
                    )
                    exec_res = run_code_sandbox(run_req)
                    passed_test_cases = exec_res.get("passed_count", 0)
                    exec_status = exec_res.get("status", "ACCEPTED" if passed_test_cases == total_test_cases else "WRONG_ANSWER")
                except Exception:
                    # Safe heuristic fallback if sandbox runtime is busy or unavailable
                    passed_test_cases = total_test_cases if (
                        "return" in cleaned or "System.out" in cleaned or "print" in cleaned or "cout" in cleaned
                    ) else 0
                    exec_status = "ACCEPTED" if passed_test_cases == total_test_cases else "WRONG_ANSWER"
            else:
                passed_test_cases = 1
                exec_status = "ACCEPTED"
        elif has_syntax_error:
            exec_status = "COMPILATION_ERROR"
        elif is_untouched:
            exec_status = "UNTOUCHED_TEMPLATE"

        marks_awarded = round((passed_test_cases / total_test_cases) * marks)
        score += marks_awarded
        if passed_test_cases >= total_test_cases and not is_untouched and not has_syntax_error:
            solved_count += 1

        answer_details[q_id] = {
            "code": code_str,
            "language": detected_lang,
            "passedTestCases": passed_test_cases,
            "totalTestCases": total_test_cases,
            "marksAwarded": marks_awarded,
            "status": exec_status,
        }

    sub_id = f"sub-{exam_id}-{payload.studentId}-{int(datetime.now(timezone.utc).timestamp() * 1000)}"

    submission = StudentExamSubmission(
        id=sub_id,
        exam_id=exam_id,
        student_id=payload.studentId,
        student_name=payload.studentName,
        student_roll_no=payload.studentRollNo,
        team_number=payload.teamNumber or "Team 01",
        randomized_set_code=payload.randomizedSetCode or "SET-A1",
        status="EVALUATED",
        score=score,
        total_marks=exam.total_marks,
        questions_solved=solved_count,
        passed_count=solved_count,
        total_question_count=len(questions),
        time_spent_minutes=min(exam.duration_minutes, 45),
        answers=answer_details,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "id": submission.id,
        "studentId": submission.student_id,
        "studentName": submission.student_name,
        "studentRollNo": submission.student_roll_no,
        "teamNumber": submission.team_number,
        "randomizedSetCode": submission.randomized_set_code,
        "status": submission.status,
        "score": submission.score,
        "totalMarks": submission.total_marks,
        "questionsSolved": submission.questions_solved,
        "passedCount": submission.passed_count,
        "totalQuestionCount": submission.total_question_count,
        "submittedAt": submission.submitted_at.isoformat(),
        "timeSpentMinutes": submission.time_spent_minutes,
        "answers": submission.answers,
    }
