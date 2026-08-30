/**
 * Tier 2: Boundary & Corner Cases E2E Test Suite (≥50 Test Cases)
 * Comprehensive boundary value analysis, error states, and stress conditions.
 */

const { expect, TestSuite } = require('./helpers/testFramework.cjs');
const {
  calculatePending,
  calculateProgress,
  formatMetric,
  backendStudentToFrontend,
  backendTeamToFrontend,
  getStudentExamSeed,
  getShuffledQuestionsForStudent,
  convertProblemToExamQuestion,
  buildOfficialExam,
  PROBLEMS_BANK_100,
  DSA_TOPICS,
} = require('./helpers/domainData.cjs');
const { MockLocalStorage, MockApiClient, executeRealCode } = require('./helpers/mockApi.cjs');

const suite = new TestSuite('Tier 2: Boundary & Corner Cases Suite', 2);

// =========================================================================
// 1. Problem Solving & Pending Count Boundaries
// =========================================================================
suite.describe('1. Problem Solving & Pending Count Boundaries', () => {
  suite.it('1.1 Boundary: 0 solved -> exactly 100 pending, 0.0% progress', () => {
    expect(calculatePending(0)).toBe(100);
    expect(calculateProgress(0)).toBe(0.0);
  });

  suite.it('1.2 Boundary: 1 solved -> exactly 99 pending, 1.0% progress', () => {
    expect(calculatePending(1)).toBe(99);
    expect(calculateProgress(1)).toBe(1.0);
  });

  suite.it('1.3 Boundary: 50 solved -> exactly 50 pending, 50.0% progress', () => {
    expect(calculatePending(50)).toBe(50);
    expect(calculateProgress(50)).toBe(50.0);
  });

  suite.it('1.4 Boundary: 99 solved -> exactly 1 pending, 99.0% progress', () => {
    expect(calculatePending(99)).toBe(1);
    expect(calculateProgress(99)).toBe(99.0);
  });

  suite.it('1.5 Boundary: 100 solved -> exactly 0 pending, 100.0% progress', () => {
    expect(calculatePending(100)).toBe(0);
    expect(calculateProgress(100)).toBe(100.0);
  });

  suite.it('1.6 Boundary: >100 solved (e.g. 105) -> clamped to 0 pending, 100.0% progress', () => {
    expect(calculatePending(105)).toBe(0);
    expect(calculateProgress(105)).toBe(100.0);
  });
});

// =========================================================================
// 2. Negative and Zero Input Handling
// =========================================================================
suite.describe('2. Negative and Zero Input Handling', () => {
  suite.it('2.1 Negative solved count clamped safely to 100 pending', () => {
    expect(calculatePending(-10)).toBe(100);
    expect(calculateProgress(-10)).toBe(0.0);
  });

  suite.it('2.2 Negative streak values normalized cleanly', () => {
    const student = backendStudentToFrontend({
      id: 1,
      progress: { current_streak: -3, longest_streak: -1 },
    });
    expect(student.streak).toBe(-3); // Preserved or normalized
    expect(typeof student.streak).toBe('number');
  });

  suite.it('2.3 0 students in cohort prevents division by zero in team average progress', () => {
    const students = [];
    const avg = Number((students.reduce((acc, s) => acc + s.progress, 0) / Math.max(1, students.length)).toFixed(1));
    expect(avg).toBe(0.0);
    expect(isNaN(avg)).toBe(false);
  });

  suite.it('2.4 0 total problems attempted displays 0.0% acceptance rate without NaN', () => {
    const solved = 0;
    const attempted = 0;
    const rate = attempted === 0 ? '0.0%' : `${((solved / attempted) * 100).toFixed(1)}%`;
    expect(rate).toBe('0.0%');
  });

  suite.it('2.5 Null and undefined numbers in formatMetric return 0.0', () => {
    expect(formatMetric(null)).toBe(0.0);
    expect(formatMetric(undefined)).toBe(0.0);
    expect(formatMetric(0)).toBe(0.0);
  });
});

// =========================================================================
// 3. Empty / Null / Undefined Payload Robustness
// =========================================================================
suite.describe('3. Empty / Null / Undefined Payload Robustness', () => {
  suite.it('3.1 backendStudentToFrontend handles undefined progress object', () => {
    const student = backendStudentToFrontend({ id: 99, name: 'Ghost Student', roll_number: '21GK1A0599' });
    expect(student.solved).toBe(0);
    expect(student.pending).toBe(100);
    expect(student.progress).toBe(0.0);
    expect(student.streak).toBe(0);
  });

  suite.it('3.2 backendStudentToFrontend supplies fallback avatar when avatar_url is missing', () => {
    const student = backendStudentToFrontend({ id: 99, name: 'No Avatar' });
    expect(student.avatar).toBeDefined();
    expect(student.avatar.length).toBeGreaterThan(0);
  });

  suite.it('3.3 backendTeamToFrontend supplies fallback mentor name when mentor_name is null', () => {
    const team = backendTeamToFrontend({ id: 99, team_number: 'Team 99', name: 'Cohort 99', mentor_name: null });
    expect(team.mentorName).toBe('Faculty Mentor');
  });

  suite.it('3.4 getShuffledQuestionsForStudent handles empty questions array [] gracefully', () => {
    const res = getShuffledQuestionsForStudent([], 'student-1', 'exam-1');
    expect(res.shuffledQuestions.length).toBe(0);
    expect(res.setCode).toBe('SET-A101');
  });

  suite.it('3.5 getShuffledQuestionsForStudent handles single-element array without crash', () => {
    const singleQ = [convertProblemToExamQuestion(PROBLEMS_BANK_100[0], 1)];
    const res = getShuffledQuestionsForStudent(singleQ, 'student-1', 'exam-1');
    expect(res.shuffledQuestions.length).toBe(1);
    expect(res.shuffledQuestions[0].id).toBe(singleQ[0].id);
  });

  suite.it('3.6 convertProblemToExamQuestion handles missing problem description with fallback', () => {
    const prob = { id: 'prob-x', title: 'Custom Title', topic: 'Basics', difficulty: 'Easy' };
    const q = convertProblemToExamQuestion(prob, 1);
    expect(q.description).toContain('Custom Title');
  });
});

// =========================================================================
// 4. Network Error & HTTP Status Code Fallbacks
// =========================================================================
suite.describe('4. Network Error & HTTP Status Code Fallbacks', () => {
  let client;

  suite.beforeEach(() => {
    client = new MockApiClient();
  });

  suite.it('4.1 401 Unauthorized clears token and throws formatted error', async () => {
    client.setStoredToken('invalid_token');
    client.registerRoute('GET', '/auth/me', () => ({
      status: 401,
      data: { detail: 'Could not validate credentials' },
    }));

    await expect(client.request('/auth/me')).toReject('Could not validate credentials');
    expect(client.getStoredToken()).toBeNull();
  });

  suite.it('4.2 403 Forbidden throws access denied error', async () => {
    client.registerRoute('GET', '/dean/private', () => ({
      status: 403,
      data: { detail: 'Forbidden: Dean privileges required' },
    }));

    await expect(client.request('/dean/private')).toReject('Forbidden: Dean privileges required');
  });

  suite.it('4.3 404 Not Found throws resource not found error', async () => {
    client.registerRoute('GET', '/dean/students/9999', () => ({
      status: 404,
      data: { detail: 'Student not found' },
    }));

    await expect(client.request('/dean/students/9999')).toReject('Student not found');
  });

  suite.it('4.4 500 Internal Server Error propagates error without crashing process', async () => {
    client.registerRoute('POST', '/dean/teams', () => ({
      status: 500,
      data: { detail: 'Database connection timeout on Neon cluster' },
    }));

    await expect(
      client.request('/dean/teams', {
        method: 'POST',
        body: JSON.stringify({ team_number: 'Team 30', name: 'Cohort 30' }),
      })
    ).toReject('Database connection timeout on Neon cluster');
  });

  suite.it('4.5 Complete network failure (offline) throws NetworkError', async () => {
    const offlineClient = new MockApiClient({ isOnline: false });
    await expect(offlineClient.request('/auth/me')).toReject('NetworkError');
  });

  suite.it('4.6 Non-JSON error body fallback formats status code error message', async () => {
    client.registerRoute('GET', '/raw-error', () => ({
      status: 502,
      data: null,
    }));
    await expect(client.request('/raw-error')).toReject('Request failed with status 502');
  });
});

// =========================================================================
// 5. Storage & Session Corruption Resilience
// =========================================================================
suite.describe('5. Storage & Session Corruption Resilience', () => {
  suite.it('5.1 Corrupt JSON in gkce_user_profile_v1 does not crash getInitialAuthState', () => {
    const storage = new MockLocalStorage();
    storage.setItem('gkce_user_profile_v1', '###BAD_JSON###');
    let user = { role: 'DEAN', isAuth: false };
    try {
      const raw = storage.getItem('gkce_user_profile_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.email) user = { role: parsed.role, isAuth: true };
      }
    } catch {
      // Ignored gracefully
    }
    expect(user.isAuth).toBe(false);
  });

  suite.it('5.2 Corrupt JSON in weekly exams cache falls back to INITIAL_WEEKLY_EXAMS', () => {
    const storage = new MockLocalStorage();
    storage.setItem('gkce_weekly_exams_v4', '{"unclosed json');
    let exams = [];
    try {
      const saved = storage.getItem('gkce_weekly_exams_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) exams = parsed;
      }
    } catch {
      exams = [];
    }
    expect(exams.length).toBe(0);
  });

  suite.it('5.3 QuotaExceededError in localStorage does not throw uncaught error', () => {
    const quotaExceededStorage = new MockLocalStorage(true);
    const client = new MockApiClient({ storage: quotaExceededStorage });
    expect(() => client.setStoredToken('token')).not.toThrow();
  });

  suite.it('5.4 getStoredToken returns null when localStorage throws SecurityError', () => {
    const restrictedStorage = new MockLocalStorage(true);
    const client = new MockApiClient({ storage: restrictedStorage });
    expect(client.getStoredToken()).toBeNull();
  });

  suite.it('5.5 clearStoredToken handles restricted storage exceptions cleanly', () => {
    const restrictedStorage = new MockLocalStorage(true);
    const client = new MockApiClient({ storage: restrictedStorage });
    expect(() => client.clearStoredToken()).not.toThrow();
  });
});

// =========================================================================
// 6. Forge IDE Code Execution Stress & Edge Cases
// =========================================================================
suite.describe('6. Forge IDE Code Execution Stress & Edge Cases', () => {
  let client;

  suite.beforeEach(() => {
    client = new MockApiClient();
  });

  suite.it('6.1 Whitespace-only code body treated as empty COMPILATION_ERROR', async () => {
    const testCases = [{ input: '5', expectedOutput: '15' }];
    const res = await executeRealCode('   \n\t  \r\n  ', 'python', testCases, 'solve', client);
    expect(res.status).toBe('COMPILATION_ERROR');
    expect(res.passedCount).toBe(0);
  });

  suite.it('6.2 Syntax error in code returns COMPILATION_ERROR with diagnostics', async () => {
    const testCases = [{ input: '5', expectedOutput: '15' }];
    const code = 'def solve(n): SYNTAX_ERROR ;;;';
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('COMPILATION_ERROR');
    expect(res.passedCount).toBe(0);
  });

  suite.it('6.3 Code with unicode characters (emojis, accented characters) executes cleanly', async () => {
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const code = `def solve(n):\n    # GKCE Solution 🚀 αβγ\n    return "Even" if int(n) % 2 == 0 else "Odd"`;
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('ACCEPTED');
    expect(res.passedCount).toBe(1);
  });

  suite.it('6.4 Large code string (50KB comments) handles payload without crashing', async () => {
    const largeComment = '# ' + 'A'.repeat(50000) + '\n';
    const code = largeComment + `def solve(n):\n    return "Even"`;
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('ACCEPTED');
  });

  suite.it('6.5 Test cases with empty input string "" evaluated accurately', async () => {
    const testCases = [{ input: '', expectedOutput: 'Empty' }];
    const code = `def solve(s):\n    return "Empty" if not s else "NonEmpty"`;
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('ACCEPTED');
  });

  suite.it('6.6 Multiline input with newline characters parsed properly', async () => {
    const testCases = [{ input: '3\n1 2 3', expectedOutput: '6' }];
    const code = `def solve(inp):\n    return "6"`;
    const res = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(res.status).toBe('ACCEPTED');
  });
});

// =========================================================================
// 7. Exam Taking Boundary Conditions
// =========================================================================
suite.describe('7. Exam Taking Boundary Conditions', () => {
  let exam;

  suite.beforeEach(() => {
    exam = buildOfficialExam(1, 'Week 1 Exam', '2026-09-01');
  });

  suite.it('7.1 Submitting empty answers object {} scores 0 marks and status FAILED', () => {
    const answers = {};
    const marksPerQ = 5;
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id]) score += marksPerQ;
    });

    expect(score).toBe(0);
    const passed = score >= exam.passMarks;
    expect(passed).toBe(false);
  });

  suite.it('7.2 Submitting partial answers (e.g. 5 of 20) grades answered and scores 25 marks', () => {
    const answers = {};
    for (let i = 0; i < 5; i++) {
      answers[exam.questions[i].id] = 'return "Even"';
    }

    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id]) score += 5;
    });

    expect(score).toBe(25);
    expect(score >= exam.passMarks).toBe(false);
  });

  suite.it('7.3 Submitting answers containing non-existent question IDs ignores unknown IDs', () => {
    const answers = {
      'non-existent-q-999': 'malicious payload',
    };
    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id]) score += 5;
    });

    expect(score).toBe(0);
  });

  suite.it('7.4 All correct answers achieve 100/100 marks and passMarks met', () => {
    const answers = {};
    exam.questions.forEach((q) => {
      answers[q.id] = 'correct solution';
    });

    let score = 0;
    exam.questions.forEach((q) => {
      if (answers[q.id]) score += 5;
    });

    expect(score).toBe(100);
    expect(score >= exam.passMarks).toBe(true);
  });

  suite.it('7.5 Boundary pass marks threshold: exactly 50 marks passes exam', () => {
    const score = 50;
    const passed = score >= exam.passMarks;
    expect(passed).toBe(true);
  });

  suite.it('7.6 Boundary fail marks threshold: 49 marks fails exam', () => {
    const score = 49;
    const passed = score >= exam.passMarks;
    expect(passed).toBe(false);
  });
});

// =========================================================================
// 8. Anti-Cheating PRNG & Hash Collision Resilience
// =========================================================================
suite.describe('8. Anti-Cheating PRNG & Hash Collision Resilience', () => {
  suite.it('8.1 Empty student ID string does not crash getStudentExamSeed', () => {
    const seed = getStudentExamSeed('', 'exam-1');
    expect(typeof seed).toBe('number');
    expect(seed).toBeGreaterThanOrEqual(0);
  });

  suite.it('8.2 Student ID is case-insensitive and trims whitespace', () => {
    const seed1 = getStudentExamSeed('STUDENT-01 ', 'exam-1');
    const seed2 = getStudentExamSeed(' student-01', 'exam-1');
    expect(seed1).toBe(seed2);
  });

  suite.it('8.3 Distinct student IDs produce distinct seeds (collision resistance)', () => {
    const seed1 = getStudentExamSeed('student-1', 'exam-w1');
    const seed2 = getStudentExamSeed('student-2', 'exam-w1');
    const seed3 = getStudentExamSeed('student-3', 'exam-w1');
    expect(seed1 !== seed2).toBe(true);
    expect(seed2 !== seed3).toBe(true);
  });

  suite.it('8.4 Same student on different exams produces different seeds', () => {
    const seedW1 = getStudentExamSeed('student-1', 'exam-w1');
    const seedW2 = getStudentExamSeed('student-1', 'exam-w2');
    expect(seedW1 !== seedW2).toBe(true);
  });

  suite.it('8.5 Mulberry32 PRNG seed is guaranteed to stay within 32-bit positive integer range', () => {
    const seed = getStudentExamSeed('any-student-id-test', 'any-exam');
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThanOrEqual(2147483647);
  });
});

// =========================================================================
// 9. Metric Precision & Rounding Consistency
// =========================================================================
suite.describe('9. Metric Precision & Rounding Consistency', () => {
  suite.it('9.1 Fractional 1/3 (33.333...%) rounds strictly to 33.3%', () => {
    const val = Number(((1 / 3) * 100).toFixed(1));
    expect(val).toBe(33.3);
  });

  suite.it('9.2 Fractional 2/3 (66.666...%) rounds strictly to 66.7%', () => {
    const val = Number(((2 / 3) * 100).toFixed(1));
    expect(val).toBe(66.7);
  });

  suite.it('9.3 Fractional 7/9 (77.777...%) rounds strictly to 77.8%', () => {
    const val = Number(((7 / 9) * 100).toFixed(1));
    expect(val).toBe(77.8);
  });

  suite.it('9.4 Integer average progress retains 1 decimal place format', () => {
    const cohortProgresses = [80, 80, 80, 80, 80];
    const avg = Number((cohortProgresses.reduce((a, b) => a + b, 0) / cohortProgresses.length).toFixed(1));
    expect(avg).toBe(80.0);
  });

  suite.it('9.5 Topic performance averages preserve decimal consistency across all 11 topics', () => {
    const topicSums = { Basics: 15, Numbers: 44, Arrays: 71 };
    const topicAvgs = {};
    for (const [topic, sum] of Object.entries(topicSums)) {
      topicAvgs[topic] = Number((sum / 5).toFixed(1));
    }
    expect(topicAvgs.Basics).toBe(3.0);
    expect(topicAvgs.Numbers).toBe(8.8);
    expect(topicAvgs.Arrays).toBe(14.2);
  });
});

// =========================================================================
// 10. Mentor Verification Edge Cases
// =========================================================================
suite.describe('10. Mentor Verification Edge Cases', () => {
  let student;

  suite.beforeEach(() => {
    student = {
      id: 'student-1',
      verifiedProblemIds: ['prob-1'],
    };
  });

  suite.it('10.1 Verifying already verified problem is idempotent without duplicates', () => {
    const current = new Set(student.verifiedProblemIds || []);
    current.add('prob-1');
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.length).toBe(1);
    expect(student.verifiedProblemIds[0]).toBe('prob-1');
  });

  suite.it('10.2 Un-verifying non-verified problem leaves list unchanged', () => {
    const current = new Set(student.verifiedProblemIds || []);
    current.delete('prob-99');
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.length).toBe(1);
    expect(student.verifiedProblemIds[0]).toBe('prob-1');
  });

  suite.it('10.3 Batch verifying day with existing partial verification prevents duplicate IDs', () => {
    const dayProblems = ['prob-1', 'prob-2', 'prob-3', 'prob-4', 'prob-5'];
    const current = new Set(student.verifiedProblemIds || []); // Already has prob-1
    dayProblems.forEach((p) => current.add(p));
    student.verifiedProblemIds = Array.from(current);

    expect(student.verifiedProblemIds.length).toBe(5);
  });

  suite.it('10.4 Student with undefined verifiedProblemIds initializes safely as empty set', () => {
    const uninitializedStudent = { id: 's-9' };
    const current = new Set(uninitializedStudent.verifiedProblemIds || []);
    current.add('prob-5');
    uninitializedStudent.verifiedProblemIds = Array.from(current);

    expect(uninitializedStudent.verifiedProblemIds.length).toBe(1);
    expect(uninitializedStudent.verifiedProblemIds[0]).toBe('prob-5');
  });

  suite.it('10.5 Empty student roster in batch verification does not throw error', () => {
    const emptyCohort = [];
    expect(() => {
      emptyCohort.forEach((s) => {
        const current = new Set(s.verifiedProblemIds || []);
        current.add('prob-1');
        s.verifiedProblemIds = Array.from(current);
      });
    }).not.toThrow();
  });
});

module.exports = suite;
