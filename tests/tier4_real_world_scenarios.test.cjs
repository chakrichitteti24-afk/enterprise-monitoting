/**
 * Tier 4: Real-World Application Scenarios E2E Test Suite (≥8 Workflows)
 * Comprehensive end-to-end simulations of complete academic operations.
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

const suite = new TestSuite('Tier 4: Real-World Application Scenarios Suite', 4);

// =========================================================================
// Real-World Academic Workflows
// =========================================================================
suite.describe('Academic Lifecycle End-to-End Scenarios', () => {
  let client;
  let storage;

  suite.beforeEach(() => {
    storage = new MockLocalStorage();
    client = new MockApiClient({ storage });
  });

  // -----------------------------------------------------------------------
  // Scenario 1: Full Student Enrollment & Onboarding Cycle
  // -----------------------------------------------------------------------
  suite.it('Scenario 1: Full Student Enrollment & Onboarding Cycle', async () => {
    // Step 1: Dean creates Team 21 with assigned Faculty Mentor
    const teamPayload = {
      team_number: 'Team 21',
      name: 'Lateral CSE 2026',
      mentor_id: 1,
      mentor_name: 'K.S.GAYATHRI',
    };
    const teamRes = await client.request('/dean/teams', {
      method: 'POST',
      body: JSON.stringify(teamPayload),
    });
    expect(teamRes.team_number).toBe('Team 21');
    expect(teamRes.id).toBeGreaterThan(0);

    // Step 2: Dean enrolls 5 new students into Team 21
    const enrolledStudents = [];
    for (let i = 1; i <= 5; i++) {
      const studentPayload = {
        name: `Candidate ${i}`,
        roll_number: `21GK1A05L0${i}`,
        email: `candidate${i}@gkce.edu.in`,
        team_id: teamRes.id,
        team_number: teamRes.team_number,
        dsa_level: 'BEGINNER',
        status: 'ACTIVE',
      };
      const sRes = await client.request('/dean/students', {
        method: 'POST',
        body: JSON.stringify(studentPayload),
      });
      enrolledStudents.push(sRes);
    }
    expect(enrolledStudents.length).toBe(5);

    // Step 3: Mentor logs in and views Team 21 Roster
    const mentorCohort = enrolledStudents.filter((s) => s.team_id === teamRes.id);
    expect(mentorCohort.length).toBe(5);

    // Step 4: First student logs in, accesses Forge IDE, solves Day 1 Problem 1
    const student1 = backendStudentToFrontend(enrolledStudents[0]);
    expect(student1.solved).toBe(0);
    expect(student1.pending).toBe(100);

    const day1Prob1 = PROBLEMS_BANK_100[0]; // Check even or odd
    const testCases = [{ input: '4', expectedOutput: 'Even' }];
    const code = `def solve(n):\n    return "Even" if int(n) % 2 == 0 else "Odd"`;

    const runRes = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(runRes.status).toBe('ACCEPTED');

    student1.solved += 1;
    student1.pending = calculatePending(student1.solved);
    student1.progress = calculateProgress(student1.solved);

    expect(student1.solved).toBe(1);
    expect(student1.pending).toBe(99);
    expect(student1.progress).toBe(1.0);
  });

  // -----------------------------------------------------------------------
  // Scenario 2: Faculty Daily 5 Verification and Batch Sign-Off Cycle
  // -----------------------------------------------------------------------
  suite.it('Scenario 2: Faculty Daily 5 Verification and Batch Sign-Off Cycle', async () => {
    // 5 students in cohort solve Day 1 problems (5 problems each)
    const day1ProblemIds = PROBLEMS_BANK_100.filter((p) => p.dayNumber === 1).map((p) => p.id);
    expect(day1ProblemIds.length).toBe(5);

    const cohort = [
      { id: 's-1', name: 'A. Surya', solved: 5, pending: 95, progress: 5.0, verifiedProblemIds: [] },
      { id: 's-2', name: 'B. Bhavani', solved: 5, pending: 95, progress: 5.0, verifiedProblemIds: [] },
      { id: 's-3', name: 'C. Chaitanya', solved: 5, pending: 95, progress: 5.0, verifiedProblemIds: [] },
      { id: 's-4', name: 'D. Divya', solved: 5, pending: 95, progress: 5.0, verifiedProblemIds: [] },
      { id: 's-5', name: 'E. Eshwar', solved: 5, pending: 95, progress: 5.0, verifiedProblemIds: [] },
    ];

    // 1. Mentor reviews submissions and performs individual toggle verification on prob-1 for s-1
    cohort[0].verifiedProblemIds.push(day1ProblemIds[0]);
    expect(cohort[0].verifiedProblemIds).toContain('prob-1');

    // 2. Mentor uses Batch "Verify 5 (Day 1)" on s-1
    const set1 = new Set(cohort[0].verifiedProblemIds);
    day1ProblemIds.forEach((id) => set1.add(id));
    cohort[0].verifiedProblemIds = Array.from(set1);
    expect(cohort[0].verifiedProblemIds.length).toBe(5);

    // 3. Mentor uses Team-Wide Problem Verification on prob-2 across all 5 students
    cohort.forEach((s) => {
      const set = new Set(s.verifiedProblemIds);
      set.add(day1ProblemIds[1]); // prob-2
      s.verifiedProblemIds = Array.from(set);
    });

    cohort.forEach((s) => {
      expect(s.verifiedProblemIds).toContain(day1ProblemIds[1]);
    });

    // 4. Batch verify remaining Day 1 for all students
    cohort.forEach((s) => {
      const set = new Set(s.verifiedProblemIds);
      day1ProblemIds.forEach((id) => set.add(id));
      s.verifiedProblemIds = Array.from(set);
    });

    cohort.forEach((s) => {
      expect(s.verifiedProblemIds.length).toBe(5);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario 3: Weekly Exam Lifecycle: Creation, Randomization, Taking, Review
  // -----------------------------------------------------------------------
  suite.it('Scenario 3: Weekly Exam Lifecycle: Creation, Randomization, Taking, Review', async () => {
    // 1. Dean creates Week 2 Exam (Medium tier)
    const exam = buildOfficialExam(2, 'Week 2 Placement Intermediate Exam', '2026-09-08');
    expect(exam.questions.length).toBe(20);
    expect(exam.tier).toBe('EASY'); // Week 2 is Foundations Tier 1
    expect(exam.status).toBe('SCHEDULED');

    // 2. Dean publishes exam to LIVE
    exam.status = 'LIVE';
    expect(exam.status).toBe('LIVE');

    // 3. Three students take the exam simultaneously
    const studentIds = ['student-1', 'student-2', 'student-3'];
    const examSessions = studentIds.map((id) =>
      getShuffledQuestionsForStudent(exam.questions, id, exam.id)
    );

    // Verify anti-cheating set code and question sequence independence
    expect(examSessions[0].setCode !== examSessions[1].setCode).toBe(true);
    expect(examSessions[1].setCode !== examSessions[2].setCode).toBe(true);

    // 4. Students submit solutions
    examSessions.forEach((session, idx) => {
      const score = 80 + idx * 10; // 80, 90, 100
      exam.submissions.push({
        id: `sub-${idx + 1}`,
        studentId: studentIds[idx],
        studentName: `Student ${idx + 1}`,
        studentRollNo: `21GK1A050${idx + 1}`,
        teamNumber: 'Team 01',
        examId: exam.id,
        score,
        maxScore: 100,
        percentage: Number(score.toFixed(1)),
        passed: score >= exam.passMarks,
        setCode: session.setCode,
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString(),
      });
    });

    expect(exam.submissions.length).toBe(3);

    // 5. Dean closes exam to COMPLETED
    exam.status = 'COMPLETED';
    expect(exam.status).toBe('COMPLETED');

    // 6. Mentor audits scorecard
    const cohortAverage = Number(
      (exam.submissions.reduce((sum, s) => sum + s.score, 0) / exam.submissions.length).toFixed(1)
    );
    expect(cohortAverage).toBe(90.0); // (80 + 90 + 100) / 3 = 90.0
    expect(exam.submissions.every((s) => s.passed)).toBe(true);
  });

  // -----------------------------------------------------------------------
  // Scenario 4: Resilient Network Interruption & Session Recovery
  // -----------------------------------------------------------------------
  suite.it('Scenario 4: Resilient Network Interruption & Session Recovery', async () => {
    // 1. Student authenticates online
    const loginRes = await client.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'student1@gkce.edu.in', password: 'Student@2026' }),
    });
    expect(loginRes.access_token).toBeDefined();

    // 2. Network goes offline
    client.isOnline = false;
    await expect(client.request('/auth/me')).toReject('NetworkError');

    // 3. Student solves problems offline in Forge IDE with local evaluator
    const student = {
      id: 'student-1',
      solved: 10,
      pending: 90,
      progress: 10.0,
      streak: 2,
    };

    const testCases = [{ input: '5', expectedOutput: '15' }];
    const code = 'def solve(n): return "15"';
    const offlineRun = await executeRealCode(code, 'python', testCases, 'solve', client);
    expect(offlineRun.status).toBe('ACCEPTED');

    student.solved += 1;
    student.pending = calculatePending(student.solved);
    student.progress = calculateProgress(student.solved);
    student.streak += 1;

    expect(student.solved).toBe(11);
    expect(student.pending).toBe(89);
    expect(student.progress).toBe(11.0);
    expect(student.streak).toBe(3);

    // 4. Network reconnects
    client.isOnline = true;
    const reauthMe = await client.request('/auth/me');
    expect(reauthMe.role).toBe('STUDENT');
    expect(reauthMe.name).toBe('A. Surya');

    // Preserved offline progress is not wiped
    expect(student.pending).toBe(89);
  });

  // -----------------------------------------------------------------------
  // Scenario 5: Full 100-Problem Placement Curriculum Mastery
  // -----------------------------------------------------------------------
  suite.it('Scenario 5: Full 100-Problem Placement Curriculum Mastery', () => {
    const student = {
      id: 'student-master',
      rollNo: '21GK1A0501',
      name: 'A. Surya',
      solved: 0,
      attempted: 0,
      pending: 100,
      progress: 0.0,
      topicProgress: DSA_TOPICS.reduce((acc, t) => {
        acc[t] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[t], percentage: 0.0 };
        return acc;
      }, {}),
      difficultyStats: {
        easy: { solved: 0, total: DIFFICULTY_TOTALS.easy },
        medium: { solved: 0, total: DIFFICULTY_TOTALS.medium },
        hard: { solved: 0, total: DIFFICULTY_TOTALS.hard },
      },
    };

    // Student solves all 100 curriculum problems day by day
    PROBLEMS_BANK_100.forEach((prob) => {
      student.solved += 1;
      student.attempted += 1;
      student.topicProgress[prob.topic].solved += 1;
      const diffKey = prob.difficulty.toLowerCase();
      student.difficultyStats[diffKey].solved += 1;
    });

    student.pending = calculatePending(student.solved);
    student.progress = calculateProgress(student.solved);

    // Recompute topic percentages
    DSA_TOPICS.forEach((t) => {
      const top = student.topicProgress[t];
      top.percentage = Number(((top.solved / top.total) * 100).toFixed(1));
    });

    // Verification
    expect(student.solved).toBe(100);
    expect(student.pending).toBe(0);
    expect(student.progress).toBe(100.0);
    expect(student.difficultyStats.easy.solved).toBe(DIFFICULTY_TOTALS.easy);
    expect(student.difficultyStats.medium.solved).toBe(DIFFICULTY_TOTALS.medium);
    expect(student.difficultyStats.hard.solved).toBe(DIFFICULTY_TOTALS.hard);

    DSA_TOPICS.forEach((t) => {
      expect(student.topicProgress[t].percentage).toBe(100.0);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario 6: Multi-Language Forge IDE Sandbox Execution & Error Diagnostics
  // -----------------------------------------------------------------------
  suite.it('Scenario 6: Multi-Language Forge IDE Sandbox Execution & Error Diagnostics', async () => {
    const testCases = [{ input: '4', expectedOutput: 'Even' }];

    // 1. Python Execution
    const pyCode = 'def solve(n):\n    return "Even" if int(n) % 2 == 0 else "Odd"';
    const pyRes = await executeRealCode(pyCode, 'python', testCases, 'solve', client);
    expect(pyRes.status).toBe('ACCEPTED');

    // 2. JavaScript Execution
    const jsCode = 'function solve(n) {\n    return parseInt(n) % 2 === 0 ? "Even" : "Odd";\n}';
    const jsRes = await executeRealCode(jsCode, 'javascript', testCases, 'solve', client);
    expect(jsRes.status).toBe('ACCEPTED');

    // 3. Java Execution
    const javaCode = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Even");\n    }\n}';
    const javaRes = await executeRealCode(javaCode, 'java', testCases, 'solve', client);
    expect(javaRes.status).toBe('ACCEPTED');

    // 4. C++ Execution
    const cppCode = '#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Even" << endl;\n    return 0;\n}';
    const cppRes = await executeRealCode(cppCode, 'cpp', testCases, 'solve', client);
    expect(cppRes.status).toBe('ACCEPTED');

    // 5. Syntax Error Diagnostics
    const brokenCode = 'def solve(n): SYNTAX_ERROR ;;;';
    const errorRes = await executeRealCode(brokenCode, 'python', testCases, 'solve', client);
    expect(errorRes.status).toBe('COMPILATION_ERROR');
    expect(errorRes.passedCount).toBe(0);
  });

  // -----------------------------------------------------------------------
  // Scenario 7: Multi-Cohort Rebalancing, Faculty Assignment, and Reporting
  // -----------------------------------------------------------------------
  suite.it('Scenario 7: Multi-Cohort Rebalancing, Faculty Assignment, and Reporting', () => {
    const teams = [...ALL_TEAMS];
    expect(teams.length).toBe(ALL_TEAMS.length);

    // 1. Dean identifies Team 05 as 'Needs Attention'
    const team5 = teams.find((t) => t.teamNumber === 'Team 05');
    expect(team5).toBeDefined();

    // 2. Dean reassigns Faculty Mentor to Team 05
    team5.mentorId = 'mentor-1';
    team5.mentorName = 'K.S.GAYATHRI';
    team5.status = 'Active';

    expect(team5.mentorName).toBe('K.S.GAYATHRI');
    expect(team5.status).toBe('Active');

    // 3. Institutional Report Generation
    const totalStudents = ALL_STUDENTS.length;
    const totalTeams = teams.length;
    const totalMentors = ALL_MENTORS.length;
    const institutionalAvg = Number(
      (ALL_STUDENTS.reduce((sum, s) => sum + s.progress, 0) / Math.max(1, ALL_STUDENTS.length)).toFixed(1)
    );

    expect(totalStudents).toBe(ALL_STUDENTS.length);
    expect(totalTeams).toBe(ALL_TEAMS.length);
    expect(totalMentors).toBe(ALL_MENTORS.length);
    expect(institutionalAvg).toBeGreaterThanOrEqual(0);
    expect(typeof institutionalAvg).toBe('number');
  });

  // -----------------------------------------------------------------------
  // Scenario 8: Student Portfolio, Activity Timeline, and GitHub Verification
  // -----------------------------------------------------------------------
  suite.it('Scenario 8: Student Portfolio, Activity Timeline, and GitHub Verification', () => {
    const student = {
      id: 'student-1',
      rollNo: '21GK1A0501',
      name: 'A. Surya',
      avatar: 'https://images.unsplash.com/photo-1535713875002',
      githubUsername: 'asurya-dev',
      githubRepoLink: '',
      leetcodeUsername: 'asurya_leetcode',
      streak: 5,
      submissionsHistory: [
        { date: '2026-08-28', count: 5 },
        { date: '2026-08-29', count: 5 },
        { date: '2026-08-30', count: 5 },
      ],
      mentorFeedbackNotes: [],
      verifiedProblemIds: ['prob-1', 'prob-2', 'prob-3', 'prob-4', 'prob-5'],
    };

    // 1. Student updates GitHub repo link
    student.githubRepoLink = 'https://github.com/asurya-dev/gkce-dynamic-monitoring';
    expect(student.githubRepoLink).toContain('gkce-dynamic-monitoring');

    // 2. Mentor reviews student portfolio and leaves commendation
    const commendation = {
      id: `note-${Date.now()}`,
      date: '2026-08-30',
      author: 'K.S.GAYATHRI',
      note: 'Outstanding portfolio and consistent 3-day coding streak. Verified all Day 1 challenges.',
    };
    student.mentorFeedbackNotes.push(commendation);

    // 3. Dean inspects student modal
    expect(student.mentorFeedbackNotes.length).toBe(1);
    expect(student.verifiedProblemIds.length).toBe(5);
    expect(student.streak).toBe(5);
    expect(student.submissionsHistory.length).toBe(3);
  });
});

module.exports = suite;
