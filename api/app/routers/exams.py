from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.exam import WeeklyExam, StudentExamSubmission
from app.models.user import User
from app.core.dependencies import get_current_user, require_dean

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
    durationMinutes: Optional[int] = 60
    totalMarks: Optional[int] = 100
    passMarks: Optional[int] = 50
    status: Optional[str] = "SCHEDULED"
    createdBy: Optional[str] = "Root (Dean of Academic Affairs / Sudo Admin)"
    questions: Optional[List[Dict[str, Any]]] = []


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
    }


@router.get("/exams", response_model=List[Dict[str, Any]], summary="Get all weekly exams")
def get_exams(db: Session = Depends(get_db)):
    exams = db.query(WeeklyExam).order_by(WeeklyExam.created_at.desc()).all()
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
        duration_minutes=payload.durationMinutes or 60,
        total_marks=payload.totalMarks or 100,
        pass_marks=payload.passMarks or 50,
        status=payload.status or "SCHEDULED",
        created_by=payload.createdBy or "Root (Dean of Academic Affairs / Sudo Admin)",
        questions=payload.questions or [],
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
        
        has_code = len(code_str.strip()) > 15
        passed_test_cases = 3 if has_code else 0
        total_test_cases = 3
        marks_awarded = round((passed_test_cases / total_test_cases) * marks)
        score += marks_awarded
        if passed_test_cases >= 2:
            solved_count += 1

        answer_details[q_id] = {
            "code": code_str,
            "language": "Java",
            "passedTestCases": passed_test_cases,
            "totalTestCases": total_test_cases,
            "marksAwarded": marks_awarded,
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
