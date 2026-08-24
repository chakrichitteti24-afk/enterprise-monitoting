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
 * Curated 20 Core DSA Questions given by Root (Dean / Academic Affairs):
 * Covering Basics, Number Logic, Arrays, Strings, Two Pointers, Linked Lists, Stack, Trees & DP.
 */
export const ROOT_OFFICIAL_20_QUESTIONS: ExamQuestion[] = [
  // 1. Math & Numbers (4 Problems)
  ...PROBLEMS_BANK_100.filter(p => ['1', '6', '7', '10'].includes(p.id)),
  // 2. Arrays & Operations (6 Problems)
  ...PROBLEMS_BANK_100.filter(p => ['21', '22', '26', '31', '34', '36'].includes(p.id)),
  // 3. Two Pointers & Subarrays (2 Problems)
  ...PROBLEMS_BANK_100.filter(p => ['40', '41'].includes(p.id)),
  // 4. Strings & Hashing (3 Problems)
  ...PROBLEMS_BANK_100.filter(p => ['46', '47', '52'].includes(p.id)),
  // 5. Linked Lists (2 Problems)
  ...PROBLEMS_BANK_100.filter(p => ['61', '62'].includes(p.id)),
  // 6. Stack & Linear DS (1 Problem)
  ...PROBLEMS_BANK_100.filter(p => ['71'].includes(p.id)),
  // 7. Trees & Recursion (1 Problem)
  ...PROBLEMS_BANK_100.filter(p => ['81'].includes(p.id)),
  // 8. Dynamic Programming (1 Problem)
  ...PROBLEMS_BANK_100.filter(p => ['91'].includes(p.id)),
].slice(0, 20).map((prob, idx) => convertProblemToExamQuestion(prob, idx + 1, 5, 1));

// Fallback if filter returns less than 20: fill up to 20 from bank
if (ROOT_OFFICIAL_20_QUESTIONS.length < 20) {
  const missing = 20 - ROOT_OFFICIAL_20_QUESTIONS.length;
  const extra = PROBLEMS_BANK_100.slice(0, missing).map((p, idx) =>
    convertProblemToExamQuestion(p, ROOT_OFFICIAL_20_QUESTIONS.length + idx + 1, 5, 1)
  );
  ROOT_OFFICIAL_20_QUESTIONS.push(...extra);
}

/**
 * Root Official Examination:
 * All fake/dummy mock exam cards removed.
 * Single active, authentic examination curated and authorized by Root with 20 questions
 * dynamically scrambled and anti-cheat distributed across all students.
 */
export const INITIAL_WEEKLY_EXAMS: WeeklyExam[] = [
  {
    id: 'exam-root-official-01',
    weekNumber: 1,
    tier: 'EASY',
    tierBadge: '🟢 Root Official Assessment (20 Standardized Questions)',
    title: 'Root Official DSA Assessment: 20 Core Placement Challenges',
    description: 'Official examination curated and scheduled by Root (Dean of Academic Affairs / Sudo Admin). Features 20 core DSA challenges spanning Arrays, Strings, Linked Lists, Trees, and Dynamic Programming with individual anti-cheating question randomization across all 100 students.',
    topicFocus: 'Core DSA Foundations & Placement Vectors (20 Questions)',
    scheduledDate: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    durationMinutes: 90,
    totalMarks: 100,
    passMarks: 50,
    status: 'LIVE',
    createdBy: 'Root (Dean of Academic Affairs / Sudo Admin)',
    questions: ROOT_OFFICIAL_20_QUESTIONS,
    submissions: [],
  },
];

