import { WeeklyExam, ExamQuestion, StudentExamSubmission, Problem } from '../types';
import { ALL_STUDENTS } from './mockData';
import { PROBLEMS_BANK_100 } from './dsaCurriculum100';

export interface ExamTierInfo {
  tier: 'EASY' | 'MEDIUM' | 'HARD';
  tierBadge: string;
  tierColor: string;
  description: string;
}

/**
 * Computes progressive difficulty tier based on exam week number:
 * - Weeks 1 to 3: EASY Test Cases (Foundational)
 * - Weeks 4 to 6: MEDIUM Test Cases (Placement Intermediate)
 * - Weeks 7+: HARD Test Cases (Product/Tier-1 Advanced)
 */
export const getExamTier = (weekNumber: number): ExamTierInfo => {
  if (weekNumber <= 3) {
    return {
      tier: 'EASY',
      tierBadge: '🟢 Tier 1: Easy Foundations (Weeks 1–3)',
      tierColor: 'emerald',
      description: 'Elementary test cases: Small positive integers, basic array traversals, simple parity/digit operations.',
    };
  }
  if (weekNumber <= 6) {
    return {
      tier: 'MEDIUM',
      tierBadge: '🟡 Tier 2: Medium Placement (Weeks 4–6)',
      tierColor: 'amber',
      description: 'Intermediate test cases: Negative numbers, boundary pointers, sliding window, zero handling, duplicate checks.',
    };
  }
  return {
    tier: 'HARD',
    tierBadge: '🔴 Tier 3: Hard Product-Level (Weeks 7+)',
    tierColor: 'rose',
    description: 'Advanced test cases: Deep tree recursion, cyclic/disconnected graphs, 2D DP matrices, 10^5 constraint benchmarks.',
  };
};

/**
 * Utility: Convert a Curriculum Problem (from 100 Question Bank) into an ExamQuestion
 * with tier-specific progressive test cases (Easy for W1-3, Medium for W4-6, Hard for W7+).
 */
export const convertProblemToExamQuestion = (
  problem: Problem,
  questionNumber: number,
  marks: number = 5,
  weekNumber: number = 2
): ExamQuestion => {
  const cleanMethodName = problem.title
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .slice(0, 4)
    .map((w, idx) => (idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join('') || 'solve';

  const tierInfo = getExamTier(weekNumber);

  // Progressive test cases generation based on Tier
  let testCases = [
    { input: 'Sample Input 1', output: 'Expected Output 1', isHidden: false },
    { input: 'Sample Input 2', output: 'Expected Output 2', isHidden: false },
    { input: 'Hidden Benchmark Validation', output: 'Private Test Case Result', isHidden: true },
  ];

  if (tierInfo.tier === 'EASY') {
    testCases = [
      { input: 'Input: 5, [1, 2, 3, 4, 5]', output: '15', isHidden: false },
      { input: 'Input: 121 (Standard positive)', output: 'true', isHidden: false },
      { input: 'Input: [10, 20, 30]', output: '30', isHidden: false },
      { input: 'Hidden: 100 (Clean arithmetic range)', output: '5050', isHidden: true },
    ];
  } else if (tierInfo.tier === 'MEDIUM') {
    testCases = [
      { input: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', isHidden: false },
      { input: 'Input: [0, 1, 0, 3, 12] (Zeros & Duplicates)', output: '[1, 3, 12, 0, 0]', isHidden: false },
      { input: 'Input: [1, 2, 3, 4, 5, 6, 7], k = 3', output: '[5, 6, 7, 1, 2, 3, 4]', isHidden: false },
      { input: 'Hidden: [-100000, 50000, -20000, 99999]', output: '129999', isHidden: true },
    ];
  } else {
    // HARD Tier
    testCases = [
      { input: 'Input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] (Rainwater Trapping)', output: '6', isHidden: false },
      { input: 'Input: Graph V=1000, E=4500 (Cycle & Bipartite Check)', output: 'true', isHidden: false },
      { input: 'Input: N=100000, Memoized 2D Knapsack Bounds', output: '40592', isHidden: false },
      { input: 'Hidden: Anti-Plagiarism Multi-Branch Stress Vector (N=10^5)', output: 'Optimal Target 8421', isHidden: true },
    ];
  }

  return {
    id: `exam-q-${problem.id}`,
    questionNumber,
    title: problem.title,
    topic: problem.topic,
    difficulty: tierInfo.tier === 'EASY' ? 'Easy' : tierInfo.tier === 'MEDIUM' ? 'Medium' : 'Hard',
    marks: marks,
    originalProblemId: problem.id,
    description: problem.description || `Given constraints and inputs for ${problem.title}, implement an optimal solution satisfying ${tierInfo.tier.toLowerCase()} tier test constraints.`,
    starterCode: {
      java: `class Solution {\n    public int ${cleanMethodName}(int[] nums) {\n        // Tier: ${tierInfo.tier} | Problem: ${problem.title}\n        return 0;\n    }\n}`,
      cpp: `class Solution {\npublic:\n    int ${cleanMethodName}(vector<int>& nums) {\n        // Tier: ${tierInfo.tier} | Problem: ${problem.title}\n        return 0;\n    }\n};`,
      python: `class Solution:\n    def ${cleanMethodName}(self, nums: list[int]) -> int:\n        # Tier: ${tierInfo.tier} | Problem: ${problem.title}\n        return 0`,
    },
    testCases,
  };
};

/**
 * Deterministic Pseudo-Random Generator (Mulberry32) for student question randomization.
 */
export const getStudentExamSeed = (studentIdentifier: string, examId: string): number => {
  const cleanId = (studentIdentifier || 'STUDENT_DEFAULT').trim().toLowerCase();
  const str = `${cleanId}:::${examId}:::gkce-anti-cheating-salt-2026`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Shuffles exam questions specifically for a given student so NO TWO STUDENTS have the same question order.
 */
export const getShuffledQuestionsForStudent = (
  questions: ExamQuestion[],
  studentIdentifier: string,
  examId: string
): { shuffledQuestions: ExamQuestion[]; setCode: string; seed: number } => {
  if (!questions || questions.length <= 1) {
    return {
      shuffledQuestions: questions || [],
      setCode: 'SET-A101',
      seed: 0,
    };
  }

  const seed = getStudentExamSeed(studentIdentifier, examId);
  const shuffled = [...questions];

  let s = seed;
  const pseudoRandom = () => {
    let t = (s += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  const setLetter = String.fromCharCode(65 + (seed % 26));
  const setNumber = ((seed >> 3) % 900) + 100;
  const setCode = `SET-${setLetter}${setNumber}`;

  const mappedQuestions = shuffled.map((q, idx) => ({
    ...q,
    displayQuestionNumber: idx + 1,
  }));

  return {
    shuffledQuestions: mappedQuestions,
    setCode,
    seed,
  };
};

/**
 * Week 01: Easy Tier (Days 1–4: Math & Basic Loops - 20 Easy Problems)
 */
export const WEEK_01_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(0, 20).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 1)
);

/**
 * Week 02: Easy Tier (Days 5–8: Array Basics & Number Logic - 20 Easy Problems) [LIVE NOW]
 */
export const WEEK_02_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(20, 40).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 2)
);

/**
 * Week 03: Easy Tier (Days 9–12: Simple Strings & Searches - 20 Easy Problems)
 */
export const WEEK_03_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(40, 60).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 3)
);

/**
 * Week 04: Medium Tier (Days 13–16: Two Pointers, Subarrays & Sliding Window - 20 Medium Problems)
 */
export const WEEK_04_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(60, 80).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 4)
);

/**
 * Week 05: Medium Tier (Days 17–20: Linked Lists, Stacks & Queues - 20 Medium Problems)
 */
export const WEEK_05_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(70, 90).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 5)
);

/**
 * Week 06: Medium Tier (Binary Search, Sorting Variations & Hashing - 20 Medium Problems)
 */
export const WEEK_06_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(50, 70).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 6)
);

/**
 * Week 07: Hard Tier (Trees, Graphs & Dynamic Programming - 20 Hard Problems)
 */
export const WEEK_07_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(80, 100).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 7)
);

/**
 * Week 08: Hard Tier (Multi-Dimensional DP & Advanced Graph Structures - 20 Hard Problems)
 */
export const WEEK_08_QUESTIONS: ExamQuestion[] = PROBLEMS_BANK_100.slice(80, 100).map((prob, idx) =>
  convertProblemToExamQuestion(prob, idx + 1, 5, 8)
);

// Generate authentic Week 1 submissions for all 46 GKCE Students
const generateWeek1Submissions = (): StudentExamSubmission[] => {
  return ALL_STUDENTS.map((st, idx) => {
    const baseScore = 70 + ((idx * 7) % 31);
    const score = Math.min(100, Math.max(50, baseScore));
    const totalQuestions = 20;
    const solvedCount = Math.round((score / 100) * totalQuestions);
    const { setCode } = getShuffledQuestionsForStudent(WEEK_01_QUESTIONS, st.rollNo || st.id, 'exam-week-01');

    return {
      id: `sub-w1-${st.id}`,
      studentId: st.id,
      studentName: st.name,
      studentRollNo: st.rollNo,
      teamNumber: st.teamNumber,
      examId: 'exam-week-01',
      randomizedSetCode: setCode,
      status: 'EVALUATED',
      score: score,
      totalMarks: 100,
      questionsSolved: solvedCount,
      passedCount: solvedCount,
      totalQuestionCount: totalQuestions,
      submittedAt: '2026-08-16T11:45:00.000Z',
      timeSpentMinutes: 42 + (idx % 18),
    };
  });
};

export const INITIAL_WEEKLY_EXAMS: WeeklyExam[] = [
  {
    id: 'exam-week-01',
    weekNumber: 1,
    tier: 'EASY',
    tierBadge: '🟢 Tier 1: Easy Test Cases (Weeks 1–3)',
    title: 'Week 01 Assessment: Basic Math & Number Logic (20 Easy Problems)',
    description: 'Foundational 20-problem evaluation with Easy test cases covering parity, digits, primes, and basic loop checks.',
    topicFocus: 'Basics, Loops & Number Logic (Days 1–4)',
    scheduledDate: '2026-08-16',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'COMPLETED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_01_QUESTIONS,
    submissions: generateWeek1Submissions(),
  },
  {
    id: 'exam-week-02',
    weekNumber: 2,
    tier: 'EASY',
    tierBadge: '🟢 Tier 1: Easy Test Cases (Weeks 1–3)',
    title: 'Week 02 Assessment: Array Basics & Traversal (20 Easy Problems)',
    description: 'Live foundational assessment with Easy test cases & dynamic anti-cheating shuffling across array traversal, min/max, and frequency counting.',
    topicFocus: 'Array Fundamentals & Operations (Days 5–8)',
    scheduledDate: '2026-08-23',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'LIVE',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_02_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-03',
    weekNumber: 3,
    tier: 'EASY',
    tierBadge: '🟢 Tier 1: Easy Test Cases (Weeks 1–3)',
    title: 'Week 03 Assessment: String Processing & Linear Searches (20 Easy Problems)',
    description: 'Final Easy-tier assessment testing string manipulation, case conversions, and elementary search boundaries.',
    topicFocus: 'Strings, Hashing & Binary Search (Days 9–12)',
    scheduledDate: '2026-08-30',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_03_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-04',
    weekNumber: 4,
    tier: 'MEDIUM',
    tierBadge: '🟡 Tier 2: Medium Test Cases (Weeks 4–6)',
    title: 'Week 04 Assessment: Two Pointers, Subarrays & Sliding Window (20 Medium Problems)',
    description: 'Placement-tier transition with Medium test cases: negative numbers, duplicate handling, and sliding window boundaries.',
    topicFocus: 'Two Pointers & Subarrays (Days 13–16)',
    scheduledDate: '2026-09-06',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_04_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-05',
    weekNumber: 5,
    tier: 'MEDIUM',
    tierBadge: '🟡 Tier 2: Medium Test Cases (Weeks 4–6)',
    title: 'Week 05 Assessment: Linked Lists, Stack & Queue (20 Medium Problems)',
    description: 'Medium test cases on linked list reversal, slow-fast pointers, monotonic stack checks, and circular queues.',
    topicFocus: 'Linked Lists & Linear Structures (Days 17–20)',
    scheduledDate: '2026-09-13',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_05_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-06',
    weekNumber: 6,
    tier: 'MEDIUM',
    tierBadge: '🟡 Tier 2: Medium Test Cases (Weeks 4–6)',
    title: 'Week 06 Assessment: Binary Search & Sorting Variations (20 Medium Problems)',
    description: 'Medium test cases on search boundaries, rotated sorted arrays, and recursive divide-and-conquer strategies.',
    topicFocus: 'Searching, Sorting & Recursion',
    scheduledDate: '2026-09-20',
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_06_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-07',
    weekNumber: 7,
    tier: 'HARD',
    tierBadge: '🔴 Tier 3: Hard Test Cases (Weeks 7+)',
    title: 'Week 07 Assessment: Trees, Graph Traversals & 1D DP (20 Hard Problems)',
    description: 'Advanced Product/Tier-1 challenge with Hard test cases: deep tree recursion, graph DFS/BFS cycles, and dynamic programming.',
    topicFocus: 'Trees, Graphs & Dynamic Programming (Tier 3)',
    scheduledDate: '2026-09-27',
    startTime: '10:00 AM',
    durationMinutes: 120,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_07_QUESTIONS,
    submissions: [],
  },
  {
    id: 'exam-week-08',
    weekNumber: 8,
    tier: 'HARD',
    tierBadge: '🔴 Tier 3: Hard Test Cases (Weeks 7+)',
    title: 'Week 08 Assessment: Multi-Dimensional DP & Advanced Graphs (20 Hard Problems)',
    description: 'Comprehensive Tier-3 evaluation with high constraint (10^5) stress test cases and competitive benchmark evaluation.',
    topicFocus: '2D DP, Graph Pathfinding & Monotonic Structures',
    scheduledDate: '2026-10-04',
    startTime: '10:00 AM',
    durationMinutes: 120,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Dean of Academic Affairs (SUDO)',
    questions: WEEK_08_QUESTIONS,
    submissions: [],
  },
];
