/**
 * Domain Data and Business Logic Module for E2E Test Suite
 * Directly loads or parses project data files from src/data/ and implements
 * authentic core business logic models for testing.
 */

const fs = require('fs');
const path = require('path');

const TOTAL_CURRICULUM_PROBLEMS = 100;
const TOTAL_CURRICULUM_DAYS = 20;
const PROBLEMS_PER_DAY = 5;

const DSA_TOPICS = [
  'Basics',
  'Numbers',
  'Arrays',
  'Strings',
  'Searching',
  'Sorting',
  'Hashing',
  'Two Pointers',
  'Linked Lists',
  'Stack & Queue',
  'Mixed Placement'
];

/**
 * Parses dsaCurriculum100.ts to extract PROBLEMS_BANK_100 and DAILY_TOPIC_THEMES
 */
function loadCurriculumData() {
  const filePath = path.resolve(__dirname, '../../src/data/dsaCurriculum100.ts');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extract DAILY_TOPIC_THEMES
  const themesMatch = fileContent.match(/export const DAILY_TOPIC_THEMES:\s*DailyTopicTheme\[\]\s*=\s*(\[[\s\S]*?\]);/);
  let themes = [];
  if (themesMatch) {
    try {
      themes = JSON.parse(themesMatch[1]);
    } catch (e) {
      themes = eval(themesMatch[1]);
    }
  }

  // Extract PROBLEMS_BANK_100
  const bankMatch = fileContent.match(/export const PROBLEMS_BANK_100:\s*Problem\[\]\s*=\s*(\[[\s\S]*?\]);/);
  let bank = [];
  if (bankMatch) {
    try {
      bank = JSON.parse(bankMatch[1]);
    } catch (e) {
      bank = eval(bankMatch[1]);
    }
  }

  return { themes, bank };
}

const { themes: DAILY_TOPIC_THEMES, bank: PROBLEMS_BANK_100 } = loadCurriculumData();

const TOPIC_CURRICULUM_TOTALS = DSA_TOPICS.reduce((acc, topic) => {
  acc[topic] = PROBLEMS_BANK_100.filter(p => p.topic === topic).length;
  return acc;
}, {});

const DIFFICULTY_TOTALS = {
  easy: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Easy').length,
  medium: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Medium').length,
  hard: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Hard').length,
};

/**
 * Parses mockData.ts to extract mentors, initial students, and initial teams
 */
function loadMockData() {
  const filePath = path.resolve(__dirname, '../../src/data/mockData.ts');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // 1. Mentors (20 Faculty Mentors)
  const mentorsMatch = fileContent.match(/export const ALL_MENTORS:\s*Mentor\[\]\s*=\s*(\[[\s\S]*?\]);/);
  let mentors = [];
  if (mentorsMatch) {
    try {
      mentors = JSON.parse(mentorsMatch[1]);
    } catch (e) {
      mentors = eval(mentorsMatch[1]);
    }
  }

  // 2. Students
  const studentsMatch = fileContent.match(/export const ALL_STUDENTS:\s*any\[\]\s*=\s*(\[[\s\S]*?\]);/);
  let students = [];
  if (studentsMatch) {
    try {
      const cleaned = studentsMatch[1]
        .replace(/DSA_TOPICS\.reduce\([\s\S]*?\},\s*\{\}\s*(as any)?\)/g, '{}')
        .replace(/DIFFICULTY_TOTALS\.easy/g, String(DIFFICULTY_TOTALS.easy))
        .replace(/DIFFICULTY_TOTALS\.medium/g, String(DIFFICULTY_TOTALS.medium))
        .replace(/DIFFICULTY_TOTALS\.hard/g, String(DIFFICULTY_TOTALS.hard))
        .replace(/TOTAL_CURRICULUM_PROBLEMS/g, '100');
      students = eval(cleaned);
    } catch (e) {
      students = [];
    }
  }

  // 3. Teams
  const teamsMatch = fileContent.match(/export const ALL_TEAMS:\s*any\[\]\s*=\s*(\[[\s\S]*?\]);/);
  let teams = [];
  if (teamsMatch) {
    try {
      const cleaned = teamsMatch[1]
        .replace(/as Record<string, number>/g, '')
        .replace(/as any/g, '')
        .replace(/DSA_TOPICS\.reduce\([\s\S]*?\},\s*\{\}\s*\)/g, '{}');
      teams = eval(cleaned);
    } catch (e) {
      teams = [];
    }
  }

  return { mentors, students, teams };
}

const { mentors: ALL_MENTORS, students: ALL_STUDENTS_MOCK, teams: ALL_TEAMS_MOCK } = loadMockData();

// Build Full Institutional Scale (100 Students across 20 Teams and 20 Mentors)
const INSTITUTIONAL_TEAMS_20 = ALL_MENTORS.map((mentor, idx) => {
  const teamNum = idx + 1;
  const teamStr = `Team ${teamNum < 10 ? '0' : ''}${teamNum}`;
  const studentIds = [];
  for (let s = 1; s <= 5; s++) {
    studentIds.push(`student-${(teamNum - 1) * 5 + s}`);
  }
  return {
    id: `team-${teamNum}`,
    teamNumber: teamStr,
    name: `Cohort ${teamNum}`,
    mentorId: mentor.id,
    mentorName: mentor.name,
    mentorEmail: mentor.email,
    mentorDepartment: mentor.department,
    mentorAvatar: mentor.avatar,
    studentIds,
    avgProgress: Number((65.0 + (teamNum % 5) * 6.5).toFixed(1)),
    totalSolved: (teamNum % 5) * 50 + 200,
    totalAttempted: (teamNum % 5) * 55 + 230,
    avgStreak: Number((5.0 + (teamNum % 4)).toFixed(1)),
    status: teamNum % 7 === 0 ? 'Needs Attention' : 'Active',
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 70.0; return acc; }, {}),
    rank: teamNum,
  };
});

const INSTITUTIONAL_STUDENTS_100 = [];
INSTITUTIONAL_TEAMS_20.forEach((team) => {
  team.studentIds.forEach((sId, sIdx) => {
    const num = parseInt(sId.replace(/\D/g, ''), 10);
    const solvedCount = 20 + (num % 80);
    INSTITUTIONAL_STUDENTS_100.push({
      id: sId,
      rollNo: `23F81A05${num < 10 ? '0' + num : num}`,
      name: `Student ${num}`,
      email: `student${num}@gkce.edu.in`,
      avatar: `https://images.unsplash.com/photo-1535713875${num < 10 ? '00' + num : num}?w=150&auto=format&fit=crop&q=80`,
      teamId: team.id,
      teamNumber: team.teamNumber,
      mentorId: team.mentorId,
      mentorName: team.mentorName,
      dsaLevel: num % 4 === 0 ? 'Advanced' : num % 3 === 0 ? 'Intermediate' : 'Beginner',
      progress: Number(((solvedCount / 100) * 100).toFixed(1)),
      solved: solvedCount,
      attempted: solvedCount + 5,
      pending: Math.max(0, 100 - solvedCount),
      streak: (num % 10) + 1,
      longestStreak: (num % 10) + 5,
      status: team.status,
      topicProgress: DSA_TOPICS.reduce((acc, t) => {
        acc[t] = { solved: 5, total: TOPIC_CURRICULUM_TOTALS[t], percentage: 50.0 };
        return acc;
      }, {}),
      difficultyStats: {
        easy: { solved: 20, total: DIFFICULTY_TOTALS.easy },
        medium: { solved: 15, total: DIFFICULTY_TOTALS.medium },
        hard: { solved: 5, total: DIFFICULTY_TOTALS.hard },
      },
      recentActivities: [],
      submissionsHistory: [],
      mentorFeedbackNotes: [],
      verifiedProblemIds: ['prob-1', 'prob-2'],
      leetcodeUsername: `student_${num}_lc`,
      githubUsername: `student_${num}_gh`,
    });
  });
});

// -------------------------------------------------------------
// Core Business Logic Calculation Formulas
// -------------------------------------------------------------

function calculatePending(solved) {
  const s = Math.max(0, Number(solved) || 0);
  return Math.max(0, TOTAL_CURRICULUM_PROBLEMS - s);
}

function calculateProgress(solved) {
  const s = Math.max(0, Number(solved) || 0);
  return Math.min(100, Number(((s / TOTAL_CURRICULUM_PROBLEMS) * 100).toFixed(1)));
}

function formatMetric(val) {
  return Number(Number(val || 0).toFixed(1));
}

function backendStudentToFrontend(s, existingStudents) {
  const existing = existingStudents?.find(
    (e) => `student-${s.id}` === e.id || e.rollNo === s.roll_number || e.rollNo === s.rollNo
  );
  const topicProgress = DSA_TOPICS.reduce((acc, topic) => {
    acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
    return acc;
  }, {});

  if (s.progress?.topic_progress) {
    for (const [topic, data] of Object.entries(s.progress.topic_progress)) {
      const friendlyTopic = topic.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const key = DSA_TOPICS.find(t => t.toLowerCase() === friendlyTopic.toLowerCase()) || friendlyTopic;
      if (topicProgress[key]) {
        topicProgress[key] = {
          solved: data.solved ?? 0,
          total: data.total ?? topicProgress[key].total,
          percentage: data.percentage ?? 0,
        };
      }
    }
  }

  const prog = s.progress || {};
  const rawSolved = prog.problems_solved ?? s.problems_solved ?? 0;
  const solved = typeof rawSolved === 'number' ? rawSolved : (s.solved ?? 0);
  const attempted = prog.problems_attempted ?? s.problems_attempted ?? s.attempted ?? 0;
  const progressPct = Number((prog.overall_percentage ?? s.progress_percentage ?? calculateProgress(solved)).toFixed(1));
  const streak = prog.current_streak ?? s.current_streak ?? s.streak ?? 0;
  const longestStreak = prog.longest_streak ?? s.longest_streak ?? s.longestStreak ?? 0;

  const dsaLevelMap = {
    BEGINNER: 'Beginner', INTERMEDIATE: 'Intermediate', ADVANCED: 'Advanced', MASTERY: 'Mastery',
  };
  const statusMap = {
    ACTIVE: 'Active', NEEDS_ATTENTION: 'Needs Attention', INACTIVE: 'Inactive',
  };

  return {
    id: `student-${s.id}`,
    rollNo: s.roll_number || s.rollNo || '',
    name: s.name || '',
    email: s.email || '',
    avatar: s.avatar_url || s.avatar || existing?.avatar || 'https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80',
    teamId: s.team_id ? `team-${s.team_id}` : (s.teamId || ''),
    teamNumber: s.team_number || s.teamNumber || '',
    mentorId: s.mentor_id ? `mentor-${s.mentor_id}` : (s.mentorId || existing?.mentorId || ''),
    mentorName: s.mentor_name || s.mentorName || existing?.mentorName || 'Faculty Mentor',
    dsaLevel: dsaLevelMap[s.dsa_level] || s.dsaLevel || 'Beginner',
    progress: progressPct,
    solved,
    attempted,
    pending: Math.max(0, TOTAL_CURRICULUM_PROBLEMS - Math.max(0, solved)),
    streak,
    longestStreak,
    status: statusMap[s.status] || s.status || 'Active',
    topicProgress,
    difficultyStats: {
      easy: { solved: prog.easy_solved ?? 0, total: prog.difficulty_stats?.easy?.total ?? DIFFICULTY_TOTALS.easy },
      medium: { solved: prog.medium_solved ?? 0, total: prog.difficulty_stats?.medium?.total ?? DIFFICULTY_TOTALS.medium },
      hard: { solved: prog.hard_solved ?? 0, total: prog.difficulty_stats?.hard?.total ?? DIFFICULTY_TOTALS.hard },
    },
    recentActivities: existing?.recentActivities || s.recentActivities || [],
    submissionsHistory: existing?.submissionsHistory || s.submissionsHistory || [],
    mentorFeedbackNotes: existing?.mentorFeedbackNotes || s.mentorFeedbackNotes || [],
    verifiedProblemIds: existing?.verifiedProblemIds || s.verifiedProblemIds || [],
    leetcodeUsername: s.leetcode_username || s.leetcodeUsername,
    githubUsername: s.github_username || s.githubUsername,
  };
}

function backendTeamToFrontend(t, existingTeams) {
  const existing = existingTeams?.find(
    (e) => `team-${t.id}` === e.id || e.teamNumber === t.team_number || e.teamNumber === t.teamNumber
  );
  const statusMap = {
    ACTIVE: 'Active', NEEDS_ATTENTION: 'Needs Attention', INACTIVE: 'Inactive',
    Active: 'Active', 'Needs Attention': 'Needs Attention',
  };
  return {
    id: `team-${t.id}`,
    teamNumber: t.team_number || t.teamNumber || '',
    name: t.name || '',
    mentorId: t.mentor_id ? `mentor-${t.mentor_id}` : (t.mentorId || existing?.mentorId || ''),
    mentorName: t.mentor_name || t.mentorName || existing?.mentorName || 'Faculty Mentor',
    mentorEmail: t.mentor_email || t.mentorEmail || existing?.mentorEmail || '',
    mentorDepartment: t.mentor_department || t.mentorDepartment || existing?.mentorDepartment || 'CSE',
    mentorAvatar: t.mentor_avatar || t.mentorAvatar || existing?.mentorAvatar,
    studentIds: existing?.studentIds || t.studentIds || [],
    avgProgress: Number((t.average_progress ?? t.avgProgress ?? 0).toFixed(1)),
    totalSolved: t.total_problems_solved ?? t.totalSolved ?? 0,
    totalAttempted: t.total_attempted ?? t.totalAttempted ?? 0,
    avgStreak: Number((t.average_streak ?? t.avgStreak ?? 0).toFixed(1)),
    status: statusMap[t.status] || t.status || 'Active',
    topicPerformance: existing?.topicPerformance || t.topicPerformance || DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = 0;
      return acc;
    }, {}),
    rank: t.rank ?? 1,
  };
}

function getExamTier(weekNumber) {
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
}

function getStudentExamSeed(studentIdentifier, examId) {
  const cleanId = (studentIdentifier || 'STUDENT_DEFAULT').trim().toLowerCase();
  const str = `${cleanId}:::${examId}:::gkce-anti-cheating-salt-2026`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getShuffledQuestionsForStudent(questions, studentIdentifier, examId) {
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
}

function convertProblemToExamQuestion(problem, questionNumber, marks = 5, weekNumber = 2) {
  const tierInfo = getExamTier(weekNumber);
  return {
    id: `exam-q-${problem.id}`,
    questionNumber,
    title: problem.title,
    topic: problem.topic,
    difficulty: tierInfo.tier === 'EASY' ? 'Easy' : tierInfo.tier === 'MEDIUM' ? 'Medium' : 'Hard',
    marks,
    originalProblemId: problem.id,
    description: problem.description || `Given inputs and constraints for ${problem.title}, implement an optimal solution.`,
    starterCode: {
      java: `public class Main {\n    public static void main(String[] args) {\n        // Solution\n    }\n}`,
      cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}`,
      python: `def solve():\n    pass`,
      javascript: `function solve() {\n    // Solution\n}`
    },
    testCases: [
      { input: '4', output: 'Even', isHidden: false },
      { input: '7', output: 'Odd', isHidden: false },
      { input: '12', output: 'Even', isHidden: false },
      { input: '9', output: 'Odd', isHidden: true },
    ],
  };
}

function buildOfficialExam(weekNumber, title, scheduledDate, startTime = '10:00 AM', durationMinutes = 90) {
  const tier = getExamTier(weekNumber);
  const questions = PROBLEMS_BANK_100.slice(0, 20).map((p, idx) =>
    convertProblemToExamQuestion(p, idx + 1, 5, weekNumber)
  );

  return {
    id: `exam-root-w${weekNumber}-${Date.now()}`,
    weekNumber,
    tier: tier.tier,
    tierBadge: tier.tierBadge,
    title,
    description: `Official examination for Week ${weekNumber} curated and scheduled by Root (Dean of Academic Affairs).`,
    topicFocus: `Core DSA Foundations — Week ${weekNumber} (20 Questions)`,
    scheduledDate,
    startTime,
    durationMinutes,
    totalMarks: 100,
    passMarks: 50,
    status: 'SCHEDULED',
    createdBy: 'Root (Dean of Academic Affairs / Sudo Admin)',
    questions,
    submissions: [],
  };
}

module.exports = {
  TOTAL_CURRICULUM_PROBLEMS,
  TOTAL_CURRICULUM_DAYS,
  PROBLEMS_PER_DAY,
  DSA_TOPICS,
  DAILY_TOPIC_THEMES,
  PROBLEMS_BANK_100,
  TOPIC_CURRICULUM_TOTALS,
  DIFFICULTY_TOTALS,
  ALL_MENTORS,
  ALL_STUDENTS: ALL_STUDENTS_MOCK,
  ALL_TEAMS: ALL_TEAMS_MOCK,
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
};
