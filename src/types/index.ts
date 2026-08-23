export type UserRole = 'STUDENT' | 'MENTOR' | 'DEAN';

export type DSATopic =
  | 'Arrays'
  | 'Strings'
  | 'Linked Lists'
  | 'Stack'
  | 'Queue'
  | 'Trees'
  | 'Graphs'
  | 'Dynamic Programming';

export type StudentStatus = 'Active' | 'Needs Attention' | 'Inactive';
export type DSALevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';

export interface ActivityItem {
  id: string;
  studentId?: string;
  action: string;
  problemTitle: string;
  topic: DSATopic;
  timestamp?: string;
  timeAgo: string;
  status: 'Completed' | 'Attempted' | 'Passed';
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  avatar: string;
  teamId: string;
  teamNumber: string; // e.g. "Team 07"
  mentorId: string;
  mentorName: string;
  dsaLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';
  progress: number; // 0 - 100
  solved: number;
  attempted: number;
  pending: number;
  streak: number;
  longestStreak: number;
  status: StudentStatus;
  topicProgress: Record<DSATopic, { solved: number; total: number; percentage: number }>;
  difficultyStats: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  recentActivities: ActivityItem[];
  submissionsHistory: { date: string; count: number }[];
  mentorFeedbackNotes?: { id: string; date: string; author: string; note: string }[];
  verifiedProblemIds?: string[]; // IDs of problems signed off / ticked by faculty mentor
  leetcodeUsername?: string;
  githubUsername?: string;
}

export interface Team {
  id: string;
  teamNumber: string; // e.g. "Team 01"
  name: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  mentorDepartment: string;
  mentorAvatar?: string;
  studentIds: string[];
  avgProgress: number;
  totalSolved: number;
  totalAttempted: number;
  avgStreak: number;
  status: StudentStatus;
  topicPerformance: Record<DSATopic, number>; // avg percentage
  rank: number;
}

export interface Mentor {
  id: string;
  name: string;
  email: string;
  department: string;
  phone?: string;
  avatar: string;
  assignedTeamId: string;
  assignedTeamNumber: string;
  experienceYears?: number;
}

export interface Problem {
  id: string;
  dayNumber: number; // 1 to 20
  dayQuestionNumber: number; // 1 to 5
  dayTopic?: string;
  title: string;
  topic: DSATopic;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  acceptanceRate: string;
  solvedCount?: number;
  url?: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  studentData?: Student;
  mentorData?: Mentor;
  teamId?: string;
  teamNumber?: string;
}

export type ExamStatus = 'SCHEDULED' | 'LIVE' | 'COMPLETED';

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  displayQuestionNumber?: number; // Shuffled 1-indexed order for active student session
  title: string;
  topic: DSATopic;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  marks: number;
  originalProblemId?: string; // Reference to prob-1..100 in curriculum
  starterCode?: {
    java?: string;
    cpp?: string;
    python?: string;
  };
  testCases?: { input: string; output: string; isHidden?: boolean }[];
}

export interface StudentExamSubmission {
  id: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  teamNumber: string;
  examId: string;
  randomizedSetCode?: string; // e.g. "SET-A842"
  status: 'SUBMITTED' | 'IN_PROGRESS' | 'EVALUATED' | 'MISSED';
  score: number;
  totalMarks: number;
  questionsSolved: number;
  submittedAt?: string;
  timeSpentMinutes?: number;
  passedCount?: number;
  totalQuestionCount?: number;
  answers?: Record<string, {
    code: string;
    language: string;
    passedTestCases: number;
    totalTestCases: number;
    marksAwarded: number;
  }>;
}

export interface WeeklyExam {
  id: string;
  weekNumber: number; // e.g. 1, 2, 3, 4
  tier?: 'EASY' | 'MEDIUM' | 'HARD'; // Progressive tier: Weeks 1-3 Easy, Weeks 4-6 Medium, Weeks 7+ Hard
  tierBadge?: string; // e.g. "Tier 1: Easy Foundations"
  title: string; // e.g. "Week 01 Assessment: Basics & Number Logic"
  description: string;
  topicFocus: string; // e.g. "Basics, Loops & Number Logic"
  scheduledDate: string; // e.g. "2026-08-28"
  startTime: string; // e.g. "10:00 AM"
  durationMinutes: number; // e.g. 60
  totalMarks: number; // e.g. 100
  passMarks: number; // e.g. 50
  status: ExamStatus; // 'SCHEDULED' | 'LIVE' | 'COMPLETED'
  createdBy: string; // "Dean of Academic Affairs (SUDO)"
  questions: ExamQuestion[];
  submissions?: StudentExamSubmission[];
}

