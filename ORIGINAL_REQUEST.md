# Original User Request

## 2026-08-29T15:42:46Z

# Teamwork Project Prompt — Draft

> Status: Ready for launch — awaiting user approval
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full teamwork multi-agent system

Fix the "pending problems" calculation bug where stale backend data (e.g., pending: 24) overrides the accurate dynamic curriculum calculation (TOTAL_CURRICULUM_PROBLEMS - solved).

Working directory: ~/teamwork_projects/fix_pending_calc
Integrity mode: demo

## Requirements

### R1. Dynamic Pending Calculation
Modify the `backendStudentToFrontend` mapper in `src/context/AuthContext.tsx` to strictly use `Math.max(0, TOTAL_CURRICULUM_PROBLEMS - solved)` for the `pending` field, completely ignoring any stale `prog.pending` values returned from the backend.

## Acceptance Criteria

### Verification
- [ ] Inspecting `backendStudentToFrontend` confirms `prog.pending` is no longer used for the `pending` field calculation.
- [ ] The app builds successfully without TypeScript errors.

## 2026-08-30T01:35:11Z

# Teamwork Project Prompt — Draft

> Status: Launched
> Goal: Craft prompt → get user approval → delegate to teamwork_preview
> Requested team: Full teamwork multi-agent system

Perform a comprehensive database sync audit, multi-role dashboard testing, and end-to-end integration verification across Dean, Mentor, and Student workflows.

Working directory: d:/gkce
Integrity mode: development

## Requirements

### R1. Database Synchronization & API Integrity Audit
- Audit all API endpoints in `src/lib/api.ts` for student creation, team creation, problem verification, weekly exam creation/submission, and student details.
- Verify `syncFromBackend` and silent re-authentication mechanisms in `src/context/AuthContext.tsx` for clean fallback when database is disconnected and full hydration when database is live.

### R2. Multi-Role Dashboard & Feature Flow Testing
- Test and verify Dean views: Overview, Monitor Teams, Student Directory, Progress Benchmarks, Visual Analytics Charts, Weekly Exams Management, Institutional Reports, and System Settings.
- Test and verify Mentor views: Mentor Dashboard, Student Roster, Daily 5 Verification Matrix with batch sign-offs, and Exam Scorecards across single and multiple assigned cohorts.
- Test and verify Student views: Student Dashboard, Forge IDE Practice Arena with real test runner, Progress Breakdown, Activity Logs & Heatmap, GitHub Link Updates, and Live Weekly Exams taking flow.

### R3. Dynamic Curriculum Consistency
- Ensure all 100 placement problems across 11 DSA domains are accurately mapped, all metrics retain 1-decimal precision without rounding loss, and zero mock artifacts or fake calculations remain.

## Acceptance Criteria

### Automated Verification
- [ ] `npm run build` (`tsc -b && vite build`) passes with 0 errors.
- [ ] All API handlers gracefully handle both successful network responses and offline/error fallbacks without crashing the React UI.
- [ ] Authentication, role switching, problem solving, team creation, student enrollment, and exam submission flows tested and verified.

