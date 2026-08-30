# Project: GKCE Enterprise Monitoring & Dynamic Curriculum System

## Architecture
- **Frontend SPA**: React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons + Recharts + Monaco/Syntax Highlighting.
- **Backend REST API**: FastAPI + Pydantic v2 + SQLAlchemy + Neon PostgreSQL (`postgresql://...neondb...`) + Piston / Local Code Execution Sandbox.
- **State Management & Data Flow**: Dual-layer architecture (`AuthContext.tsx` + `src/lib/api.ts`). Optimistic local memory & `localStorage` persistence with asynchronous synchronization and silent JWT re-authentication against backend REST endpoints.
- **Role-Based Access Control (RBAC)**:
  - **Dean (Tier 1 Root)**: 8 Management Views (Overview, Monitor Teams, Student Directory, Progress Benchmarks, Analytics Charts, Weekly Exams, Institutional Reports, System Settings).
  - **Mentor (Tier 2 Faculty)**: 4 Views (Dashboard, Student Roster, Daily 5 Verification Matrix 20×5 with batch sign-offs, Exam Scorecards across cohorts).
  - **Student (Tier 3 Candidate)**: 6 Views (Dashboard, Forge IDE Practice Arena with real multi-language test runner, Progress Breakdown, Activity Logs & Heatmap, GitHub Link Updates, Live Weekly Exams taking flow with shuffled sets).

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | API Client & Auth Endpoints | Centralized API client in `src/lib/api.ts` with error handling | M1 | R1 |
| 2 | Silent Re-auth & Fallback | `syncFromBackend` & `restoreSession` offline fallback in `AuthContext.tsx` | M1 | R1 |
| 3 | Dynamic Pending Calculation | `Math.max(0, TOTAL_CURRICULUM_PROBLEMS - solved)` with no stale backend read | M1 | R1 |
| 4 | Dean Management Views | 8 full administrative views for institutional monitoring | M2 | R2 |
| 5 | Mentor Verification Matrix | Daily 5 (20×5) matrix with individual & batch sign-offs | M2 | R2 |
| 6 | Mentor Multi-Cohort Views | Single/multi cohort switching and exam scorecards | M2 | R2 |
| 7 | Student Forge IDE & Test Runner | Multi-language practice arena with test case validation | M2 | R2 |
| 8 | Student Exam Taking Flow | Shuffled anti-cheating paper sets & exam submission | M2 | R2 |
| 9 | 100 DSA Problems Bank | 100 placement problems across 11 DSA domains in `dsaCurriculum100.ts` | M3 | R3 |
| 10 | 1-Decimal Precision Metrics | Strict `.toFixed(1)` formatting across all score/rate metrics | M3 | R3 |
| 11 | Mock Exam ID Prefix Fix | Correct `prob-` prefix matching for `ROOT_OFFICIAL_20_QUESTIONS` | M3 | R3 |
| 12 | End-to-End Automated Testing | Full E2E test suite covering Tiers 1-4 with automated runner | M4 | Acceptance |
| 13 | Adversarial Coverage Hardening | Tier 5 white-box adversarial verification & stress testing | M4 | Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Database Sync & API Integrity | Verify & harden `src/lib/api.ts` endpoints, AuthContext fallbacks, silent re-auth, dynamic pending formula | none | DONE |
| M2 | Multi-Role Dashboard & View Flow | Verify Dean, Mentor, Student views, Forge IDE, Daily 5 Matrix, Exam taking flow | M1 | DONE |
| M3 | Dynamic Curriculum Consistency & Mock Fix | Verify 100 DSA problems, 11 domains, 1-decimal metrics, fix `mockExams.ts` prefix | none | DONE |
| M4 | E2E Testing & Adversarial Hardening | Execute comprehensive test suite (Tiers 1-4), verify 100% pass, perform Tier 5 hardening | M1, M2, M3 | DONE |

## Interface Contracts
### `src/lib/api.ts` ↔ `backend/app/routers/`
- `loginApi(email, password)`: `POST /auth/login` -> `{ access_token, token_type, role, user_id, team_id, name }`
- `getMeApi(signal?)`: `GET /auth/me` -> `{ user_id, email, name, role, team_id, student_id, mentor_id }`
- `getDeanStudentsAllApi()`: `GET /dean/students?page=1&limit=200` -> `{ students: StudentSchema[], total: number }`
- `getDeanTeamsApi()`: `GET /dean/teams` -> `TeamSchema[]`
- `createStudentApi(data)`: `POST /dean/students` -> `StudentSchema`
- `createTeamApi(data)`: `POST /dean/teams` -> `TeamSchema`
- `getVerificationsApi(teamId?)`: `GET /mentor/verifications` -> `VerificationRecord[]`
- `toggleMentorVerificationApi(studentId, problemId, verified)`: `POST /mentor/verify` -> `{ status, verified }`
- `batchVerifyMentorApi(verifications)`: `POST /mentor/batch-verify` -> `{ success, count }`
- `getWeeklyExamsApi()`: `GET /exams` -> `WeeklyExam[]`
- `createWeeklyExamApi(data)`: `POST /dean/exams` -> `WeeklyExam`
- `submitExamSolutionApi(examId, data)`: `POST /student/exams/${examId}/submit` -> `{ success, score }`
- `runCodeApi(data)`: `POST /code/run` -> `{ success, output, execution_time_ms, test_results }`

### Data Structures & Calculations
- `TOTAL_CURRICULUM_PROBLEMS` = 100
- `pending` = `Math.max(0, TOTAL_CURRICULUM_PROBLEMS - solved)`
- `progress` = `Math.min(100, Number(((solved / TOTAL_CURRICULUM_PROBLEMS) * 100).toFixed(1)))`
- All rate/percentage metrics retain 1-decimal precision (`.toFixed(1)`).

## Code Layout
- `src/components/`: Modular UI components organized by domain (`dean/`, `mentor/`, `student/`, `coding/`, `common/`).
- `src/pages/`: Role-specific view components (`dean/`, `mentor/`, `student/`).
- `src/context/`: Global application state and authentication (`AuthContext.tsx`).
- `src/lib/`: API client and external communication (`api.ts`).
- `src/data/`: Domain data (`dsaCurriculum100.ts`, `mockExams.ts`, `initialRoster.ts`).
- `src/utils/`: Computation utilities, code execution runners (`realCodeRunner.ts`, `hackerRankData.ts`).
- `tests/`: Automated unit, integration, and E2E test suites (`run_e2e_tests.cjs`, `tier1_...`, `tier2_...`, `tier3_...`, `tier4_...`, `adversarial_...`).
