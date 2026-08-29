import { DSATopic, Mentor, Problem, Student, Team, CurrentUser } from '../types';
import { PROBLEMS_BANK_100 } from './dsaCurriculum100';

export { PROBLEMS_BANK_100 as PROBLEMS_BANK } from './dsaCurriculum100';

export const DSA_TOPICS: DSATopic[] = [
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

export const TOPIC_CURRICULUM_TOTALS: Record<DSATopic, number> = DSA_TOPICS.reduce((acc, topic) => {
  acc[topic] = PROBLEMS_BANK_100.filter(p => p.topic === topic).length;
  return acc;
}, {} as Record<DSATopic, number>);

export const DIFFICULTY_TOTALS = {
  easy: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Easy').length,
  medium: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Medium').length,
  hard: PROBLEMS_BANK_100.filter(p => p.difficulty === 'Hard').length,
};

export const ACTIVE_TOPICS_COUNT = Object.values(TOPIC_CURRICULUM_TOTALS).filter(val => val > 0).length;

export const TOTAL_CURRICULUM_PROBLEMS = 100;

export const ALL_MENTORS: Mentor[] = [
  {
    "id": "mentor-1",
    "name": "K.S.GAYATHRI",
    "email": "ksgayathri@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10001",
    "avatar": "https://images.unsplash.com/photo-1507003211186?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-1",
    "assignedTeamNumber": "Team 01",
    "experienceYears": 8
  },
  {
    "id": "mentor-2",
    "name": "SK SHABANA",
    "email": "skshabana@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10002",
    "avatar": "https://images.unsplash.com/photo-1507003211203?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-2",
    "assignedTeamNumber": "Team 02",
    "experienceYears": 8
  },
  {
    "id": "mentor-3",
    "name": "V.RAMYA",
    "email": "vramya@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10003",
    "avatar": "https://images.unsplash.com/photo-1507003211220?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-3",
    "assignedTeamNumber": "Team 03",
    "experienceYears": 8
  },
  {
    "id": "mentor-4",
    "name": "SAMYUKTHA",
    "email": "samyuktha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10004",
    "avatar": "https://images.unsplash.com/photo-1507003211237?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-4",
    "assignedTeamNumber": "Team 04",
    "experienceYears": 8
  },
  {
    "id": "mentor-5",
    "name": "K.SUDHAKAR",
    "email": "ksudhakar@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10005",
    "avatar": "https://images.unsplash.com/photo-1507003211254?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-5",
    "assignedTeamNumber": "Team 05",
    "experienceYears": 8
  },
  {
    "id": "mentor-6",
    "name": "K.KEERTHANA",
    "email": "kkeerthana@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10006",
    "avatar": "https://images.unsplash.com/photo-1507003211271?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-6",
    "assignedTeamNumber": "Team 06",
    "experienceYears": 8
  },
  {
    "id": "mentor-7",
    "name": "A.LUDWIKA",
    "email": "ludwikha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10007",
    "avatar": "https://images.unsplash.com/photo-1507003211288?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-7",
    "assignedTeamNumber": "Team 07",
    "experienceYears": 8
  },
  {
    "id": "mentor-8",
    "name": "C.MANJUSHA",
    "email": "manjusha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10008",
    "avatar": "https://images.unsplash.com/photo-1507003211305?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-8",
    "assignedTeamNumber": "Team 08",
    "experienceYears": 8
  }
];

export const ALL_STUDENTS: any[] = [
  {
    "id": "student-1",
    "rollNo": "23F81A0502",
    "name": "ANANTHALAKSHMI.BODDU",
    "email": "ananthalakshmi23f81a0502@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875025?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "ananthalaksh_0502",
    "githubUsername": "ananthalak_0502"
  },
  {
    "id": "student-2",
    "rollNo": "23F81A0507",
    "name": "DEVIKA.PITTI",
    "email": "devika23f81a0507@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875048?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "devika_pitti_0507",
    "githubUsername": "devikapitt_0507"
  },
  {
    "id": "student-3",
    "rollNo": "23F81A0513",
    "name": "KAVITHA.GALLA",
    "email": "kavitha23f81a0513@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875071?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "kavitha_gall_0513",
    "githubUsername": "kavithagal_0513"
  },
  {
    "id": "student-4",
    "rollNo": "23F81A0511",
    "name": "JASWITHA.BATTA",
    "email": "jaswitha23f81a0511@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875094?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "jaswitha_bat_0511",
    "githubUsername": "jaswithaba_0511"
  },
  {
    "id": "student-5",
    "rollNo": "23F81A0538",
    "name": "THANUSHA.JEELAGA",
    "email": "thanusha23f81a0538@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875117?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "thanusha_jee_0538",
    "githubUsername": "thanushaje_0538"
  },
  {
    "id": "student-6",
    "rollNo": "23F81A0510",
    "name": "HABEEBA.SHAIK",
    "email": "habeeba23f81a0510@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875140?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "SK SHABANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "habeeba_shai_0510",
    "githubUsername": "habeebasha_0510"
  },
  {
    "id": "student-7",
    "rollNo": "23F81A0504",
    "name": "BHARGAVI.GADDAM",
    "email": "bhargavi23f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875163?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "SK SHABANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "bhargavi_gad_0504",
    "githubUsername": "bhargaviga_0504"
  },
  {
    "id": "student-8",
    "rollNo": "23F81A0525",
    "name": "PALLAVI.GADDAM",
    "email": "pallavi23f81a0525@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875186?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "SK SHABANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "pallavi_gadd_0525",
    "githubUsername": "pallavigad_0525"
  },
  {
    "id": "student-9",
    "rollNo": "23F81A0534",
    "name": "SRAVANTHI.KATURU",
    "email": "sravanthi23f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875209?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "SK SHABANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "sravanthi_ka_0534",
    "githubUsername": "sravanthik_0534"
  },
  {
    "id": "student-10",
    "rollNo": "23F81A0514",
    "name": "KAVYA.MODI",
    "email": "kavya23f81a0514@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875232?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "V.RAMYA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "kavya_modi_0514",
    "githubUsername": "kavyamodi_0514"
  },
  {
    "id": "student-11",
    "rollNo": "24F85A0508",
    "name": "MANASA VUKKADALA",
    "email": "manasa24f85a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875255?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "V.RAMYA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "manasa_vukka_0508",
    "githubUsername": "manasavukk_0508"
  },
  {
    "id": "student-12",
    "rollNo": "23F81A0509",
    "name": "DIVYA SRI.KUTLURU",
    "email": "divya23f81a0509@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875278?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "V.RAMYA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "divya_sri_ku_0509",
    "githubUsername": "divyasriku_0509"
  },
  {
    "id": "student-13",
    "rollNo": "23F81A0542",
    "name": "VYSHNAVI.KONERU",
    "email": "vyshnavi23f81a0542@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875301?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "V.RAMYA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "vyshnavi_kon_0542",
    "githubUsername": "vyshnaviko_0542"
  },
  {
    "id": "student-14",
    "rollNo": "23F81A0520",
    "name": "MUNI KUMAR.KARUMANCHI",
    "email": "muni23f81a0520@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875324?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "muni_kumar_k_0520",
    "githubUsername": "munikumark_0520"
  },
  {
    "id": "student-15",
    "rollNo": "23F81A0521",
    "name": "MUNI SAI SUDHARSAN.NELLORE",
    "email": "muni23f81a0521@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875347?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "muni_sai_sud_0521",
    "githubUsername": "munisaisud_0521"
  },
  {
    "id": "student-16",
    "rollNo": "23F81A0529",
    "name": "SAI.PALETI",
    "email": "sai23f81a0529@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875370?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "sai_paleti_0529",
    "githubUsername": "saipaleti_0529"
  },
  {
    "id": "student-17",
    "rollNo": "23F81A0535",
    "name": "SRIHARI.VAVILA",
    "email": "srihari23f81a0535@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875393?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "srihari_vavi_0535",
    "githubUsername": "sriharivav_0535"
  },
  {
    "id": "student-18",
    "rollNo": "23F81A0527",
    "name": "PUNEETH.PAGADALA",
    "email": "puneeth23f81a0527@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875416?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "puneeth_paga_0527",
    "githubUsername": "puneethpag_0527"
  },
  {
    "id": "student-19",
    "rollNo": "23F81A0545",
    "name": "BHANU TEJA.PILLI",
    "email": "bhanu23f81a0545@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875439?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "bhanu_teja_p_0545",
    "githubUsername": "bhanutejap_0545"
  },
  {
    "id": "student-20",
    "rollNo": "23F81A0562",
    "name": "JAYASREE.BHASKAR",
    "email": "jayasree23f81a0562@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875462?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "jayasree_bha_0562",
    "githubUsername": "jayasreebh_0562"
  },
  {
    "id": "student-21",
    "rollNo": "23F81A0572",
    "name": "SAILAJA.CHALLA",
    "email": "sailaja23f81a0572@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875485?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "sailaja_chal_0572",
    "githubUsername": "sailajacha_0572"
  },
  {
    "id": "student-22",
    "rollNo": "23F81A0578",
    "name": "SRAVANI.BONUBOYINA",
    "email": "sravani23f81a0578@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875508?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "sravani_bonu_0578",
    "githubUsername": "sravanibon_0578"
  },
  {
    "id": "student-23",
    "rollNo": "24F85A0517",
    "name": "VINEELA KEERTHI SREERAM",
    "email": "vineela24f85a0517@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875531?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "vineela_keer_0517",
    "githubUsername": "vineelakee_0517"
  },
  {
    "id": "student-24",
    "rollNo": "23F81A0552",
    "name": "DIVYA KUMAWAT.PANNALAL",
    "email": "divya23f81a0552@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875554?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "K.KEERTHANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "divya_kumawa_0552",
    "githubUsername": "divyakumaw_0552"
  },
  {
    "id": "student-25",
    "rollNo": "23F81A0577",
    "name": "SONI.VETTI",
    "email": "soni23f81a0577@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875577?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "K.KEERTHANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "soni_vetti_0577",
    "githubUsername": "sonivetti_0577"
  },
  {
    "id": "student-26",
    "rollNo": "23F81A0581",
    "name": "VAISHNAVI.KALLURU",
    "email": "vaishnavi23f81a0581@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875600?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "K.KEERTHANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "vaishnavi_ka_0581",
    "githubUsername": "vaishnavik_0581"
  },
  {
    "id": "student-27",
    "rollNo": "23F81A0576",
    "name": "SILPA.CHINTHAGINJALA",
    "email": "silpa23f81a0576@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "K.KEERTHANA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "silpa_chinth_0576",
    "githubUsername": "silpachint_0576"
  },
  {
    "id": "student-28",
    "rollNo": "24F81A0522",
    "name": "CH. CHAKRI",
    "email": "chakri24f81a0522@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875646?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "ch__chakri_0522",
    "githubUsername": "chchakri_0522"
  },
  {
    "id": "student-29",
    "rollNo": "24F81A0534",
    "name": "P.GAYANI",
    "email": "gayani24f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875669?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "p_gayani_0534",
    "githubUsername": "pgayani_0534"
  },
  {
    "id": "student-30",
    "rollNo": "24F81A0504",
    "name": "P.AKHILA",
    "email": "akhila24f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875692?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "p_akhila_0504",
    "githubUsername": "pakhila_0504"
  },
  {
    "id": "student-31",
    "rollNo": "24F81A0549",
    "name": "C.JAHNAVI",
    "email": "jahnavi24f81a0549@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875715?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "c_jahnavi_0549",
    "githubUsername": "cjahnavi_0549"
  },
  {
    "id": "student-32",
    "rollNo": "24F81A0544",
    "name": "S. HARSHITHA",
    "email": "harshitha24f81a0544@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875738?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "s__harshitha_0544",
    "githubUsername": "sharshitha_0544"
  },
  {
    "id": "student-33",
    "rollNo": "24F81A0553",
    "name": "S.KARTHIK",
    "email": "karthik24f81a0553@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875761?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "s_karthik_0553",
    "githubUsername": "skarthik_0553"
  },
  {
    "id": "student-34",
    "rollNo": "24F81A0532",
    "name": "M.ESWAR",
    "email": "eswar24f81a0532@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875784?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "m_eswar_0532",
    "githubUsername": "meswar_0532"
  },
  {
    "id": "student-35",
    "rollNo": "24F81A0554",
    "name": "K.KEERTHANA",
    "email": "keerthana24f81a0554@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875807?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "k_keerthana_0554",
    "githubUsername": "kkeerthana_0554"
  },
  {
    "id": "student-36",
    "rollNo": "24F81A0548",
    "name": "D. HIMA VARSHA",
    "email": "hima24f81a0548@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875830?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "d__hima_vars_0548",
    "githubUsername": "dhimavarsh_0548"
  },
  {
    "id": "student-37",
    "rollNo": "24F81A0557",
    "name": "B.KISHORE NAIK",
    "email": "kishore24f81a0557@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875853?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "b_kishore_na_0557",
    "githubUsername": "bkishorena_0557"
  },
  {
    "id": "student-38",
    "rollNo": "24F81A0508",
    "name": "E. ANUSHA",
    "email": "anusha24f81a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875876?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "e__anusha_0508",
    "githubUsername": "eanusha_0508"
  },
  {
    "id": "student-39",
    "rollNo": "24F81A0550",
    "name": "U. JANAKI",
    "email": "janaki24f81a0550@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875899?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    pending: TOTAL_CURRICULUM_PROBLEMS,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    topicProgress: DSA_TOPICS.reduce((acc, topic) => {
      acc[topic] = { solved: 0, total: TOPIC_CURRICULUM_TOTALS[topic] || 0, percentage: 0 };
      return acc;
    }, {} as any),
    "difficultyStats": {
      "easy": { "solved": 0, "total": DIFFICULTY_TOTALS.easy },
      "medium": { "solved": 0, "total": DIFFICULTY_TOTALS.medium },
      "hard": { "solved": 0, "total": DIFFICULTY_TOTALS.hard }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": [],
    "verifiedProblemIds": [],
    "leetcodeUsername": "u__janaki_0550",
    "githubUsername": "ujanaki_0550"
  }
];

export const ALL_TEAMS: any[] = [
  {
    "id": "team-1",
    "teamNumber": "Team 01",
    "name": "Algorithm Aces",
    "mentorId": "mentor-1",
    "mentorName": "K.S.GAYATHRI",
    "mentorEmail": "ksgayathri@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 1
  },
  {
    "id": "team-2",
    "teamNumber": "Team 02",
    "name": "Binary Bandits",
    "mentorId": "mentor-2",
    "mentorName": "SK SHABANA",
    "mentorEmail": "skshabana@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-6",
      "student-7",
      "student-8",
      "student-9"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 2
  },
  {
    "id": "team-3",
    "teamNumber": "Team 03",
    "name": "Dynamic Dynamos",
    "mentorId": "mentor-3",
    "mentorName": "V.RAMYA",
    "mentorEmail": "vramya@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-10",
      "student-11",
      "student-12",
      "student-13"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 3
  },
  {
    "id": "team-4",
    "teamNumber": "Team 04",
    "name": "Graph Gurus",
    "mentorId": "mentor-4",
    "mentorName": "SAMYUKTHA",
    "mentorEmail": "samyuktha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-14",
      "student-15",
      "student-16",
      "student-17",
      "student-18"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 4
  },
  {
    "id": "team-5",
    "teamNumber": "Team 05",
    "name": "Stack Smashers",
    "mentorId": "mentor-5",
    "mentorName": "K.SUDHAKAR",
    "mentorEmail": "ksudhakar@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-19",
      "student-20",
      "student-21",
      "student-22",
      "student-23"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 5
  },
  {
    "id": "team-6",
    "teamNumber": "Team 06",
    "name": "Queue Queens",
    "mentorId": "mentor-6",
    "mentorName": "K.KEERTHANA",
    "mentorEmail": "kkeerthana@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-24",
      "student-25",
      "student-26",
      "student-27"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 6
  },
  {
    "id": "team-7",
    "teamNumber": "Team 07",
    "name": "Tree Titans",
    "mentorId": "mentor-7",
    "mentorName": "A.LUDWIKA",
    "mentorEmail": "ludwikha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-28",
      "student-29",
      "student-30",
      "student-31",
      "student-32",
      "student-33"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 7
  },
  {
    "id": "team-8",
    "teamNumber": "Team 08",
    "name": "Recursion Rangers",
    "mentorId": "mentor-8",
    "mentorName": "C.MANJUSHA",
    "mentorEmail": "manjusha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-34",
      "student-35",
      "student-36",
      "student-37",
      "student-38",
      "student-39"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
    "status": "Active",
    topicPerformance: DSA_TOPICS.reduce((acc, t) => { acc[t] = 0; return acc; }, {} as Record<string, number>),
    "rank": 8
  }
];

export const DEAN_USER: CurrentUser = {
  id: 'dean-1',
  name: 'Sudo Users',
  email: 'root@gkce.edu.in',
  role: 'DEAN',
  avatar: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=GKCE_Dean_SUDO&backgroundColor=0f172a&radius=16',
  title: 'Dean of Academic Affairs & Head of Technical Training',
};

export const DEFAULT_MENTOR_USER: CurrentUser = {
  id: 'mentor-7',
  name: 'A.LUDWIKA',
  email: 'ludwikha@gkce.edu.in',
  role: 'MENTOR',
  avatar: 'https://images.unsplash.com/photo-1507003211288?w=150&auto=format&fit=crop&q=80',
  title: 'Faculty Mentor, Dept. of CSE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  mentorData: ALL_MENTORS.find(m => m.id === 'mentor-7'),
};

export const DEFAULT_STUDENT_USER: CurrentUser = {
  id: 'student-28',
  name: 'CH. CHAKRI',
  email: 'chakri24f81a0522@gkce.edu.in',
  role: 'STUDENT',
  avatar: 'https://images.unsplash.com/photo-1535713875646?w=150&auto=format&fit=crop&q=80',
  title: 'B.Tech Student, GKCE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  studentData: ALL_STUDENTS.find(s => s.id === 'student-28'),
};
