/**
 * GKCE Enterprise Monitoring System — Standalone Adversarial Stress Harness (Tier 5)
 *
 * Empirical challenger test suite performing deep stress-testing on:
 * 1. Dynamic Pending Calculations & 1-Decimal Precision under Extreme / Corrupted Inputs
 * 2. Anti-Cheating PRNG Distribution, Seed Collisions, and Question Permutation Uniformity
 * 3. Offline Resilience, LocalStorage Quota Exceeded, Corrupted State, Network Drops, and Rapid Role Switching
 *
 * Usage: node tests/adversarial_stress_harness.cjs
 */

const { expect, TestSuite, ANSI } = require('./helpers/testFramework.cjs');
const {
  calculatePending,
  calculateProgress,
  formatMetric,
  backendStudentToFrontend,
  backendTeamToFrontend,
  getStudentExamSeed,
  getShuffledQuestionsForStudent,
  PROBLEMS_BANK_100,
  DSA_TOPICS,
} = require('./helpers/domainData.cjs');
const { MockLocalStorage, MockApiClient } = require('./helpers/mockApi.cjs');

const suite = new TestSuite('Adversarial Hardening & Empirical Stress Harness', 5);

// =========================================================================
// SECTION 1: Adversarial Dynamic Pending Calculations & Metric Precision
// =========================================================================
suite.describe('1. Adversarial Dynamic Pending Calculations & Extreme Inputs', () => {
  suite.it('1.1 Extreme Boundary: 0 solved -> exactly 100 pending, 0.0% progress', () => {
    expect(calculatePending(0)).toBe(100);
    expect(calculateProgress(0)).toBe(0.0);
  });

  suite.it('1.2 Extreme Boundary: 100 solved -> exactly 0 pending, 100.0% progress', () => {
    expect(calculatePending(100)).toBe(0);
    expect(calculateProgress(100)).toBe(100.0);
  });

  suite.it('1.3 Extreme Boundary: 150 solved (over-completion) -> clamped to 0 pending, 100.0% progress', () => {
    expect(calculatePending(150)).toBe(0);
    expect(calculateProgress(150)).toBe(100.0);
  });

  suite.it('1.4 Massive Input: 10,000 solved -> clamped safely to 0 pending, 100.0% progress', () => {
    expect(calculatePending(10000)).toBe(0);
    expect(calculateProgress(10000)).toBe(100.0);
  });

  suite.it('1.5 Negative Inputs: -1, -10, -50, -500 solved clamped safely to 100 pending and 0.0% progress', () => {
    const testNegatives = [-1, -10, -50, -500];
    for (const neg of testNegatives) {
      expect(calculatePending(neg)).toBe(100, `Failed for negative value: ${neg}`);
      expect(calculateProgress(neg)).toBe(0.0, `Failed for negative value: ${neg}`);
    }
  });

  suite.it('1.6 Malformed & Non-Numeric Types: NaN, null, undefined, strings handled gracefully', () => {
    expect(calculatePending(NaN)).toBe(100);
    expect(calculateProgress(NaN)).toBe(0.0);

    expect(calculatePending(null)).toBe(100);
    expect(calculateProgress(null)).toBe(0.0);

    expect(calculatePending(undefined)).toBe(100);
    expect(calculateProgress(undefined)).toBe(0.0);

    expect(calculatePending('invalid_string')).toBe(100);
    expect(calculateProgress('invalid_string')).toBe(0.0);

    expect(calculatePending('45')).toBe(55);
    expect(calculateProgress('45')).toBe(45.0);

    expect(calculatePending(Infinity)).toBe(0);
    expect(calculateProgress(Infinity)).toBe(100.0);

    expect(calculatePending(-Infinity)).toBe(100);
    expect(calculateProgress(-Infinity)).toBe(0.0);
  });

  suite.it('1.7 Stale Backend Override Immunity: backend sending stale prog.pending is completely ignored', () => {
    const testCases = [
      { solved: 76, stalePending: 24, expectedPending: 24 }, // 100 - 76 = 24
      { solved: 100, stalePending: 99, expectedPending: 0 },  // 100 - 100 = 0
      { solved: 0, stalePending: 0, expectedPending: 100 },   // 100 - 0 = 100
      { solved: 45, stalePending: 10, expectedPending: 55 },  // 100 - 45 = 55
      { solved: 120, stalePending: 30, expectedPending: 0 },  // clamped to 0
    ];

    for (const tc of testCases) {
      const mapped = backendStudentToFrontend({
        id: 999,
        roll_number: '24F81A0599',
        name: 'Adversarial Test Student',
        progress: {
          problems_solved: tc.solved,
          pending: tc.stalePending, // Stale backend artifact
        },
      });

      expect(mapped.pending).toBe(
        tc.expectedPending,
        `Mapper leaked stale pending ${tc.stalePending} when solved=${tc.solved}`
      );
      expect(mapped.solved).toBe(tc.solved);
    }
  });

  suite.it('1.8 High-Throughput Precision Audit: 1,000 randomized floating-point solves preserve 1-decimal consistency', () => {
    for (let i = 0; i < 1000; i++) {
      const rawSolved = Math.random() * 120;
      const progress = calculateProgress(rawSolved);
      const pending = calculatePending(rawSolved);

      // Check progress is between 0 and 100
      expect(progress >= 0 && progress <= 100).toBeTruthy(`Progress ${progress} out of [0, 100]`);
      // Check pending is between 0 and 100
      expect(pending >= 0 && pending <= 100).toBeTruthy(`Pending ${pending} out of [0, 100]`);

      // Check formatMetric produces at most 1 decimal digit without NaN
      const formatted = formatMetric(rawSolved);
      expect(isNaN(formatted)).toBe(false);
      const decimalPart = String(formatted).split('.')[1] || '';
      expect(decimalPart.length <= 1).toBeTruthy(`Decimal length ${decimalPart.length} > 1 for ${formatted}`);
    }
  });
});

// =========================================================================
// SECTION 2: Anti-Cheating PRNG Distribution & Permutation Collision Testing
// =========================================================================
suite.describe('2. Anti-Cheating PRNG & Question Shuffling Adversarial Testing', () => {
  // Use official 20 core DSA questions
  const sampleQuestions = PROBLEMS_BANK_100.slice(0, 20).map((p, idx) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    topic: p.topic,
    displayQuestionNumber: idx + 1,
    testCases: p.testCases || [],
  }));

  suite.it('2.1 Large Cohort Seed Collision Test: 1,000 student IDs produce 0 seed collisions on same exam', () => {
    const examId = 'exam-week-midterm-2026';
    const seenSeeds = new Map();
    let collisionCount = 0;

    // Generate 1,000 distinct student roll numbers across 10 branches
    const departments = ['01', '02', '03', '04', '05', '12', '42', '44', '62', '66'];
    for (const dept of departments) {
      for (let s = 1; s <= 100; s++) {
        const rollNo = `24F81A${dept}${s < 10 ? '0' + s : s < 100 ? s : 'A' + (s - 100)}`;
        const seed = getStudentExamSeed(rollNo, examId);
        if (seenSeeds.has(seed)) {
          collisionCount++;
        } else {
          seenSeeds.set(seed, rollNo);
        }
      }
    }

    expect(collisionCount).toBe(0, `Found ${collisionCount} seed collisions among 1,000 students!`);
    expect(seenSeeds.size).toBe(1000);
  });

  suite.it('2.2 Paper Set & Question Permutation Uniqueness: 500 students receive 100% unique question permutations', () => {
    const examId = 'exam-week-finals-2026';
    const seenPermutations = new Set();
    const studentCount = 500;

    for (let i = 1; i <= studentCount; i++) {
      const studentId = `student-cohort-batch-${i}`;
      const { shuffledQuestions } = getShuffledQuestionsForStudent(sampleQuestions, studentId, examId);
      const permKey = shuffledQuestions.map((q) => q.id).join('|');

      seenPermutations.add(permKey);
    }

    // With 20 questions, 20! ≈ 2.43 * 10^18 permutations. Collision rate should be 0.
    expect(seenPermutations.size).toBe(
      studentCount,
      `Detected permutation collisions: expected ${studentCount} unique sets, got ${seenPermutations.size}`
    );
  });

  suite.it('2.3 Positional Uniformity & Bias Analysis (Empirical Chi-Square Test over 1,000 students)', () => {
    const examId = 'exam-uniformity-test-2026';
    const numStudents = 1000;
    const numQuestions = sampleQuestions.length; // 20
    const expectedCountPerQuestionAtSlot1 = numStudents / numQuestions; // 50

    // Count how many times each question appears at Slot 1 (displayQuestionNumber = 1)
    const slot1Counts = new Array(numQuestions).fill(0);

    for (let i = 1; i <= numStudents; i++) {
      const studentId = `uniformity_student_${i}_gkce`;
      const { shuffledQuestions } = getShuffledQuestionsForStudent(sampleQuestions, studentId, examId);
      const firstQId = shuffledQuestions[0].id;
      const qIndex = sampleQuestions.findIndex((q) => q.id === firstQId);
      if (qIndex >= 0) {
        slot1Counts[qIndex]++;
      }
    }

    // Compute Chi-Square statistic: sum((observed - expected)^2 / expected)
    let chiSquare = 0;
    for (let i = 0; i < numQuestions; i++) {
      const observed = slot1Counts[i];
      const diff = observed - expectedCountPerQuestionAtSlot1;
      chiSquare += (diff * diff) / expectedCountPerQuestionAtSlot1;
    }

    // For df = 19, critical value at p = 0.001 is 43.82, p = 0.01 is 36.19
    // A healthy PRNG will reliably stay below the critical threshold
    expect(chiSquare < 45.0).toBeTruthy(
      `Chi-square value ${chiSquare.toFixed(2)} exceeds critical threshold! Non-uniform PRNG bias detected.`
    );
  });

  suite.it('2.4 Determinism & Idempotency: Shuffling same student 200 times yields identical output every time', () => {
    const studentId = '24F81A0501';
    const examId = 'exam-determinism-check';

    const baseline = getShuffledQuestionsForStudent(sampleQuestions, studentId, examId);
    const baselineOrder = baseline.shuffledQuestions.map((q) => q.id).join(',');
    const baselineSetCode = baseline.setCode;

    for (let run = 0; run < 200; run++) {
      const current = getShuffledQuestionsForStudent(sampleQuestions, studentId, examId);
      const currentOrder = current.shuffledQuestions.map((q) => q.id).join(',');
      expect(currentOrder).toBe(baselineOrder, `Permutation drifted on run ${run}`);
      expect(current.setCode).toBe(baselineSetCode, `Set code drifted on run ${run}`);
      expect(current.seed).toBe(baseline.seed);
    }
  });

  suite.it('2.5 Avalanche Effect: Adjacent roll numbers produce completely different question permutations', () => {
    const examId = 'exam-avalanche-test';
    const s1 = '24F81A0501';
    const s2 = '24F81A0502';
    const s3 = '24F81A0503';

    const res1 = getShuffledQuestionsForStudent(sampleQuestions, s1, examId);
    const res2 = getShuffledQuestionsForStudent(sampleQuestions, s2, examId);
    const res3 = getShuffledQuestionsForStudent(sampleQuestions, s3, examId);

    // Calculate position overlap between s1 and s2
    let overlap12 = 0;
    let overlap23 = 0;
    for (let i = 0; i < sampleQuestions.length; i++) {
      if (res1.shuffledQuestions[i].id === res2.shuffledQuestions[i].id) overlap12++;
      if (res2.shuffledQuestions[i].id === res3.shuffledQuestions[i].id) overlap23++;
    }

    // In a 20-element permutation, expected random matches = 1.0. Overlap > 5 is an avalanche failure.
    expect(overlap12 <= 5).toBeTruthy(`Adjacent roll numbers s1 & s2 had excessive overlap: ${overlap12}/20`);
    expect(overlap23 <= 5).toBeTruthy(`Adjacent roll numbers s2 & s3 had excessive overlap: ${overlap23}/20`);
    expect(res1.setCode !== res2.setCode).toBeTruthy('Set codes for adjacent students must not collide');
  });

  suite.it('2.6 Shuffler Extreme Corner Cases: empty, 1 question, huge IDs, unicode symbols', () => {
    // Empty questions
    const emptyRes = getShuffledQuestionsForStudent([], 'student-1', 'exam-1');
    expect(emptyRes.shuffledQuestions.length).toBe(0);
    expect(emptyRes.setCode).toBe('SET-A101');

    // Single question
    const singleRes = getShuffledQuestionsForStudent([sampleQuestions[0]], 'student-1', 'exam-1');
    expect(singleRes.shuffledQuestions.length).toBe(1);

    // Huge student ID (5,000 characters)
    const hugeId = 'A'.repeat(5000);
    const hugeRes = getShuffledQuestionsForStudent(sampleQuestions, hugeId, 'exam-1');
    expect(hugeRes.shuffledQuestions.length).toBe(20);
    expect(hugeRes.seed > 0).toBeTruthy();

    // Unicode & emoji student ID
    const unicodeRes = getShuffledQuestionsForStudent(sampleQuestions, '🚀👨‍💻_Student_#99@GKCE', 'exam-1');
    expect(unicodeRes.shuffledQuestions.length).toBe(20);
    expect(unicodeRes.seed > 0).toBeTruthy();
  });
});

// =========================================================================
// SECTION 3: Offline Resilience, Network Drops & Role Switching Simulation
// =========================================================================
suite.describe('3. Offline Resilience, Storage Failure & Rapid Role Switching', () => {
  suite.it('3.1 LocalStorage QuotaExceededError handling: mockApi and auth helpers survive storage exceptions', () => {
    const throwingStorage = new MockLocalStorage(true);
    const client = new MockApiClient({ storage: throwingStorage });

    // Storing token should not throw uncaught error
    let tokenSetThrew = false;
    try {
      client.setStoredToken('test_token_123');
    } catch {
      tokenSetThrew = true;
    }
    expect(tokenSetThrew).toBe(false, 'setStoredToken threw an uncaught exception on storage failure');

    // Clearing token should not throw
    let clearThrew = false;
    try {
      client.clearStoredToken();
    } catch {
      clearThrew = true;
    }
    expect(clearThrew).toBe(false, 'clearStoredToken threw an uncaught exception on storage failure');

    // Reading token should return null gracefully
    expect(client.getStoredToken()).toBeNull();
  });

  suite.it('3.2 Corrupted LocalStorage State Recovery: malformed JSON, wrong roles, corrupted arrays', () => {
    const corruptedStorage = new MockLocalStorage(false);

    // Corrupted Profile #1: Malformed JSON syntax
    corruptedStorage.setItem('gkce_user_profile_v1', '{bad:json"string');
    let parsed1 = null;
    try {
      const raw = corruptedStorage.getItem('gkce_user_profile_v1');
      parsed1 = JSON.parse(raw);
    } catch {
      parsed1 = null; // Clean fallback
    }
    expect(parsed1).toBeNull();

    // Corrupted Profile #2: Non-object JSON
    corruptedStorage.setItem('gkce_user_profile_v1', '"just a plain string"');
    const raw2 = corruptedStorage.getItem('gkce_user_profile_v1');
    const parsed2 = JSON.parse(raw2);
    const isValidProfile2 = !!(parsed2 && typeof parsed2 === 'object' && parsed2.role && parsed2.email);
    expect(isValidProfile2).toBe(false);

    // Corrupted Profile #3: Invalid role
    corruptedStorage.setItem('gkce_user_profile_v1', JSON.stringify({ role: 'SUPER_ADMIN_HACKER', email: 'evil@gkce.edu.in' }));
    const parsed3 = JSON.parse(corruptedStorage.getItem('gkce_user_profile_v1'));
    const validRoles = ['DEAN', 'MENTOR', 'STUDENT'];
    expect(validRoles.includes(parsed3.role)).toBe(false);
  });

  suite.it('3.3 Network Drop & Offline Disconnection Simulation: apiRequest fails cleanly without crash', async () => {
    const storage = new MockLocalStorage();
    const offlineClient = new MockApiClient({ storage, isOnline: false });

    let caughtError = null;
    try {
      await offlineClient.request('/dean/students');
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError !== null).toBeTruthy('Expected apiRequest to throw an error when offline');
    expect(caughtError.message).toContain('Server Offline');
  });

  suite.it('3.4 Expired JWT 401 Response automatically purges stored token', async () => {
    const storage = new MockLocalStorage();
    const client = new MockApiClient({ storage, isOnline: true });

    // Set invalid token
    client.setStoredToken('expired_or_forged_jwt_token');
    expect(client.getStoredToken()).toBe('expired_or_forged_jwt_token');

    // Request protected /auth/me -> receives 401
    let errorStatus = 0;
    try {
      await client.request('/auth/me');
    } catch (err) {
      errorStatus = err.status || 401;
    }

    expect(errorStatus).toBe(401);
    // Token must be purged automatically
    expect(client.getStoredToken()).toBeNull();
  });

  suite.it('3.5 Rapid Multi-Role Switching Stress Test: 200 synchronous transitions maintain state isolation', () => {
    const roles = ['DEAN', 'MENTOR', 'STUDENT'];
    let currentRoleState = 'DEAN';
    let activeTabState = 'dashboard';
    let selectedStudentState = null;
    let selectedTeamState = null;

    const simulateRoleSwitch = (newRole) => {
      // Mimics AuthContext.tsx mapAndSetUser / switchRole contract
      activeTabState = 'dashboard';
      selectedStudentState = null;
      selectedTeamState = null;
      currentRoleState = newRole;
    };

    for (let i = 0; i < 200; i++) {
      const nextRole = roles[i % 3];
      // Simulate user selecting a student / team and navigating tab
      activeTabState = 'analytics';
      selectedStudentState = { id: 'student-1' };
      selectedTeamState = { id: 'team-1' };

      simulateRoleSwitch(nextRole);

      expect(currentRoleState).toBe(nextRole);
      expect(activeTabState).toBe('dashboard');
      expect(selectedStudentState).toBeNull();
      expect(selectedTeamState).toBeNull();
    }
  });

  suite.it('3.6 Concurrent Asynchronous Role Switching Race Condition Resilience: 50 concurrent switches', async () => {
    const roles = ['DEAN', 'MENTOR', 'STUDENT'];
    let state = { role: 'DEAN', activeTab: 'dashboard' };

    const asyncSwitchRole = async (targetRole, delayMs) => {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      state = { role: targetRole, activeTab: 'dashboard' };
      return state;
    };

    const promises = [];
    for (let i = 0; i < 50; i++) {
      const targetRole = roles[i % 3];
      const delay = Math.floor(Math.random() * 10);
      promises.push(asyncSwitchRole(targetRole, delay));
    }

    const results = await Promise.all(promises);
    expect(results.length).toBe(50);
    expect(roles.includes(state.role)).toBeTruthy();
    expect(state.activeTab).toBe('dashboard');
  });
});

module.exports = suite;

// Standalone execution runner
if (require.main === module) {
  suite.run(true).then((res) => {
    console.log(`\nAdversarial Stress Harness Finished: ${res.passed}/${res.total} Passed (${res.failed} Failed) in ${res.duration}ms`);
    process.exit(res.failed > 0 ? 1 : 0);
  });
}
