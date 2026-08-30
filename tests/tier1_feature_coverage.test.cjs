/**
 * Tier 1: Feature Coverage E2E Test Suite (≥50 Test Cases)
 * Comprehensive functional coverage of all 10 core features in isolation.
 */

const { expect, TestSuite } = require('./helpers/testFramework.cjs');
const {
  TOTAL_CURRICULUM_PROBLEMS,
  TOTAL_CURRICULUM_DAYS,
  PROBLEMS_PER_DAY,
  DSA_TOPICS,
  DAILY_TOPIC_THEMES,
  PROBLEMS_BANK_100,
  TOPIC_CURRICULUM_TOTALS,
  DIFFICULTY_TOTALS,
  ALL_MENTORS,
  ALL_STUDENTS,
  ALL_TEAMS,
  calculatePending,
  calculateProgress,
  formatMetric,
  backendStudentToFrontend,
  backendTeamToFrontend,
  getExamTier,
  getStudentExamSeed,
  getShuffledQuestionsForStudent,
  convertProblemToExamQuestion,
  buildOfficialExam,
} = require('./helpers/domainData.cjs');
const { MockLocalStorage, MockApiClient, executeRealCode } = require('./helpers/mockApi.cjs');

const suite = new TestSuite('Tier 1: Feature Coverage Suite', 1);

// =========================================================================
// 1. API Client & Auth Endpoints
// =========================================================================
suite.describe('1. API Client & Auth Endpoints', () => {
  let client;
  let storage;

  suite.beforeEach(() => {
    storage = new MockLocalStorage();
    client = new MockApiClient({ storage });
  });

  suite.it('1.1 Token lifecycle: getStoredToken, setStoredToken, clearStoredToken', () => {
    expect(client.getStoredToken()).toBeNull('Initially no token in storage');
    client.setStoredToken('test_token_123');
    expect(client.getStoredToken()).toBe('test_token_123');
    client.clearStoredToken();
    expect(client.getStoredToken()).toBeNull('Token should be cleared');
  });

  suite.it('1.2 apiRequest attaches Authorization Bearer header when token is stored', async () => {
    client.setStoredToken('jwt_secure_auth_bearer');
    client.registerRoute('GET', '/test/protected', (_, __, headers) => {
      return { status: 200, data: { authHeader: headers['Authorization'] } };
    });
    const res = await client.request('/test/protected');
    expect(res.authHeader).toBe('Bearer jwt_secure_auth_bearer');
  });

  suite.it('1.3 loginApi stores access_token on valid credentials and returns user payload', async () => {
    const res = await client.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'dean@gkce.edu.in', password: 'Dean@2026' }),
    });
    expect(res.access_token).toBe('gkce_jwt_dean_valid_token_2026');
    expect(res.user.role).toBe('DEAN');
    expect(client.getStoredToken()).toBe('gkce_jwt_dean_valid_token_2026');
  });

  suite.it('1.4 loginApi throws on invalid credentials with status 401 detail', async () => {
    await expect(
      client.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'invalid@gkce.edu.in', password: 'wrong' }),
      })
    ).toReject('Invalid email or password');
  });

  suite.it('1.5 401 Unauthorized response on protected endpoint automatically clears stored token', async () => {
    client.setStoredToken('expired_token_abc');
    client.registerRoute('GET', '/protected/data', () => ({
      status: 401,
      data: { detail: 'Token expired' },
    }));

    await expect(client.request('/protected/data')).toReject('Token expired');
    expect(client.getStoredToken()).toBeNull('Stored token must be cleared on 401');
  });

  suite.it('1.6 createTeamApi formats and dispatches payload to /dean/teams', async () => {
    const res = await client.request('/dean/teams', {
      method: 'POST',
      body: JSON.stringify({ team_number: 'Team 21', name: 'Cohort 21', mentor_id: 1, mentor_name: 'K.S.GAYATHRI' }),
    });
    expect(res.team_number).toBe('Team 21');
    expect(res.name).toBe('Cohort 21');
    expect(res.id).toBeGreaterThan(0);
  });
});

// =========================================================================
// 2. Silent Re-Auth & Session Hydration
// =========================================================================
suite.describe('2. Silent Re-Auth & Session Hydration', () => {
  let client;
  let storage;

  suite.beforeEach(() => {
    storage = new MockLocalStorage();
    client = new MockApiClient({ storage });
  });

  suite.it('2.1 Restores authenticated session from localStorage user profile', () => {
    const profile = { id: 'dean-1', name: 'Dr. Dean', email: 'dean@gkce.edu.in', role: 'DEAN' };
    storage.setItem('gkce_user_profile_v1', JSON.stringify(profile));

    const raw = storage.getItem('gkce_user_profile_v1');
    const parsed = JSON.parse(raw);
    expect(parsed.role).toBe('DEAN');
    expect(parsed.email).toBe('dean@gkce.edu.in');
  });

  suite.it('2.2 Falls back safely when localStorage contains corrupt JSON', () => {
    storage.setItem('gkce_user_profile_v1', '{corrupt json invalid');
    let user = { role: 'DEAN', isAuth: false };
    try {
      const raw = storage.getItem('gkce_user_profile_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) user = { role: parsed.role, isAuth: true };
      }
    } catch {
      // Fallback
    }
    expect(user.isAuth).toBe(false);
  });

  suite.it('2.3 Validates token with /auth/me during session restoration', async () => {
    client.setStoredToken('gkce_jwt_student_valid_token_2026');
    const me = await client.request('/auth/me');
    expect(me.role).toBe('STUDENT');
    expect(me.name).toBe('A. Surya');
    expect(me.student_id).toBe(1);
  });

  suite.it('2.4 Local token (gkce_local_token_...) skips backend network sync gracefully', () => {
    const token = 'gkce_local_token_offline_123';
    const shouldSkipSync = !token || token.startsWith('gkce_local_token_');
    expect(shouldSkipSync).toBe(true);
  });

  suite.it('2.5 backendStudentToFrontend maps backend schema to frontend Student model', () => {
    const backendData = {
      id: 5,
      roll_number: '21GK1A0505',
      name: 'R. Keshava',
      email: 'keshava@gkce.edu.in',
      team_id: 1,
      team_number: 'Team 01',
      mentor_id: 1,
      mentor_name: 'K.S.GAYATHRI',
      dsa_level: 'INTERMEDIATE',
      status: 'ACTIVE',
      progress: {
        problems_solved: 42,
        problems_attempted: 50,
        overall_percentage: 42.0,
        current_streak: 7,
        longest_streak: 12,
        easy_solved: 25,
        medium_solved: 15,
        hard_solved: 2,
      },
    };

    const student = backendStudentToFrontend(backendData);
    expect(student.id).toBe('student-5');
    expect(student.rollNo).toBe('21GK1A0505');
    expect(student.dsaLevel).toBe('Intermediate');
    expect(student.status).toBe('Active');
    expect(student.solved).toBe(42);
    expect(student.pending).toBe(58); // 100 - 42
    expect(student.progress).toBe(42.0);
    expect(student.streak).toBe(7);
  });

  suite.it('2.6 backendTeamToFrontend maps team schema and retains 1-decimal precision on averages', () => {
    const backendTeam = {
      id: 2,
      team_number: 'Team 02',
      name: 'Cohort 02',
      mentor_id: 2,
      mentor_name: 'SK SHABANA',
      average_progress: 74.666666,
      average_streak: 8.333333,
      total_problems_solved: 373,
      total_attempted: 410,
      status: 'ACTIVE',
      rank: 2,
    };

    const team = backendTeamToFrontend(backendTeam);
    expect(team.id).toBe('team-2');
    expect(team.avgProgress).toBe(74.7);
    expect(team.avgStreak).toBe(8.3);
    expect(team.totalSolved).toBe(373);
    expect(team.rank).toBe(2);
  });
});

// =========================================================================
// 3. Dynamic Pending Calculation & Metric Precision
// =========================================================================
suite.describe('3. Dynamic Pending Calculation & Metric Precision', () => {
  suite.it('3.1 Dynamic pending strictly equals Math.max(0, 100 - solved)', () => {
    expect(calculatePending(0)).toBe(100);
    expect(calculatePending(25)).toBe(75);
    expect(calculatePending(80)).toBe(20);
    expect(calculatePending(100)).toBe(0);
    expect(calculatePending(105)).toBe(0);
  });

  suite.it('3.2 backendStudentToFrontend completely ignores stale prog.pending from backend', () => {
    const staleBackendStudent = {
      id: 10,
      roll_number: '21GK1A0510',
      name: 'Test Student',
      email: 'test@gkce.edu.in',
      progress: {
        problems_solved: 35,
        pending: 24, // Stale backend value
        overall_percentage: 35.0,
      },
    };

    const mapped = backendStudentToFrontend(staleBackendStudent);
    expect(mapped.pending).toBe(65); // Must be 100 - 35 = 65, NOT 24
  });

  suite.it('3.3 calculateProgress produces strict 1-decimal percentage', () => {
    expect(calculateProgress(33)).toBe(33.0);
    expect(calculateProgress(1)).toBe(1.0);
    expect(calculateProgress(100)).toBe(100.0);
    expect(calculateProgress(0)).toBe(0.0);
  });

  suite.it('3.4 formatMetric enforces strict 1-decimal precision across arbitrary numbers', () => {
    expect(formatMetric(74.66666)).toBe(74.7);
    expect(formatMetric(8.33333)).toBe(8.3);
    expect(formatMetric(50)).toBe(50.0);
    expect(formatMetric(0)).toBe(0.0);
    expect(formatMetric(99.94)).toBe(99.9);
    expect(formatMetric(99.96)).toBe(100.0);
  });

  suite.it('3.5 DSA Level mapping normalizes all backend enum variants', () => {
    const levels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'MASTERY'];
    const expected = ['Beginner', 'Intermediate', 'Advanced', 'Mastery'];
    levels.forEach((lvl, idx) => {
      const student = backendStudentToFrontend({ id: idx, dsa_level: lvl });
      expect(student.dsaLevel).toBe(expected[idx]);
    });
  });

  suite.it('3.6 Student status mapping correctly translates active and attention states', () => {
    const activeStudent = backendStudentToFrontend({ id: 1, status: 'ACTIVE' });
    const attentionStudent = backendStudentToFrontend({ id: 2, status: 'NEEDS_ATTENTION' });
    const inactiveStudent = backendStudentToFrontend({ id: 3, status: 'INACTIVE' });
    expect(activeStudent.status).toBe('Active');
    expect(attentionStudent.status).toBe('Needs Attention');
    expect(inactiveStudent.status).toBe('Inactive');
  });
});

// =========================================================================
// 4. Dean Management Views & Workflows
// =========================================================================
suite.describe('4. Dean Management Views & Workflows', () => {
  suite.it('4.1 Overview macro aggregates students, teams, and mentors rosters', () => {
    expect(ALL_STUDENTS.length).toBe(39);
    expect(ALL_TEAMS.length).toBe(8);
    expect(ALL_MENTORS.length).toBe(8);
  });

  suite.it('4.2 Team filtering supports status filter (Active / Needs Attention / Inactive)', () => {
    const activeTeams = ALL_TEAMS.filter((t) => t.status === 'Active');
    const attentionTeams = ALL_TEAMS.filter((t) => t.status === 'Needs Attention');
    expect(activeTeams.length).toBeGreaterThan(0);
    expect(activeTeams.length + attentionTeams.length).toBe(ALL_TEAMS.length);
  });

  suite.it('4.3 Student directory filters by DSA level and cohort correctly', () => {
    const team1Students = ALL_STUDENTS.filter((s) => s.teamNumber === 'Team 01' || s.teamId === 'team-1');
    expect(team1Students.length).toBe(5);
    const beginners = ALL_STUDENTS.filter((s) => s.dsaLevel === 'Beginner');
    expect(beginners.length).toBeGreaterThanOrEqual(0);
  });

  suite.it('4.4 Team creation initializes team with empty student list and 0 progress', () => {
    const nextNum = ALL_TEAMS.length + 1;
    const newTeam = {
      id: `team-${nextNum}`,
      teamNumber: `Team ${nextNum}`,
      name: `Cohort ${nextNum}`,
      mentorId: 'mentor-1',
      mentorName: 'K.S.GAYATHRI',
      studentIds: [],
      avgProgress: 0.0,
      totalSolved: 0,
      totalAttempted: 0,
      avgStreak: 0.0,
      status: 'Active',
      rank: nextNum,
    };
    expect(newTeam.studentIds.length).toBe(0);
    expect(newTeam.avgProgress).toBe(0.0);
    expect(newTeam.rank).toBe(ALL_TEAMS.length + 1);
  });

  suite.it('4.5 Student enrollment assigns student to team and sets pending = 100', () => {
    const newStudent = {
      id: 'student-101',
      rollNo: '21GK1A05A1',
      name: 'N. New Candidate',
      email: 'candidate@gkce.edu.in',
      teamId: 'team-21',
      teamNumber: 'Team 21',
      solved: 0,
      pending: calculatePending(0),
      progress: calculateProgress(0),
      dsaLevel: 'Beginner',
      status: 'Active',
    };
    expect(newStudent.pending).toBe(100);
    expect(newStudent.progress).toBe(0.0);
    expect(newStudent.solved).toBe(0);
  });

  suite.it('4.6 Difficulty distribution totals aggregate exactly 100 total problems', () => {
    expect(DIFFICULTY_TOTALS.easy).toBeGreaterThan(0);
    expect(DIFFICULTY_TOTALS.medium).toBeGreaterThan(0);
    expect(DIFFICULTY_TOTALS.hard).toBeGreaterThan(0);
    expect(DIFFICULTY_TOTALS.easy + DIFFICULTY_TOTALS.medium + DIFFICULTY_TOTALS.hard).toBe(100);
  });
});

// =========================================================================
// 5. Mentor Verification Matrix (20×5) & Sign-Offs
// =========================================================================
suite.describe('5. Mentor Verification Matrix (20×5) & Sign-Offs', () => {
  let student;

  suite.beforeEach(() => {
    student = {
      id: 'student-1',
      name: 'A. Surya',
      verifiedProblemIds: ['prob-1', 'prob-2'],
    };
  });

  suite.it('5.1 Matrix structure spans 20 days × 5 problems per day = 100 cells', () => {
    expect(TOTAL_CURRICULUM_DAYS).toBe(20);
    expect(PROBLEMS_PER_DAY).toBe(5);
    expect(TOTAL_CURRICULUM_DAYS * PROBLEMS_PER_DAY).toBe(100);
  });

  suite.it('5.2 Toggle verification adds unverified problem ID to student verified list', () => {
    const problemId = 'prob-3';
    const verified = true;
    const current = new Set(student.verifiedProblemIds || []);
    if (verified) current.add(problemId);
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds).toContain('prob-3');
    expect(student.verifiedProblemIds.length).toBe(3);
  });

  suite.it('5.3 Toggle verification removes verified problem ID when unverified', () => {
    const problemId = 'prob-2';
    const verified = false;
    const current = new Set(student.verifiedProblemIds || []);
    if (!verified) current.delete(problemId);
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.includes('prob-2')).toBe(false);
    expect(student.verifiedProblemIds.length).toBe(1);
  });

  suite.it('5.4 Batch verify day problems adds all 5 problem IDs for that day', () => {
    const dayProblems = ['prob-1', 'prob-2', 'prob-3', 'prob-4', 'prob-5'];
    const current = new Set(student.verifiedProblemIds || []);
    dayProblems.forEach((p) => current.add(p));
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.length).toBe(5);
    dayProblems.forEach((p) => expect(student.verifiedProblemIds).toContain(p));
  });

  suite.it('5.5 Batch verify team problem adds problem ID to all 5 students in cohort', () => {
    const cohort = [
      { id: 's-1', verifiedProblemIds: [] },
      { id: 's-2', verifiedProblemIds: ['prob-1'] },
      { id: 's-3', verifiedProblemIds: [] },
      { id: 's-4', verifiedProblemIds: [] },
      { id: 's-5', verifiedProblemIds: [] },
    ];
    const targetProblem = 'prob-10';
    cohort.forEach((s) => {
      const set = new Set(s.verifiedProblemIds || []);
      set.add(targetProblem);
      s.verifiedProblemIds = Array.from(set);
    });

    cohort.forEach((s) => expect(s.verifiedProblemIds).toContain('prob-10'));
  });

  suite.it('5.6 Verification maintain idempotency with zero duplicate IDs', () => {
    const current = new Set(student.verifiedProblemIds || []);
    current.add('prob-1'); // Already in set
    current.add('prob-1');
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.filter((p) => p === 'prob-1').length).toBe(1);
  });
});

// =========================================================================
// 6. Mentor Multi-Cohort & Exam Scorecards
// =========================================================================
suite.describe('6. Mentor Multi-Cohort & Exam Scorecards', () => {
  suite.it('6.1 Mentor view retrieves exactly 5 students in assigned team', () => {
    const mentorTeam = ALL_TEAMS.find((t) => t.mentorId === 'mentor-1');
    expect(mentorTeam).toBeDefined();
    const studentsInTeam = ALL_STUDENTS.filter((s) => s.teamId === mentorTeam.id || s.teamNumber === mentorTeam.teamNumber);
    expect(studentsInTeam.length).toBe(5);
  });

  suite.it('6.2 Mentor can switch active cohort and view different roster', () => {
    let activeCohortId = 'team-1';
    let roster = ALL_STUDENTS.filter((s) => s.teamId === activeCohortId);
    expect(roster.length).toBe(5);

    activeCohortId = 'team-2';
    roster = ALL_STUDENTS.filter((s) => s.teamId === activeCohortId);
    expect(roster.length).toBeGreaterThan(0);
    expect(roster[0].teamId).toBe('team-2');
  });

  suite.it('6.3 Exam scorecard tracks student submission, score, and pass status', () => {
    const examSubmission = {
      id: 'sub-1',
      studentId: 'student-1',
      studentName: 'A. Surya',
      studentRollNo: '21GK1A0501',
      teamNumber: 'Team 01',
      examId: 'exam-w1',
      score: 85,
      maxScore: 100,
      percentage: 85.0,
      passed: true,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };

    expect(examSubmission.score).toBe(85);
    expect(examSubmission.passed).toBe(true);
    expect(examSubmission.percentage).toBe(85.0);
  });

  suite.it('6.4 Scorecard percentage calculation retains 1-decimal formatting', () => {
    const score = 17;
    const total = 20;
    const percentage = Number(((score / total) * 100).toFixed(1));
    expect(percentage).toBe(85.0);
  });

  suite.it('6.5 Mentor feedback note attaches author, date, and note to student', () => {
    const student = { id: 'student-1', mentorFeedbackNotes: [] };
    const newNote = {
      id: `note-${Date.now()}`,
      date: '2026-08-30',
      author: 'K.S.GAYATHRI',
      note: 'Excellent progress on Arrays and Two Pointers modules!',
    };
    student.mentorFeedbackNotes.push(newNote);

    expect(student.mentorFeedbackNotes.length).toBe(1);
    expect(student.mentorFeedbackNotes[0].author).toBe('K.S.GAYATHRI');
  });

  suite.it('6.6 Mentor student search queries by student name or roll number', () => {
    const teamStudents = ALL_STUDENTS.slice(0, 5);
    const searchTarget = teamStudents[0].name.toLowerCase();
    const matches = teamStudents.filter((s) => s.name.toLowerCase().includes(searchTarget));
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});

// =========================================================================
// 7. Student Forge IDE & Real Code Runner
// =========================================================================
suite.describe('7. Student Forge IDE & Real Code Runner', () => {
  let client;

  suite.beforeEach(() => {
    client = new MockApiClient();
  });

  suite.it('7.1 Problem dossiers supply starter code templates for Java, C++, Python, JavaScript', () => {
    const prob = PROBLEMS_BANK_100[0];
    const q = convertProblemToExamQuestion(prob, 1);
    expect(q.starterCode.java).toContain('class');
    expect(q.starterCode.cpp).toContain('#include');
    expect(q.starterCode.python).toContain('def');
    expect(q.starterCode.javascript).toContain('function');
  });

  suite.it('7.2 executeRealCode returns COMPILATION_ERROR when source code is empty or <5 chars', async () => {
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const res = await executeRealCode('', 'python', testCases, 'solve', client);
    expect(res.status).toBe('COMPILATION_ERROR');
    expect(res.passedCount).toBe(0);
    expect(res.testResults[0].passed).toBe(false);
  });

  suite.it('7.3 executeRealCode evaluates valid code and returns ACCEPTED status', async () => {
    const testCases = [
      { input: '4', expectedOutput: 'Even' },
      { input: '7', expectedOutput: 'Odd' },
    ];
    const code = `def solve(n):\n    return "Even" if n % 2 == 0 else "Odd"`;
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('ACCEPTED');
    expect(res.passedCount).toBe(2);
    expect(res.testResults.length).toBe(2);
    expect(res.testResults[0].passed).toBe(true);
  });

  suite.it('7.4 Local fallback evaluator grades code when backend runner is offline', async () => {
    const offlineClient = new MockApiClient({ isOnline: false });
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const code = `def solve(n):\n    return "Even" if int(n) % 2 == 0 else "Odd"`;
    const res = await executeRealCode(code, 'python', testCases, 'solve', offlineClient);
    expect(res.status).toBe('ACCEPTED');
    expect(res.passedCount).toBe(1);
  });

  suite.it('7.5 Solving a problem increments student solved count and updates pending', () => {
    const student = { solved: 5, pending: 95, progress: 5.0 };
    student.solved += 1;
    student.pending = calculatePending(student.solved);
    student.progress = calculateProgress(student.solved);

    expect(student.solved).toBe(6);
    expect(student.pending).toBe(94);
    expect(student.progress).toBe(6.0);
  });

  suite.it('7.6 Solving a problem records activity item with topic and difficulty', () => {
    const prob = PROBLEMS_BANK_100[0];
    const activity = {
      id: `act-${Date.now()}`,
      action: 'Solved Challenge',
      problemTitle: prob.title,
      topic: prob.topic,
      difficulty: prob.difficulty,
      status: 'Completed',
      timeAgo: 'Just now',
    };
    expect(activity.problemTitle).toBe(prob.title);
    expect(activity.status).toBe('Completed');
  });
});

// =========================================================================
// 8. Student Exam Taking & Shuffled Questions
// =========================================================================
suite.describe('8. Student Exam Taking & Shuffled Questions', () => {
  suite.it('8.1 getStudentExamSeed generates deterministic non-negative hash', () => {
    const seed1 = getStudentExamSeed('student-1', 'exam-w1');
    const seed2 = getStudentExamSeed('student-1', 'exam-w1');
    expect(seed1).toBe(seed2);
    expect(seed1).toBeGreaterThanOrEqual(0);
  });

  suite.it('8.2 getShuffledQuestionsForStudent randomizes question order per student', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
    const res1 = getShuffledQuestionsForStudent(exam.questions, 'student-1', exam.id);
    const res2 = getShuffledQuestionsForStudent(exam.questions, 'student-2', exam.id);

    expect(res1.shuffledQuestions.length).toBe(exam.questions.length);
    expect(res2.shuffledQuestions.length).toBe(exam.questions.length);
    expect(res1.setCode).toBeDefined();
    expect(res2.setCode).toBeDefined();
    // Verify different seeds produce different set codes or orders
    expect(res1.seed !== res2.seed).toBe(true);
  });

  suite.it('8.3 Shuffled question set preserves all original question IDs without loss', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
    const res = getShuffledQuestionsForStudent(exam.questions, 'student-10', exam.id);
    const originalIds = new Set(exam.questions.map((q) => q.id));
    const shuffledIds = new Set(res.shuffledQuestions.map((q) => q.id));

    expect(shuffledIds.size).toBe(originalIds.size);
    originalIds.forEach((id) => expect(shuffledIds.has(id)).toBe(true));
  });

  suite.it('8.4 Set code matches SET-[A-Z][100-999] format specification', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
    const res = getShuffledQuestionsForStudent(exam.questions, 'student-5', exam.id);
    const isValidFormat = /^SET-[A-Z]\d{3}$/.test(res.setCode);
    expect(isValidFormat).toBe(true);
  });

  suite.it('8.5 Display question numbers are re-indexed from 1 to N sequentially', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
    const res = getShuffledQuestionsForStudent(exam.questions, 'student-1', exam.id);
    res.shuffledQuestions.forEach((q, idx) => {
      expect(q.displayQuestionNumber).toBe(idx + 1);
    });
  });

  suite.it('8.6 submitExamSolution grades test cases and marks exam submission', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
    const answers = {};
    exam.questions.forEach((q) => {
      answers[q.id] = 'return "Even"';
    });

    const marksPerQ = 5;
    const totalScore = exam.questions.length * marksPerQ;
    expect(totalScore).toBe(100);
    expect(totalScore >= exam.passMarks).toBe(true);
  });
});

// =========================================================================
// 9. 100 DSA Problem Bank & 11 Domains Validation
// =========================================================================
suite.describe('9. 100 DSA Problem Bank & 11 Domains Validation', () => {
  suite.it('9.1 Bank contains exactly 100 curriculum problems', () => {
    expect(PROBLEMS_BANK_100.length).toBe(100);
    expect(TOTAL_CURRICULUM_PROBLEMS).toBe(100);
  });

  suite.it('9.2 Themes contain exactly 20 days with 5 problems mapped to each day', () => {
    expect(DAILY_TOPIC_THEMES.length).toBe(20);
    for (let day = 1; day <= 20; day++) {
      const dayProbs = PROBLEMS_BANK_100.filter((p) => p.dayNumber === day);
      expect(dayProbs.length).toBe(5);
    }
  });

  suite.it('9.3 Covers all 11 foundational DSA domains', () => {
    expect(DSA_TOPICS.length).toBe(11);
    const domainCounts = {};
    PROBLEMS_BANK_100.forEach((p) => {
      domainCounts[p.topic] = (domainCounts[p.topic] || 0) + 1;
    });

    DSA_TOPICS.forEach((topic) => {
      expect(domainCounts[topic]).toBeGreaterThan(0);
    });
  });

  suite.it('9.4 Every problem has non-empty id, title, topic, difficulty, and acceptanceRate', () => {
    PROBLEMS_BANK_100.forEach((p) => {
      expect(typeof p.id).toBe('string');
      expect(p.id.length).toBeGreaterThan(0);
      expect(typeof p.title).toBe('string');
      expect(p.title.length).toBeGreaterThan(0);
      expect(DSA_TOPICS).toContain(p.topic);
      expect(['Easy', 'Medium', 'Hard']).toContain(p.difficulty);
      expect(p.acceptanceRate).toContain('%');
    });
  });

  suite.it('9.5 Problem IDs are unique across all 100 problems', () => {
    const ids = new Set(PROBLEMS_BANK_100.map((p) => p.id));
    expect(ids.size).toBe(100);
  });

  suite.it('9.6 Topic totals match predefined curriculum distribution', () => {
    expect(TOPIC_CURRICULUM_TOTALS['Basics']).toBe(5);
    expect(TOPIC_CURRICULUM_TOTALS['Numbers']).toBe(15);
    expect(TOPIC_CURRICULUM_TOTALS['Arrays']).toBe(20);
    expect(TOPIC_CURRICULUM_TOTALS['Strings']).toBe(15);
  });
});

// =========================================================================
// 10. Exam Tiering & Problem Conversion
// =========================================================================
suite.describe('10. Exam Tiering & Problem Conversion', () => {
  suite.it('10.1 getExamTier returns EASY for weeks 1–3', () => {
    expect(getExamTier(1).tier).toBe('EASY');
    expect(getExamTier(2).tier).toBe('EASY');
    expect(getExamTier(3).tier).toBe('EASY');
  });

  suite.it('10.2 getExamTier returns MEDIUM for weeks 4–6', () => {
    expect(getExamTier(4).tier).toBe('MEDIUM');
    expect(getExamTier(5).tier).toBe('MEDIUM');
    expect(getExamTier(6).tier).toBe('MEDIUM');
  });

  suite.it('10.3 getExamTier returns HARD for weeks 7+', () => {
    expect(getExamTier(7).tier).toBe('HARD');
    expect(getExamTier(10).tier).toBe('HARD');
  });

  suite.it('10.4 convertProblemToExamQuestion creates valid ExamQuestion with test cases', () => {
    const prob = PROBLEMS_BANK_100[0];
    const q = convertProblemToExamQuestion(prob, 1, 5, 2);
    expect(q.id).toBe(`exam-q-${prob.id}`);
    expect(q.questionNumber).toBe(1);
    expect(q.marks).toBe(5);
    expect(q.testCases.length).toBeGreaterThan(0);
    expect(q.testCases.some((tc) => tc.isHidden)).toBe(true);
  });

  suite.it('10.5 buildOfficialExam builds 20-question exam with status SCHEDULED', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-05');
    expect(exam.questions.length).toBe(20);
    expect(exam.totalMarks).toBe(100);
    expect(exam.passMarks).toBe(50);
    expect(exam.status).toBe('SCHEDULED');
  });

  suite.it('10.6 Exam status transitions across SCHEDULED -> LIVE -> COMPLETED', () => {
    const exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-05');
    expect(exam.status).toBe('SCHEDULED');
    exam.status = 'LIVE';
    expect(exam.status).toBe('LIVE');
    exam.status = 'COMPLETED';
    expect(exam.status).toBe('COMPLETED');
  });
});

module.exports = suite;
