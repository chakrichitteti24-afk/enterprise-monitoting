import { DSATopic, Mentor, Problem, Student, Team, CurrentUser } from '../types';
import { PROBLEMS_BANK_100 } from './dsaCurriculum100';

export { PROBLEMS_BANK_100 as PROBLEMS_BANK } from './dsaCurriculum100';

export const DSA_TOPICS: DSATopic[] = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stack',
  'Queue',
  'Trees',
  'Graphs',
  'Dynamic Programming',
];

export const TOPIC_CURRICULUM_TOTALS: Record<DSATopic, number> = {
  'Arrays': 5,
  'Strings': 4,
  'Linked Lists': 4,
  'Stack': 4,
  'Queue': 2,
  'Trees': 5,
  'Graphs': 4,
  'Dynamic Programming': 6,
};

export const TOTAL_CURRICULUM_PROBLEMS = 34;

export const ALL_MENTORS: Mentor[] = [
  {
    "id": "mentor-1",
    "name": "Dr. K. Suresh Kumar",
    "email": "suresh.kumar@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10001",
    "avatar": "https://images.unsplash.com/photo-1507003211169?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-1",
    "assignedTeamNumber": "Team 01",
    "experienceYears": 12
  },
  {
    "id": "mentor-2",
    "name": "Mrs. P. Radhika",
    "email": "radhika.p@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10002",
    "avatar": "https://images.unsplash.com/photo-1507003211186?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-2",
    "assignedTeamNumber": "Team 02",
    "experienceYears": 8
  },
  {
    "id": "mentor-3",
    "name": "Mr. M. Ramesh",
    "email": "ramesh.m@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10003",
    "avatar": "https://images.unsplash.com/photo-1507003211203?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-3",
    "assignedTeamNumber": "Team 03",
    "experienceYears": 7
  },
  {
    "id": "mentor-4",
    "name": "Mrs. S. Lakshmi",
    "email": "lakshmi.s@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10004",
    "avatar": "https://images.unsplash.com/photo-1507003211220?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-4",
    "assignedTeamNumber": "Team 04",
    "experienceYears": 9
  },
  {
    "id": "mentor-5",
    "name": "Mr. N. Rajesh",
    "email": "rajesh.n@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10005",
    "avatar": "https://images.unsplash.com/photo-1507003211237?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-5",
    "assignedTeamNumber": "Team 05",
    "experienceYears": 6
  },
  {
    "id": "mentor-6",
    "name": "Mrs. G. Pavani",
    "email": "pavani.g@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10006",
    "avatar": "https://images.unsplash.com/photo-1507003211254?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-6",
    "assignedTeamNumber": "Team 06",
    "experienceYears": 5
  },
  {
    "id": "mentor-7",
    "name": "Mrs. Ludwikha",
    "email": "ludwikha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10007",
    "avatar": "https://images.unsplash.com/photo-1507003211271?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-7",
    "assignedTeamNumber": "Team 07",
    "experienceYears": 8
  },
  {
    "id": "mentor-8",
    "name": "Mr. Vishnu",
    "email": "vishnu@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10008",
    "avatar": "https://images.unsplash.com/photo-1507003211288?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-8",
    "assignedTeamNumber": "Team 08",
    "experienceYears": 7
  },
  {
    "id": "mentor-9",
    "name": "Mrs. Manjusha",
    "email": "manjusha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10009",
    "avatar": "https://images.unsplash.com/photo-1507003211305?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-9",
    "assignedTeamNumber": "Team 09",
    "experienceYears": 10
  },
  {
    "id": "mentor-10",
    "name": "Mrs. Teja",
    "email": "teja.faculty@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10010",
    "avatar": "https://images.unsplash.com/photo-1507003211322?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-10",
    "assignedTeamNumber": "Team 10",
    "experienceYears": 6
  },
  {
    "id": "mentor-11",
    "name": "Dr. M. Srinivasa Rao",
    "email": "mentor.11@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10011",
    "avatar": "https://images.unsplash.com/photo-1507003211339?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-11",
    "assignedTeamNumber": "Team 11",
    "experienceYears": 14
  },
  {
    "id": "mentor-12",
    "name": "Prof. Sunita Deshmukh",
    "email": "mentor.12@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10012",
    "avatar": "https://images.unsplash.com/photo-1507003211356?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-12",
    "assignedTeamNumber": "Team 12",
    "experienceYears": 12
  },
  {
    "id": "mentor-13",
    "name": "Dr. Ananya Ray",
    "email": "mentor.13@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10013",
    "avatar": "https://images.unsplash.com/photo-1507003211373?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-13",
    "assignedTeamNumber": "Team 13",
    "experienceYears": 10
  },
  {
    "id": "mentor-14",
    "name": "Prof. K. Venkatesh",
    "email": "mentor.14@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10014",
    "avatar": "https://images.unsplash.com/photo-1507003211390?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-14",
    "assignedTeamNumber": "Team 14",
    "experienceYears": 15
  },
  {
    "id": "mentor-15",
    "name": "Dr. P. Rajesh Kumar",
    "email": "mentor.15@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10015",
    "avatar": "https://images.unsplash.com/photo-1507003211407?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-15",
    "assignedTeamNumber": "Team 15",
    "experienceYears": 11
  },
  {
    "id": "mentor-16",
    "name": "Prof. B. Deepa",
    "email": "mentor.16@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10016",
    "avatar": "https://images.unsplash.com/photo-1507003211424?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-16",
    "assignedTeamNumber": "Team 16",
    "experienceYears": 9
  },
  {
    "id": "mentor-17",
    "name": "Dr. S. Mohan Das",
    "email": "mentor.17@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10017",
    "avatar": "https://images.unsplash.com/photo-1507003211441?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-17",
    "assignedTeamNumber": "Team 17",
    "experienceYears": 16
  },
  {
    "id": "mentor-18",
    "name": "Prof. Kavita Reddy",
    "email": "mentor.18@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10018",
    "avatar": "https://images.unsplash.com/photo-1507003211458?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-18",
    "assignedTeamNumber": "Team 18",
    "experienceYears": 8
  },
  {
    "id": "mentor-19",
    "name": "Dr. C. Balasubramanian",
    "email": "mentor.19@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10019",
    "avatar": "https://images.unsplash.com/photo-1507003211475?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-19",
    "assignedTeamNumber": "Team 19",
    "experienceYears": 13
  },
  {
    "id": "mentor-20",
    "name": "Prof. Meera Nair",
    "email": "mentor.20@gkce.edu.in",
    "department": "Computer Science & Engg",
    "phone": "+91 98480 10020",
    "avatar": "https://images.unsplash.com/photo-1507003211492?w=150&auto=format&fit=crop&q=80",
    "assignedTeamId": "team-20",
    "assignedTeamNumber": "Team 20",
    "experienceYears": 10
  }
];

export const ALL_STUDENTS: Student[] = [
  {
    "id": "student-1",
    "rollNo": "23F81A0502",
    "name": "BODDU ANANTHALAKSHMI",
    "email": "ananthalakshmi23f81a0502@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875025?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 24,
    "pending": 10,
    "streak": 14,
    "longestStreak": 18,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-1-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-1-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-1",
        "date": "2026-08-18",
        "author": "Dr. K. Suresh Kumar",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "boddu_ananth_0502",
    "githubUsername": "bodduanant_0502"
  },
  {
    "id": "student-2",
    "rollNo": "23F81A0507",
    "name": "PITTI DEVIKA (MQ)",
    "email": "devika23f81a0507@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875048?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 16,
    "pending": 18,
    "streak": 6,
    "longestStreak": 9,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-2-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-2-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-2",
        "date": "2026-08-18",
        "author": "Dr. K. Suresh Kumar",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "pitti_devika_0507",
    "githubUsername": "pittidevik_0507"
  },
  {
    "id": "student-3",
    "rollNo": "23F81A0513",
    "name": "GALLA KAVITHA",
    "email": "kavitha23f81a0513@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875071?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 5,
    "streak": 5,
    "longestStreak": 10,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-3-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-3-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-3",
        "date": "2026-08-18",
        "author": "Dr. K. Suresh Kumar",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "galla_kavith_0513",
    "githubUsername": "gallakavit_0513"
  },
  {
    "id": "student-4",
    "rollNo": "23F81A0511",
    "name": "BATTA JASWITHA",
    "email": "jaswitha23f81a0511@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875094?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 17,
    "pending": 17,
    "streak": 8,
    "longestStreak": 12,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-4-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-4-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-4",
        "date": "2026-08-18",
        "author": "Dr. K. Suresh Kumar",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "batta_jaswit_0511",
    "githubUsername": "battajaswi_0511"
  },
  {
    "id": "student-5",
    "rollNo": "23F81A0538",
    "name": "JEELAGA THANUSHA",
    "email": "thanusha23f81a0538@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875117?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 18,
    "pending": 16,
    "streak": 13,
    "longestStreak": 19,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-5-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-5-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 2
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-5",
        "date": "2026-08-18",
        "author": "Dr. K. Suresh Kumar",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "jeelaga_than_0538",
    "githubUsername": "jeelagatha_0538"
  },
  {
    "id": "student-6",
    "rollNo": "23F81A0510",
    "name": "SHAIK HABEEBA",
    "email": "habeeba23f81a0510@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875140?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Mastery",
    "progress": 94,
    "solved": 32,
    "attempted": 33,
    "pending": 1,
    "streak": 4,
    "longestStreak": 9,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 10,
        "total": 11
      },
      "medium": {
        "solved": 13,
        "total": 14
      },
      "hard": {
        "solved": 8,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-6-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-6-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-6",
        "date": "2026-08-18",
        "author": "Mrs. P. Radhika",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "shaik_habeeb_0510",
    "githubUsername": "shaikhabee_0510"
  },
  {
    "id": "student-7",
    "rollNo": "23F81A0504",
    "name": "GADDAM BHARGAVI",
    "email": "bhargavi23f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875163?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 20,
    "pending": 14,
    "streak": 14,
    "longestStreak": 16,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-7-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-7-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-7",
        "date": "2026-08-18",
        "author": "Mrs. P. Radhika",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "gaddam_bharg_0504",
    "githubUsername": "gaddambhar_0504"
  },
  {
    "id": "student-8",
    "rollNo": "23F81A0525",
    "name": "GADDAM PALLAVI",
    "email": "pallavi23f81a0525@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875186?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 25,
    "pending": 9,
    "streak": 6,
    "longestStreak": 8,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 10,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-8-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-8-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 3
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-8",
        "date": "2026-08-18",
        "author": "Mrs. P. Radhika",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "gaddam_palla_0525",
    "githubUsername": "gaddampall_0525"
  },
  {
    "id": "student-9",
    "rollNo": "23F81A0534",
    "name": "KATURU SRAVANTHI",
    "email": "sravanthi23f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875209?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 31,
    "pending": 3,
    "streak": 13,
    "longestStreak": 18,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-9-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-9-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-9",
        "date": "2026-08-18",
        "author": "Mrs. P. Radhika",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "katuru_srava_0534",
    "githubUsername": "katurusrav_0534"
  },
  {
    "id": "student-10",
    "rollNo": "23F81A0514",
    "name": "MODI KAVYA",
    "email": "kavya23f81a0514@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875232?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Advanced",
    "progress": 79,
    "solved": 27,
    "attempted": 29,
    "pending": 5,
    "streak": 8,
    "longestStreak": 11,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-10-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-10-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-10",
        "date": "2026-08-18",
        "author": "Mr. M. Ramesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "modi_kavya_0514",
    "githubUsername": "modikavya_0514"
  },
  {
    "id": "student-11",
    "rollNo": "24F85A0508",
    "name": "VUKKADALA MANASA",
    "email": "manasa24f85a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875255?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 26,
    "pending": 8,
    "streak": 9,
    "longestStreak": 15,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-11-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-11-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-11",
        "date": "2026-08-18",
        "author": "Mr. M. Ramesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "vukkadala_ma_0508",
    "githubUsername": "vukkadalam_0508"
  },
  {
    "id": "student-12",
    "rollNo": "23F81A0509",
    "name": "KUTLURU DIVYA SRI",
    "email": "divyasri23f81a0509@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875278?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 30,
    "pending": 4,
    "streak": 13,
    "longestStreak": 19,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-12-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-12-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-12",
        "date": "2026-08-18",
        "author": "Mr. M. Ramesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "kutluru_divy_0509",
    "githubUsername": "kutlurudiv_0509"
  },
  {
    "id": "student-13",
    "rollNo": "23F81A0542",
    "name": "KONERU VYSHNAVI",
    "email": "vyshnavi23f81a0542@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875301?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 18,
    "pending": 16,
    "streak": 14,
    "longestStreak": 18,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 4,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-13-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-13-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-13",
        "date": "2026-08-18",
        "author": "Mr. M. Ramesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "koneru_vyshn_0542",
    "githubUsername": "koneruvysh_0542"
  },
  {
    "id": "student-14",
    "rollNo": "23F81A0520",
    "name": "KARUMANCHI MUNI KUMAR",
    "email": "munikumar23f81a0520@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875324?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 59,
    "solved": 20,
    "attempted": 21,
    "pending": 13,
    "streak": 11,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 6,
        "total": 11
      },
      "medium": {
        "solved": 8,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-14-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-14-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 2
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-14",
        "date": "2026-08-18",
        "author": "Mrs. S. Lakshmi",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "karumanchi_m_0520",
    "githubUsername": "karumanchi_0520"
  },
  {
    "id": "student-15",
    "rollNo": "23F81A0521",
    "name": "NELLORE MUNI SAI SUDHARSAN",
    "email": "sudharsan23f81a0521@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875347?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 74,
    "solved": 25,
    "attempted": 26,
    "pending": 8,
    "streak": 12,
    "longestStreak": 14,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 10,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-15-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-15-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-15",
        "date": "2026-08-18",
        "author": "Mrs. S. Lakshmi",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "nellore_muni_0521",
    "githubUsername": "nelloremun_0521"
  },
  {
    "id": "student-16",
    "rollNo": "23F81A0529",
    "name": "PALETI SAI",
    "email": "sai23f81a0529@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875370?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 27,
    "pending": 7,
    "streak": 5,
    "longestStreak": 9,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-16-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-16-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-16",
        "date": "2026-08-18",
        "author": "Mrs. S. Lakshmi",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "paleti_sai_0529",
    "githubUsername": "paletisai_0529"
  },
  {
    "id": "student-17",
    "rollNo": "23F81A0535",
    "name": "VAVILA SRIHARI",
    "email": "srihari23f81a0535@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875393?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 31,
    "pending": 3,
    "streak": 8,
    "longestStreak": 13,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-17-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-17-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 2
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-17",
        "date": "2026-08-18",
        "author": "Mrs. S. Lakshmi",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "vavila_sriha_0535",
    "githubUsername": "vavilasrih_0535"
  },
  {
    "id": "student-18",
    "rollNo": "23F81A0527",
    "name": "PAGADALA PUNEETH",
    "email": "puneeth23f81a0527@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875416?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 5,
    "streak": 12,
    "longestStreak": 15,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-18-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-18-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-18",
        "date": "2026-08-18",
        "author": "Mrs. S. Lakshmi",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "pagadala_pun_0527",
    "githubUsername": "pagadalapu_0527"
  },
  {
    "id": "student-19",
    "rollNo": "23F81A0545",
    "name": "PILLI BHANU TEJA",
    "email": "bhanuteja23f81a0545@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875439?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Advanced",
    "progress": 76,
    "solved": 26,
    "attempted": 27,
    "pending": 7,
    "streak": 11,
    "longestStreak": 14,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-19-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-19-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-19",
        "date": "2026-08-18",
        "author": "Mr. N. Rajesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "pilli_bhanu__0545",
    "githubUsername": "pillibhanu_0545"
  },
  {
    "id": "student-20",
    "rollNo": "23F81A0562",
    "name": "BHASKAR JAYASREE",
    "email": "jayasree23f81a0562@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875462?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Advanced",
    "progress": 74,
    "solved": 25,
    "attempted": 27,
    "pending": 7,
    "streak": 6,
    "longestStreak": 8,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 10,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-20-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-20-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 3
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-20",
        "date": "2026-08-18",
        "author": "Mr. N. Rajesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "bhaskar_jaya_0562",
    "githubUsername": "bhaskarjay_0562"
  },
  {
    "id": "student-21",
    "rollNo": "23F81A0572",
    "name": "CHALLA SAILAJA",
    "email": "sailaja23f81a0572@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875485?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 32,
    "pending": 2,
    "streak": 4,
    "longestStreak": 6,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-21-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-21-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-21",
        "date": "2026-08-18",
        "author": "Mr. N. Rajesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "challa_saila_0572",
    "githubUsername": "challasail_0572"
  },
  {
    "id": "student-22",
    "rollNo": "23F81A0578",
    "name": "BONUBOYINA SRAVANI",
    "email": "sravani23f81a0578@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875508?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 18,
    "pending": 16,
    "streak": 7,
    "longestStreak": 12,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-22-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-22-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 2
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-22",
        "date": "2026-08-18",
        "author": "Mr. N. Rajesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "bonuboyina_s_0578",
    "githubUsername": "bonuboyina_0578"
  },
  {
    "id": "student-23",
    "rollNo": "24F85A0517",
    "name": "SREERAM VINEELA KEERTHI",
    "email": "vineelakeerthi24f85a0517@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875531?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 5,
    "streak": 5,
    "longestStreak": 10,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-23-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-23-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 2
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-23",
        "date": "2026-08-18",
        "author": "Mr. N. Rajesh",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "sreeram_vine_0517",
    "githubUsername": "sreeramvin_0517"
  },
  {
    "id": "student-24",
    "rollNo": "23F81A0577",
    "name": "VETTI SONI",
    "email": "soni23f81a0577@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875554?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 25,
    "pending": 9,
    "streak": 7,
    "longestStreak": 12,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-24-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-24-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-24",
        "date": "2026-08-18",
        "author": "Mrs. G. Pavani",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "vetti_soni_0577",
    "githubUsername": "vettisoni_0577"
  },
  {
    "id": "student-25",
    "rollNo": "23F81A0581",
    "name": "KALLURU VAISHNAVI",
    "email": "vaishnavi23f81a0581@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875577?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 18,
    "pending": 16,
    "streak": 3,
    "longestStreak": 9,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-25-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-25-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-25",
        "date": "2026-08-18",
        "author": "Mrs. G. Pavani",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "kalluru_vais_0581",
    "githubUsername": "kalluruvai_0581"
  },
  {
    "id": "student-26",
    "rollNo": "23F81A0576",
    "name": "CHINTHAGINJALA SILPA",
    "email": "silpa23f81a0576@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875600?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 19,
    "pending": 15,
    "streak": 4,
    "longestStreak": 7,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-26-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-26-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-26",
        "date": "2026-08-18",
        "author": "Mrs. G. Pavani",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "chinthaginja_0576",
    "githubUsername": "chinthagin_0576"
  },
  {
    "id": "student-27",
    "rollNo": "24F81A0522",
    "name": "CH. CHAKRI",
    "email": "chakri24f81a0522@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 5,
    "streak": 12,
    "longestStreak": 14,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-27-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-27-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 3
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-27",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "ch._chakri_0522",
    "githubUsername": "ch.chakri_0522"
  },
  {
    "id": "student-28",
    "rollNo": "24F81A0534",
    "name": "P. GAYANI",
    "email": "gayani24f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875646?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 19,
    "pending": 15,
    "streak": 13,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 6,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-28-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-28-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-28",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "p._gayani_0534",
    "githubUsername": "p.gayani_0534"
  },
  {
    "id": "student-29",
    "rollNo": "24F81A0504",
    "name": "P. AKHILA",
    "email": "akhila24f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875669?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Advanced",
    "progress": 65,
    "solved": 22,
    "attempted": 25,
    "pending": 9,
    "streak": 7,
    "longestStreak": 10,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-29-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-29-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 4
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-29",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "p._akhila_0504",
    "githubUsername": "p.akhila_0504"
  },
  {
    "id": "student-30",
    "rollNo": "24F81A0549",
    "name": "C. JAHNAVI",
    "email": "jahnavi24f81a0549@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875692?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Mastery",
    "progress": 88,
    "solved": 30,
    "attempted": 33,
    "pending": 1,
    "streak": 7,
    "longestStreak": 13,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 8,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-30-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-30-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-30",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "c._jahnavi_0549",
    "githubUsername": "c.jahnavi_0549"
  },
  {
    "id": "student-31",
    "rollNo": "24F81A0544",
    "name": "S. HARSHITHA",
    "email": "harshitha24f81a0544@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875715?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Advanced",
    "progress": 79,
    "solved": 27,
    "attempted": 30,
    "pending": 4,
    "streak": 11,
    "longestStreak": 14,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-31-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-31-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-31",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "s._harshitha_0544",
    "githubUsername": "s.harshith_0544"
  },
  {
    "id": "student-32",
    "rollNo": "24F81A05B2",
    "name": "S. SUDHA",
    "email": "sudha24f81a05b2@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875738?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 26,
    "pending": 8,
    "streak": 11,
    "longestStreak": 16,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 10,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-32-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-32-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-32",
        "date": "2026-08-18",
        "author": "Mrs. Ludwikha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "s._sudha_05B2",
    "githubUsername": "s.sudha_05B2"
  },
  {
    "id": "student-33",
    "rollNo": "24F81A0553",
    "name": "S. KARTHIK",
    "email": "karthik24f81a0553@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875761?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 24,
    "pending": 10,
    "streak": 13,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 7,
        "total": 11
      },
      "medium": {
        "solved": 9,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-33-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-33-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-33",
        "date": "2026-08-18",
        "author": "Mr. Vishnu",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "s._karthik_0553",
    "githubUsername": "s.karthik_0553"
  },
  {
    "id": "student-34",
    "rollNo": "24F81A0530",
    "name": "K. CHANDRA SEKHAR",
    "email": "chandrasekhar24f81a0530@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875784?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 19,
    "pending": 15,
    "streak": 5,
    "longestStreak": 11,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-34-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-34-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-34",
        "date": "2026-08-18",
        "author": "Mr. Vishnu",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "k._chandra_s_0530",
    "githubUsername": "k.chandras_0530"
  },
  {
    "id": "student-35",
    "rollNo": "24F81A0537",
    "name": "G. GOWTHAM",
    "email": "gowtham24f81a0537@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875807?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 17,
    "pending": 17,
    "streak": 3,
    "longestStreak": 7,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-35-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-35-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 3
      },
      {
        "date": "Wed",
        "count": 6
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 4
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-35",
        "date": "2026-08-18",
        "author": "Mr. Vishnu",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "g._gowtham_0537",
    "githubUsername": "g.gowtham_0537"
  },
  {
    "id": "student-36",
    "rollNo": "24F81A0532",
    "name": "M. ESWAR",
    "email": "eswar24f81a0532@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875830?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Mastery",
    "progress": 91,
    "solved": 31,
    "attempted": 32,
    "pending": 2,
    "streak": 5,
    "longestStreak": 8,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 10,
        "total": 11
      },
      "medium": {
        "solved": 13,
        "total": 14
      },
      "hard": {
        "solved": 8,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-36-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-36-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-36",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "m._eswar_0532",
    "githubUsername": "m.eswar_0532"
  },
  {
    "id": "student-37",
    "rollNo": "24F81A0554",
    "name": "K. KEERTHANA",
    "email": "keerthana24f81a0554@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875853?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 21,
    "pending": 13,
    "streak": 4,
    "longestStreak": 9,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 6,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-37-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-37-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-37",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "k._keerthana_0554",
    "githubUsername": "k.keerthan_0554"
  },
  {
    "id": "student-38",
    "rollNo": "24F81A0548",
    "name": "D. HIMA VARSHA",
    "email": "himavarsha24f81a0548@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875876?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 56,
    "solved": 19,
    "attempted": 20,
    "pending": 14,
    "streak": 6,
    "longestStreak": 8,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 6,
        "total": 11
      },
      "medium": {
        "solved": 8,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-38-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-38-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 3
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 0
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-38",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "d._hima_vars_0548",
    "githubUsername": "d.himavars_0548"
  },
  {
    "id": "student-39",
    "rollNo": "24F81A0557",
    "name": "B. KISHORE NAIK",
    "email": "kishore24f81a0557@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875899?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Advanced",
    "progress": 76,
    "solved": 26,
    "attempted": 29,
    "pending": 5,
    "streak": 9,
    "longestStreak": 15,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 11,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-39-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-39-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 1
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-39",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "b._kishore_n_0557",
    "githubUsername": "b.kishoren_0557"
  },
  {
    "id": "student-40",
    "rollNo": "24F81A0508",
    "name": "E. ANUSHA",
    "email": "anusha24f81a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875922?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 18,
    "pending": 16,
    "streak": 8,
    "longestStreak": 12,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-40-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-40-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 1
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-40",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "e._anusha_0508",
    "githubUsername": "e.anusha_0508"
  },
  {
    "id": "student-41",
    "rollNo": "24F81A0550",
    "name": "U. JHANAKI",
    "email": "jhanaki24f81a0550@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875945?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 25,
    "pending": 9,
    "streak": 11,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 4,
        "total": 6,
        "percentage": 66
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 8,
        "total": 11
      },
      "medium": {
        "solved": 10,
        "total": 14
      },
      "hard": {
        "solved": 6,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-41-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-41-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 2
      },
      {
        "date": "Tue",
        "count": 4
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-41",
        "date": "2026-08-18",
        "author": "Mrs. Manjusha",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "u._jhanaki_0550",
    "githubUsername": "u.jhanaki_0550"
  },
  {
    "id": "student-42",
    "rollNo": "24F81A05C7",
    "name": "M. VENKATESWARLU",
    "email": "venkateswarlu24f81a05c7@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875968?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 30,
    "pending": 4,
    "streak": 14,
    "longestStreak": 18,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-42-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-42-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 3
      },
      {
        "date": "Thu",
        "count": 6
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-42",
        "date": "2026-08-18",
        "author": "Mrs. Teja",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "m._venkatesw_05C7",
    "githubUsername": "m.venkates_05C7"
  },
  {
    "id": "student-43",
    "rollNo": "24F81A0591",
    "name": "P. PRASANNA KUMAR",
    "email": "prasanna24f81a0591@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875991?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 20,
    "pending": 14,
    "streak": 9,
    "longestStreak": 12,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 7,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-43-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-43-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 3
      },
      {
        "date": "Fri",
        "count": 4
      },
      {
        "date": "Sat",
        "count": 2
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-43",
        "date": "2026-08-18",
        "author": "Mrs. Teja",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "p._prasanna__0591",
    "githubUsername": "p.prasanna_0591"
  },
  {
    "id": "student-44",
    "rollNo": "24F81A0590",
    "name": "T. PRABAKAR",
    "email": "prabakar24f81a0590@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876014?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Advanced",
    "progress": 62,
    "solved": 21,
    "attempted": 24,
    "pending": 10,
    "streak": 12,
    "longestStreak": 16,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Stack": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 3,
        "total": 5,
        "percentage": 60
      },
      "Graphs": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 6,
        "total": 11
      },
      "medium": {
        "solved": 8,
        "total": 14
      },
      "hard": {
        "solved": 5,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-44-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-44-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 4
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 4
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-44",
        "date": "2026-08-18",
        "author": "Mrs. Teja",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "t._prabakar_0590",
    "githubUsername": "t.prabakar_0590"
  },
  {
    "id": "student-45",
    "rollNo": "24F81A05C0",
    "name": "T. TEJA",
    "email": "teja24f81a05c0@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876037?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 31,
    "pending": 3,
    "streak": 11,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Queue": {
        "solved": 1,
        "total": 2,
        "percentage": 50
      },
      "Trees": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Graphs": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Dynamic Programming": {
        "solved": 5,
        "total": 6,
        "percentage": 83
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 9,
        "total": 11
      },
      "medium": {
        "solved": 12,
        "total": 14
      },
      "hard": {
        "solved": 7,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-45-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-45-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 3
      },
      {
        "date": "Tue",
        "count": 2
      },
      {
        "date": "Wed",
        "count": 2
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 1
      },
      {
        "date": "Sun",
        "count": 2
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-45",
        "date": "2026-08-18",
        "author": "Mrs. Teja",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "t._teja_05C0",
    "githubUsername": "t.teja_05C0"
  },
  {
    "id": "student-46",
    "rollNo": "24F81A0592",
    "name": "E. PRASHANTH",
    "email": "prashanth24f81a0592@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876060?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 16,
    "pending": 18,
    "streak": 10,
    "longestStreak": 16,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Strings": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Linked Lists": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 1,
        "total": 4,
        "percentage": 25
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 5,
        "total": 11
      },
      "medium": {
        "solved": 6,
        "total": 14
      },
      "hard": {
        "solved": 4,
        "total": 9
      }
    },
    "recentActivities": [
      {
        "id": "act-46-1",
        "action": "Solved Problem",
        "problemTitle": "Two Sum",
        "topic": "Arrays",
        "timestamp": "2026-08-20T10:30:00Z",
        "timeAgo": "2 hours ago",
        "status": "Completed",
        "difficulty": "Easy"
      },
      {
        "id": "act-46-2",
        "action": "Attempted Problem",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "timestamp": "2026-08-19T14:15:00Z",
        "timeAgo": "1 day ago",
        "status": "Completed",
        "difficulty": "Medium"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 1
      },
      {
        "date": "Tue",
        "count": 5
      },
      {
        "date": "Wed",
        "count": 4
      },
      {
        "date": "Thu",
        "count": 7
      },
      {
        "date": "Fri",
        "count": 3
      },
      {
        "date": "Sat",
        "count": 3
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-46",
        "date": "2026-08-18",
        "author": "Mrs. Teja",
        "note": "Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals."
      }
    ],
    "leetcodeUsername": "e._prashanth_0592",
    "githubUsername": "e.prashant_0592"
  }
];

export const ALL_TEAMS: Team[] = [
  {
    "id": "team-2",
    "teamNumber": "Team 02",
    "name": "Binary Bandits",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "mentorEmail": "radhika.p@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-6",
      "student-7",
      "student-8",
      "student-9"
    ],
    "avgProgress": 76,
    "totalSolved": 103,
    "totalAttempted": 109,
    "avgStreak": 9.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 1
  },
  {
    "id": "team-11",
    "teamNumber": "Team 11",
    "name": "Matrix Masters",
    "mentorId": "mentor-11",
    "mentorName": "Dr. M. Srinivasa Rao",
    "mentorEmail": "mentor.11@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 2
  },
  {
    "id": "team-12",
    "teamNumber": "Team 12",
    "name": "Hash Hackers",
    "mentorId": "mentor-12",
    "mentorName": "Prof. Sunita Deshmukh",
    "mentorEmail": "mentor.12@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 3
  },
  {
    "id": "team-13",
    "teamNumber": "Team 13",
    "name": "Pointer Prodigies",
    "mentorId": "mentor-13",
    "mentorName": "Dr. Ananya Ray",
    "mentorEmail": "mentor.13@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 4
  },
  {
    "id": "team-14",
    "teamNumber": "Team 14",
    "name": "Greedy Giants",
    "mentorId": "mentor-14",
    "mentorName": "Prof. K. Venkatesh",
    "mentorEmail": "mentor.14@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 5
  },
  {
    "id": "team-15",
    "teamNumber": "Team 15",
    "name": "Backtrack Busters",
    "mentorId": "mentor-15",
    "mentorName": "Dr. P. Rajesh Kumar",
    "mentorEmail": "mentor.15@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 6
  },
  {
    "id": "team-16",
    "teamNumber": "Team 16",
    "name": "Trie Troopers",
    "mentorId": "mentor-16",
    "mentorName": "Prof. B. Deepa",
    "mentorEmail": "mentor.16@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 7
  },
  {
    "id": "team-17",
    "teamNumber": "Team 17",
    "name": "Search Specialists",
    "mentorId": "mentor-17",
    "mentorName": "Dr. S. Mohan Das",
    "mentorEmail": "mentor.17@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 8
  },
  {
    "id": "team-18",
    "teamNumber": "Team 18",
    "name": "Sorting Stars",
    "mentorId": "mentor-18",
    "mentorName": "Prof. Kavita Reddy",
    "mentorEmail": "mentor.18@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 9
  },
  {
    "id": "team-19",
    "teamNumber": "Team 19",
    "name": "Divide Conquerors",
    "mentorId": "mentor-19",
    "mentorName": "Dr. C. Balasubramanian",
    "mentorEmail": "mentor.19@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 10
  },
  {
    "id": "team-20",
    "teamNumber": "Team 20",
    "name": "Logic Lords",
    "mentorId": "mentor-20",
    "mentorName": "Prof. Meera Nair",
    "mentorEmail": "mentor.20@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 75,
    "totalSolved": 110,
    "totalAttempted": 130,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 11
  },
  {
    "id": "team-4",
    "teamNumber": "Team 04",
    "name": "Graph Gurus",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "mentorEmail": "lakshmi.s@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-14",
      "student-15",
      "student-16",
      "student-17",
      "student-18"
    ],
    "avgProgress": 74,
    "totalSolved": 125,
    "totalAttempted": 134,
    "avgStreak": 9.6,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 12
  },
  {
    "id": "team-5",
    "teamNumber": "Team 05",
    "name": "Stack Smashers",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "mentorEmail": "rajesh.n@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-19",
      "student-20",
      "student-21",
      "student-22",
      "student-23"
    ],
    "avgProgress": 73,
    "totalSolved": 125,
    "totalAttempted": 133,
    "avgStreak": 6.6,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 13
  },
  {
    "id": "team-7",
    "teamNumber": "Team 07",
    "name": "Tree Titans",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludwikha",
    "mentorEmail": "ludwikha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-27",
      "student-28",
      "student-29",
      "student-30",
      "student-31",
      "student-32"
    ],
    "avgProgress": 73,
    "totalSolved": 149,
    "totalAttempted": 162,
    "avgStreak": 10.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 14
  },
  {
    "id": "team-3",
    "teamNumber": "Team 03",
    "name": "Dynamic Dynamos",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "mentorEmail": "ramesh.m@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-10",
      "student-11",
      "student-12",
      "student-13"
    ],
    "avgProgress": 69,
    "totalSolved": 94,
    "totalAttempted": 103,
    "avgStreak": 11.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 15
  },
  {
    "id": "team-9",
    "teamNumber": "Team 09",
    "name": "Bitwise Battlers",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "mentorEmail": "manjusha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-36",
      "student-37",
      "student-38",
      "student-39",
      "student-40",
      "student-41"
    ],
    "avgProgress": 66,
    "totalSolved": 134,
    "totalAttempted": 145,
    "avgStreak": 7.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 16
  },
  {
    "id": "team-10",
    "teamNumber": "Team 10",
    "name": "Heap Heroes",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "mentorEmail": "teja.faculty@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-42",
      "student-43",
      "student-44",
      "student-45",
      "student-46"
    ],
    "avgProgress": 65,
    "totalSolved": 111,
    "totalAttempted": 121,
    "avgStreak": 11.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 17
  },
  {
    "id": "team-1",
    "teamNumber": "Team 01",
    "name": "Algorithm Aces",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "mentorEmail": "suresh.kumar@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5"
    ],
    "avgProgress": 58,
    "totalSolved": 98,
    "totalAttempted": 104,
    "avgStreak": 9.2,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 18
  },
  {
    "id": "team-6",
    "teamNumber": "Team 06",
    "name": "Queue Queens",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "mentorEmail": "pavani.g@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-24",
      "student-25",
      "student-26"
    ],
    "avgProgress": 55,
    "totalSolved": 56,
    "totalAttempted": 62,
    "avgStreak": 4.7,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 19
  },
  {
    "id": "team-8",
    "teamNumber": "Team 08",
    "name": "Recursion Rangers",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "mentorEmail": "vishnu@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-33",
      "student-34",
      "student-35"
    ],
    "avgProgress": 53,
    "totalSolved": 54,
    "totalAttempted": 60,
    "avgStreak": 7.0,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 80,
      "Linked Lists": 78,
      "Stack": 74,
      "Queue": 70,
      "Trees": 68,
      "Graphs": 62,
      "Dynamic Programming": 58
    },
    "rank": 20
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
  name: 'Mrs. Ludwikha',
  email: 'ludwikha@gkce.edu.in',
  role: 'MENTOR',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  title: 'Faculty Mentor, Dept. of CSE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  mentorData: ALL_MENTORS.find(m => m.id === 'mentor-7'),
};

export const DEFAULT_STUDENT_USER: CurrentUser = {
  id: 'student-27',
  name: 'CH. CHAKRI',
  email: 'chakri24f81a0522@gkce.edu.in',
  role: 'STUDENT',
  avatar: 'https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80',
  title: 'B.Tech Student, GKCE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  studentData: ALL_STUDENTS.find(s => s.id === 'student-27'),
};
