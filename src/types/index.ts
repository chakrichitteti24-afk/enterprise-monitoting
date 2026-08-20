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
  action: string;
  problemTitle: string;
  topic: DSATopic;
  timestamp: string;
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
  phone: string;
  avatar: string;
  assignedTeamId: string;
  assignedTeamNumber: string;
  experienceYears: number;
}

export interface Problem {
  id: string;
  title: string;
  topic: DSATopic;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  acceptanceRate: string;
  solvedCount: number;
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
