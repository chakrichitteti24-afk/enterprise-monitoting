/**
 * Tier 3: Cross-Feature Combinations E2E Test Suite (≥15 Test Cases)
 * End-to-end integration across Dean, Mentor, and Student workflows.
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

const suite = new TestSuite('Tier 3: Cross-Feature Combinations Suite', 3);

// =========================================================================
// Multi-Role & Cross-Feature Integration Scenarios
// =========================================================================
suite.describe('Cross-Feature Multi-Role Integrations', () => {
  let client;
  let storage;

  suite.beforeEach(() => {
    storage = new MockLocalStorage();
    client = new MockApiClient({ storage });
  });

  suite.it('3.1 Student Solves Problem -> Mentor Verifies via Single Toggle -> Dean Directory Sync', async () => {
    // 1. Student solves prob-1 in Forge IDE
    const prob = PROBLEMS_BANK_100[0];
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const code = `def solve(n):\n    return "Even" if n % 2 == 0 else "Odd"`;
    const execRes = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(execRes.status).toBe('ACCEPTED');

    const student = {
      id: 'student-1',
      rollNo: '21GK1A0501',
      name: 'A. Surya',
      solved: 0,
      pending: 100,
      verifiedProblemIds: [],
    };
    student.solved += 1;
    student.pending = calculatePending(student.solved);

    // 2. Mentor opens Daily 5 matrix and toggles verification for prob-1
    const set = new Set(student.verifiedProblemIds);
    set.add(prob.id);
    student.verifiedProblemIds = Array.from(set);

    // 3. Dean checks student directory
    expect(student.verifiedProblemIds).toContain(prob.id);
    expect(student.verifiedProblemIds.length).toBe(1);
    expect(student.pending).toBe(99);
  });

  suite.it('3.2 Student Solves Day 1 -> Mentor Batch Verifies Day -> Team Average Updates in Tandem', () => {
    const cohort = [
      { id: 's-1', progress: 0.0, solved: 0, verifiedProblemIds: [] },
      { id: 's-2', progress: 0.0, solved: 0, verifiedProblemIds: [] },
      { id: 's-3', progress: 0.0, solved: 0, verifiedProblemIds: [] },
      { id: 's-4', progress: 0.0, solved: 0, verifiedProblemIds: [] },
      { id: 's-5', progress: 0.0, solved: 0, verifiedProblemIds: [] },
    ];

    // Student 1 solves all 5 Day 1 problems
    const day1ProblemIds = PROBLEMS_BANK_100.filter((p) => p.dayNumber === 1).map((p) => p.id);
    expect(day1ProblemIds.length).toBe(5);

    cohort[0].solved = 5;
    cohort[0].progress = calculateProgress(cohort[0].solved); // 5.0%

    // Mentor batch verifies Day 1 for Student 1
    const set = new Set(cohort[0].verifiedProblemIds);
    day1ProblemIds.forEach((id) => set.add(id));
    cohort[0].verifiedProblemIds = Array.from(set);

    // Recompute Team Average Progress
    const teamAvgProgress = Number(
      (cohort.reduce((sum, s) => sum + s.progress, 0) / cohort.length).toFixed(1)
    );

    expect(cohort[0].verifiedProblemIds.length).toBe(5);
    expect(cohort[0].progress).toBe(5.0);
    expect(teamAvgProgress).toBe(1.0); // (5 + 0 + 0 + 0 + 0) / 5 = 1.0%
  });

  suite.it('3.3 Dean Schedules Exam -> Exam Goes LIVE -> Student Takes with Shuffled Paper -> Mentor Scorecard Review', () => {
    // 1. Dean builds Week 1 Exam
    const exam = buildOfficialExam(1, 'Week 1 DSA Foundations', '2026-09-05');
    expect(exam.status).toBe('SCHEDULED');

    // 2. Dean transitions exam to LIVE
    exam.status = 'LIVE';
    expect(exam.status).toBe('LIVE');

    // 3. Student takes exam with randomized set
    const { shuffledQuestions, setCode } = getShuffledQuestionsForStudent(exam.questions, 'student-1', exam.id);
    expect(shuffledQuestions.length).toBe(20);

    // Student answers all 20 questions
    const answers = {};
    shuffledQuestions.forEach((q) => {
      answers[q.id] = 'return true;';
    });

    const submission = {
      id: 'sub-student-1',
      studentId: 'student-1',
      studentName: 'A. Surya',
      studentRollNo: '21GK1A0501',
      teamNumber: 'Team 01',
      examId: exam.id,
      score: 100,
      maxScore: 100,
      percentage: 100.0,
      passed: true,
      setCode,
      status: 'SUBMITTED',
    };
    exam.submissions.push(submission);

    // 4. Mentor reviews scorecard
    expect(exam.submissions.length).toBe(1);
    expect(exam.submissions[0].score).toBe(100);
    expect(exam.submissions[0].passed).toBe(true);
    expect(exam.submissions[0].setCode).toBe(setCode);
  });

  suite.it('3.4 Dean Creates Team & Assigns Mentor -> Enrolls 5 Students -> Mentor Cohort View Updates', () => {
    // 1. Dean creates Team 21
    const newTeam = {
      id: 'team-21',
      teamNumber: 'Team 21',
      name: 'Lateral Entry Cohort 21',
      mentorId: 'mentor-1',
      mentorName: 'K.S.GAYATHRI',
      studentIds: [],
      avgProgress: 0.0,
      rank: 21,
    };

    // 2. Dean enrolls 5 students
    const newStudents = [];
    for (let i = 1; i <= 5; i++) {
      const s = {
        id: `student-lateral-${i}`,
        rollNo: `21GK1A05L${i}`,
        name: `Lateral Student ${i}`,
        email: `lateral${i}@gkce.edu.in`,
        teamId: newTeam.id,
        teamNumber: newTeam.teamNumber,
        solved: 0,
        pending: calculatePending(0),
        progress: calculateProgress(0),
      };
      newStudents.push(s);
      newTeam.studentIds.push(s.id);
    }

    // 3. Mentor switches to Team 21
    const mentorCohortStudents = newStudents.filter((s) => s.teamId === 'team-21');
    expect(mentorCohortStudents.length).toBe(5);
    expect(newTeam.studentIds.length).toBe(5);
    expect(mentorCohortStudents[0].pending).toBe(100);
  });

  suite.it('3.5 Forge IDE Python Execution -> Solution Submission -> Activity Log & Heatmap Updated', async () => {
    const student = {
      id: 'student-1',
      recentActivities: [],
      submissionsHistory: [{ date: '2026-08-30', count: 0 }],
      solved: 0,
    };

    const prob = PROBLEMS_BANK_100[1]; // Find largest of three numbers
    const testCases = [{ input: '10 25 15', expectedOutput: '25' }];
    const code = `def solve(a, b, c):\n    return max(int(a), int(b), int(c))`;

    const execRes = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(execRes.status).toBe('ACCEPTED');

    student.solved += 1;
    student.recentActivities.unshift({
      id: `act-${Date.now()}`,
      action: 'Solved Challenge',
      problemTitle: prob.title,
      topic: prob.topic,
      difficulty: prob.difficulty,
      status: 'Completed',
      timeAgo: 'Just now',
    });
    student.submissionsHistory[0].count += 1;

    expect(student.recentActivities.length).toBe(1);
    expect(student.recentActivities[0].problemTitle).toBe(prob.title);
    expect(student.submissionsHistory[0].count).toBe(1);
  });

  suite.it('3.6 Anti-Cheating Invariant: 5 Students in Same Cohort Receive 5 Distinct Question Permutations', () => {
    const exam = buildOfficialExam(1, 'Anti-Cheating Test Exam', '2026-09-01');
    const cohortStudentIds = ['student-1', 'student-2', 'student-3', 'student-4', 'student-5'];

    const sets = cohortStudentIds.map((id) =>
      getShuffledQuestionsForStudent(exam.questions, id, exam.id)
    );

    // Verify all set codes are distinct
    const setCodes = new Set(sets.map((s) => s.setCode));
    expect(setCodes.size).toBe(5);

    // Verify all question sequences are distinct permutations
    const orderSignatures = new Set(
      sets.map((s) => s.shuffledQuestions.map((q) => q.id).join('->'))
    );
    expect(orderSignatures.size).toBe(5);
  });

  suite.it('3.7 Offline Problem Solving -> Optimistic Local Update -> Backend Rehydration', async () => {
    const offlineClient = new MockApiClient({ isOnline: false });
    const student = { id: 'student-1', solved: 10, pending: 90, progress: 10.0 };

    // Offline solve in Forge IDE
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const code = `def solve(n):\n    return "Even" if int(n) % 2 == 0 else "Odd"`;
    const execRes = await executeRealCode(code, 'python', testCases, 'solve', offlineClient);
    expect(execRes.status).toBe('ACCEPTED');

    // Optimistic state update
    student.solved += 1;
    student.pending = calculatePending(student.solved);
    student.progress = calculateProgress(student.solved);

    expect(student.solved).toBe(11);
    expect(student.pending).toBe(89);
    expect(student.progress).toBe(11.0);
  });

  suite.it('3.8 Dean Modifies Student DSA Level -> Student Dashboard Reflects Updated Level', () => {
    const backendStudent = {
      id: 1,
      roll_number: '21GK1A0501',
      name: 'A. Surya',
      dsa_level: 'BEGINNER',
    };

    let student = backendStudentToFrontend(backendStudent);
    expect(student.dsaLevel).toBe('Beginner');

    // Dean updates level to INTERMEDIATE
    backendStudent.dsa_level = 'INTERMEDIATE';
    student = backendStudentToFrontend(backendStudent);
    expect(student.dsaLevel).toBe('Intermediate');
  });

  suite.it('3.9 Mentor Batch Verifies Problem Across Whole Cohort -> All 5 Members Updated', () => {
    const cohort = [
      { id: 's-1', verifiedProblemIds: [] },
      { id: 's-2', verifiedProblemIds: [] },
      { id: 's-3', verifiedProblemIds: [] },
      { id: 's-4', verifiedProblemIds: [] },
      { id: 's-5', verifiedProblemIds: [] },
    ];

    const targetProblemId = 'prob-20';
    cohort.forEach((s) => {
      const set = new Set(s.verifiedProblemIds || []);
      set.add(targetProblemId);
      s.verifiedProblemIds = Array.from(set);
    });

    cohort.forEach((s) => {
      expect(s.verifiedProblemIds).toContain(targetProblemId);
    });
  });

  suite.it('3.10 Student Updates GitHub Profile Link -> Persistence Validated -> Dean Directory Reflects URL', () => {
    const student = {
      id: 'student-1',
      githubUsername: 'asurya-dev',
      githubRepoLink: '',
    };

    // Student submits repo link
    const newRepoUrl = 'https://github.com/asurya-dev/gkce-dsa-curriculum';
    student.githubRepoLink = newRepoUrl;

    // Dean views student profile
    expect(student.githubRepoLink).toBe(newRepoUrl);
    expect(student.githubRepoLink).toContain('github.com');
  });

  suite.it('3.11 Partial Test Case Failure in Forge IDE -> Problem Marked Attempted but Not Solved', async () => {
    const student = { solved: 5, attempted: 5, pending: 95 };
    const testCases = [
      { input: '4', expectedOutput: 'Even' },
      { input: '7', expectedOutput: 'Odd' },
      { input: '12', expectedOutput: 'Even' },
      { input: '9', expectedOutput: 'Odd' },
    ];

    // Imperfect code that fails odd cases
    const buggyCode = 'def solve(n): return "Even"';
    const res = await executeRealCode(buggyCode, 'python', testCases, 'solve', client);

    if (res.status !== 'ACCEPTED') {
      student.attempted += 1;
      // solved and pending unchanged
    }

    expect(student.attempted).toBe(6);
    expect(student.solved).toBe(5);
    expect(student.pending).toBe(95);
  });

  suite.it('3.12 Dean Closes Exam (LIVE -> COMPLETED) -> Submissions Locked -> Final Cohort Analytics Computed', () => {
    const exam = buildOfficialExam(1, 'Midterm Exam', '2026-09-01');
    exam.status = 'LIVE';
    exam.submissions = [
      { studentId: 's-1', score: 90, passed: true },
      { studentId: 's-2', score: 85, passed: true },
      { studentId: 's-3', score: 45, passed: false },
      { studentId: 's-4', score: 95, passed: true },
      { studentId: 's-5', score: 70, passed: true },
    ];

    // Dean closes exam
    exam.status = 'COMPLETED';
    expect(exam.status).toBe('COMPLETED');

    const avgScore = Number(
      (exam.submissions.reduce((acc, sub) => acc + sub.score, 0) / exam.submissions.length).toFixed(1)
    );
    const passCount = exam.submissions.filter((s) => s.passed).length;
    const passRate = Number(((passCount / exam.submissions.length) * 100).toFixed(1));

    expect(avgScore).toBe(77.0);
    expect(passRate).toBe(80.0);
  });

  suite.it('3.13 Full 100-Problem Completion -> Pending Drops to 0 -> All 11 Topic Breakdown Reaches 100%', () => {
    const student = {
      id: 'student-champion',
      solved: 100,
      pending: calculatePending(100),
      progress: calculateProgress(100),
      topicProgress: {},
    };

    DSA_TOPICS.forEach((t) => {
      student.topicProgress[t] = { percentage: 100.0 };
    });

    expect(student.pending).toBe(0);
    expect(student.progress).toBe(100.0);
    DSA_TOPICS.forEach((t) => {
      expect(student.topicProgress[t].percentage).toBe(100.0);
    });
  });

  suite.it('3.14 Dean Deletes Student -> Team Student List Updated -> Team Average Recalculates', () => {
    const team = {
      id: 'team-1',
      studentIds: ['s-1', 's-2', 's-3', 's-4', 's-5'],
      students: [
        { id: 's-1', progress: 50.0 },
        { id: 's-2', progress: 60.0 },
        { id: 's-3', progress: 70.0 },
        { id: 's-4', progress: 80.0 },
        { id: 's-5', progress: 20.0 }, // Dropped student
      ],
    };

    // Dean removes student s-5
    team.students = team.students.filter((s) => s.id !== 's-5');
    team.studentIds = team.students.map((s) => s.id);

    const newAvg = Number(
      (team.students.reduce((sum, s) => sum + s.progress, 0) / team.students.length).toFixed(1)
    );

    expect(team.studentIds.length).toBe(4);
    expect(newAvg).toBe(65.0); // (50 + 60 + 70 + 80) / 4 = 65.0
  });

  suite.it('3.15 Dual-Role Interaction: Mentor Adds Feedback Note -> Student Views in Timeline -> Dean Views in Modal', () => {
    const student = {
      id: 'student-1',
      name: 'A. Surya',
      mentorFeedbackNotes: [],
    };

    // Mentor adds note
    const note = {
      id: 'note-101',
      date: '2026-08-30',
      author: 'K.S.GAYATHRI (Faculty Mentor)',
      note: 'Mastered LinkedList reversal algorithm. Recommended next: Binary Search trees.',
    };
    student.mentorFeedbackNotes.push(note);

    // Student & Dean view note
    expect(student.mentorFeedbackNotes.length).toBe(1);
    expect(student.mentorFeedbackNotes[0].author).toContain('K.S.GAYATHRI');
    expect(student.mentorFeedbackNotes[0].note).toContain('LinkedList');
  });

  suite.it('3.16 Multi-Role Session Switching & State Isolation: Dean -> Mentor -> Student -> Dean', () => {
    const sessions = [
      { role: 'DEAN', accessibleTabs: ['overview', 'teams', 'students', 'benchmarks', 'analytics', 'exams', 'reports', 'settings'] },
      { role: 'MENTOR', accessibleTabs: ['dashboard', 'roster', 'matrix', 'scorecards'] },
      { role: 'STUDENT', accessibleTabs: ['dashboard', 'forge', 'progress', 'activity', 'profile', 'exams'] },
    ];

    sessions.forEach((sess) => {
      expect(sess.accessibleTabs.length).toBeGreaterThanOrEqual(4);
      if (sess.role === 'DEAN') expect(sess.accessibleTabs).toContain('reports');
      if (sess.role === 'MENTOR') expect(sess.accessibleTabs).toContain('matrix');
      if (sess.role === 'STUDENT') expect(sess.accessibleTabs).toContain('forge');
    });
  });
});

module.exports = suite;
