import { DSATopic, Mentor, Problem, Student, Team, CurrentUser } from '../types';

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
    "name": "Mrs. Ludvika",
    "email": "ludvika@gkce.edu.in",
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
    "email": "23f81a0502@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875025?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 26,
    "pending": 11,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 11,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-1-1",
        "studentId": "student-1",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-1-2",
        "studentId": "student-1",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-1-3",
        "studentId": "student-1",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-1-4",
        "studentId": "student-1",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-1-1",
        "author": "Dr. K. Suresh Kumar",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-2",
    "rollNo": "23F81A0507",
    "name": "PITTI DEVIKA (MQ)",
    "email": "23f81a0507@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875048?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 18,
    "pending": 19,
    "streak": 3,
    "longestStreak": 7,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 3,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-2-1",
        "studentId": "student-2",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-2-2",
        "studentId": "student-2",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-2-3",
        "studentId": "student-2",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-2-4",
        "studentId": "student-2",
        "action": "Solved",
        "problemTitle": "Maximum Subarray",
        "topic": "Dynamic Programming",
        "difficulty": "Easy",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 2
      },
      {
        "date": "Thu",
        "count": 2
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
        "id": "note-2-1",
        "author": "Dr. K. Suresh Kumar",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-3",
    "rollNo": "23F81A0513",
    "name": "GALLA KAVITHA",
    "email": "23f81a0513@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875071?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 31,
    "pending": 6,
    "streak": 12,
    "longestStreak": 18,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 1,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-3-1",
        "studentId": "student-3",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-3-2",
        "studentId": "student-3",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-3-3",
        "studentId": "student-3",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-3-4",
        "studentId": "student-3",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 6
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
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-3-1",
        "author": "Dr. K. Suresh Kumar",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Arrays curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-4",
    "rollNo": "23F81A0511",
    "name": "BATTA JASWITHA",
    "email": "23f81a0511@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875094?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 18,
    "pending": 18,
    "streak": 4,
    "longestStreak": 7,
    "status": "Needs Attention",
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
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 4,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-4-1",
        "studentId": "student-4",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-4-2",
        "studentId": "student-4",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-4-3",
        "studentId": "student-4",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-4-4",
        "studentId": "student-4",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-4-1",
        "author": "Dr. K. Suresh Kumar",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-5",
    "rollNo": "23F81A0538",
    "name": "JEELAGA THANUSHA",
    "email": "23f81a0538@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875117?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 19,
    "pending": 18,
    "streak": 5,
    "longestStreak": 10,
    "status": "Needs Attention",
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
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 4,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-5-1",
        "studentId": "student-5",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-5-2",
        "studentId": "student-5",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-5-3",
        "studentId": "student-5",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-5-4",
        "studentId": "student-5",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-5-1",
        "author": "Dr. K. Suresh Kumar",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-6",
    "rollNo": "23F81A0510",
    "name": "SHAIK HABEEBA",
    "email": "23f81a0510@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875140?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Mastery",
    "progress": 94,
    "solved": 32,
    "attempted": 34,
    "pending": 2,
    "streak": 14,
    "longestStreak": 18,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Queue": {
        "solved": 2,
        "total": 2,
        "percentage": 100
      },
      "Trees": {
        "solved": 5,
        "total": 5,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 5,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-6-1",
        "studentId": "student-6",
        "action": "Solved",
        "problemTitle": "Binary Tree Maximum Path Sum",
        "topic": "Trees",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-6-2",
        "studentId": "student-6",
        "action": "Solved",
        "problemTitle": "Sliding Window Maximum",
        "topic": "Queue",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-6-3",
        "studentId": "student-6",
        "action": "Solved",
        "problemTitle": "Largest Rectangle in Histogram",
        "topic": "Stack",
        "difficulty": "Hard",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-6-4",
        "studentId": "student-6",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 7
      },
      {
        "date": "Tue",
        "count": 6
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 8
      },
      {
        "date": "Fri",
        "count": 8
      },
      {
        "date": "Sat",
        "count": 6
      },
      {
        "date": "Sun",
        "count": 5
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-6-1",
        "author": "Mrs. P. Radhika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Trees curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-7",
    "rollNo": "23F81A0504",
    "name": "GADDAM BHARGAVI",
    "email": "23f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875163?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 21,
    "pending": 16,
    "streak": 6,
    "longestStreak": 11,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 6,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-7-1",
        "studentId": "student-7",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-7-2",
        "studentId": "student-7",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-7-3",
        "studentId": "student-7",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-7-4",
        "studentId": "student-7",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
      },
      {
        "date": "Thu",
        "count": 4
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
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-7-1",
        "author": "Mrs. P. Radhika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Stack curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-8",
    "rollNo": "23F81A0525",
    "name": "GADDAM PALLAVI",
    "email": "23f81a0525@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875186?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 27,
    "pending": 10,
    "streak": 9,
    "longestStreak": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 12,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-8-1",
        "studentId": "student-8",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-8-2",
        "studentId": "student-8",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-8-3",
        "studentId": "student-8",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-8-4",
        "studentId": "student-8",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 4
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 4
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-8-1",
        "author": "Mrs. P. Radhika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-9",
    "rollNo": "23F81A0534",
    "name": "KATURU SRAVANTHI",
    "email": "23f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875209?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 30,
    "pending": 5,
    "streak": 11,
    "longestStreak": 15,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 2,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-9-1",
        "studentId": "student-9",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-9-2",
        "studentId": "student-9",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-9-3",
        "studentId": "student-9",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-9-4",
        "studentId": "student-9",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-9-1",
        "author": "Mrs. P. Radhika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-10",
    "rollNo": "23F81A0514",
    "name": "MODI KAVYA",
    "email": "23f81a0514@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875232?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Advanced",
    "progress": 79,
    "solved": 27,
    "attempted": 30,
    "pending": 7,
    "streak": 10,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-10-1",
        "studentId": "student-10",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-10-2",
        "studentId": "student-10",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-10-3",
        "studentId": "student-10",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-10-4",
        "studentId": "student-10",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-10-1",
        "author": "Mr. M. Ramesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-11",
    "rollNo": "24F85A0508",
    "name": "VUKKADALA MANASA",
    "email": "24f85a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875255?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 24,
    "pending": 11,
    "streak": 7,
    "longestStreak": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 11,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-11-1",
        "studentId": "student-11",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-11-2",
        "studentId": "student-11",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-11-3",
        "studentId": "student-11",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-11-4",
        "studentId": "student-11",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-11-1",
        "author": "Mr. M. Ramesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-12",
    "rollNo": "23F81A0509",
    "name": "KUTLURU DIVYA SRI",
    "email": "23f81a0509@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875278?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 32,
    "pending": 5,
    "streak": 13,
    "longestStreak": 19,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 2,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-12-1",
        "studentId": "student-12",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-12-2",
        "studentId": "student-12",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-12-3",
        "studentId": "student-12",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-12-4",
        "studentId": "student-12",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 6
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
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-12-1",
        "author": "Mr. M. Ramesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-13",
    "rollNo": "23F81A0542",
    "name": "KONERU VYSHNAVI",
    "email": "23f81a0542@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875301?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 17,
    "pending": 19,
    "streak": 3,
    "longestStreak": 7,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 3,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-13-1",
        "studentId": "student-13",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-13-2",
        "studentId": "student-13",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-13-3",
        "studentId": "student-13",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-13-4",
        "studentId": "student-13",
        "action": "Solved",
        "problemTitle": "Maximum Subarray",
        "topic": "Dynamic Programming",
        "difficulty": "Easy",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 2
      },
      {
        "date": "Thu",
        "count": 2
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
        "id": "note-13-1",
        "author": "Mr. M. Ramesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-14",
    "rollNo": "23F81A0520",
    "name": "KARUMANCHI MUNI KUMAR",
    "email": "23f81a0520@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875324?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 59,
    "solved": 20,
    "attempted": 23,
    "pending": 14,
    "streak": 6,
    "longestStreak": 11,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 8,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-14-1",
        "studentId": "student-14",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-14-2",
        "studentId": "student-14",
        "action": "Solved",
        "problemTitle": "Daily Temperatures",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-14-3",
        "studentId": "student-14",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-14-4",
        "studentId": "student-14",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-14-1",
        "author": "Mrs. S. Lakshmi",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Trees curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-15",
    "rollNo": "23F81A0521",
    "name": "NELLORE MUNI SAI SUDHARSAN",
    "email": "23f81a0521@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875347?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 74,
    "solved": 25,
    "attempted": 28,
    "pending": 9,
    "streak": 8,
    "longestStreak": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 13,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-15-1",
        "studentId": "student-15",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-15-2",
        "studentId": "student-15",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-15-3",
        "studentId": "student-15",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-15-4",
        "studentId": "student-15",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-15-1",
        "author": "Mrs. S. Lakshmi",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-16",
    "rollNo": "23F81A0529",
    "name": "PALETI SAI",
    "email": "23f81a0529@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875370?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 26,
    "pending": 10,
    "streak": 7,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 12,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-16-1",
        "studentId": "student-16",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-16-2",
        "studentId": "student-16",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-16-3",
        "studentId": "student-16",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-16-4",
        "studentId": "student-16",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-16-1",
        "author": "Mrs. S. Lakshmi",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-17",
    "rollNo": "23F81A0535",
    "name": "VAVILA SRIHARI",
    "email": "23f81a0535@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875393?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 6,
    "streak": 11,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 1,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-17-1",
        "studentId": "student-17",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-17-2",
        "studentId": "student-17",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-17-3",
        "studentId": "student-17",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-17-4",
        "studentId": "student-17",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-17-1",
        "author": "Mrs. S. Lakshmi",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Arrays curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-18",
    "rollNo": "23F81A0527",
    "name": "PAGADALA PUNEETH",
    "email": "23f81a0527@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875416?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 6,
    "streak": 12,
    "longestStreak": 17,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 1,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-18-1",
        "studentId": "student-18",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-18-2",
        "studentId": "student-18",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-18-3",
        "studentId": "student-18",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-18-4",
        "studentId": "student-18",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 6
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
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-18-1",
        "author": "Mrs. S. Lakshmi",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Arrays curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-19",
    "rollNo": "23F81A0545",
    "name": "PILLI BHANU TEJA",
    "email": "23f81a0545@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875439?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Advanced",
    "progress": 76,
    "solved": 26,
    "attempted": 28,
    "pending": 8,
    "streak": 9,
    "longestStreak": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "percentage": 67
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 14,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-19-1",
        "studentId": "student-19",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-19-2",
        "studentId": "student-19",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-19-3",
        "studentId": "student-19",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-19-4",
        "studentId": "student-19",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-19-1",
        "author": "Mr. N. Rajesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-20",
    "rollNo": "23F81A0562",
    "name": "BHASKAR JAYASREE",
    "email": "23f81a0562@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875462?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Advanced",
    "progress": 74,
    "solved": 25,
    "attempted": 27,
    "pending": 9,
    "streak": 8,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 3,
        "total": 6,
        "percentage": 50
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 13,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-20-1",
        "studentId": "student-20",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-20-2",
        "studentId": "student-20",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-20-3",
        "studentId": "student-20",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-20-4",
        "studentId": "student-20",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-20-1",
        "author": "Mr. N. Rajesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-21",
    "rollNo": "23F81A0572",
    "name": "CHALLA SAILAJA",
    "email": "23f81a0572@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875485?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 31,
    "pending": 5,
    "streak": 14,
    "longestStreak": 20,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 2,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-21-1",
        "studentId": "student-21",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-21-2",
        "studentId": "student-21",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-21-3",
        "studentId": "student-21",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-21-4",
        "studentId": "student-21",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 7
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
        "count": 8
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-21-1",
        "author": "Mr. N. Rajesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-22",
    "rollNo": "23F81A0578",
    "name": "BONUBOYINA SRAVANI",
    "email": "23f81a0578@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875508?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 20,
    "pending": 17,
    "streak": 4,
    "longestStreak": 7,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 5,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-22-1",
        "studentId": "student-22",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-22-2",
        "studentId": "student-22",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-22-3",
        "studentId": "student-22",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-22-4",
        "studentId": "student-22",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-22-1",
        "author": "Mr. N. Rajesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Linked Lists curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-23",
    "rollNo": "24F85A0517",
    "name": "SREERAM VINEELA KEERTHI",
    "email": "24f85a0517@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875531?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 31,
    "pending": 6,
    "streak": 10,
    "longestStreak": 12,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 1,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-23-1",
        "studentId": "student-23",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-23-2",
        "studentId": "student-23",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-23-3",
        "studentId": "student-23",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-23-4",
        "studentId": "student-23",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-23-1",
        "author": "Mr. N. Rajesh",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Arrays curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-24",
    "rollNo": "23F81A0577",
    "name": "VETTI SONI",
    "email": "23f81a0577@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875554?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 26,
    "pending": 11,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 11,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-24-1",
        "studentId": "student-24",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-24-2",
        "studentId": "student-24",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-24-3",
        "studentId": "student-24",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-24-4",
        "studentId": "student-24",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-24-1",
        "author": "Mrs. G. Pavani",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-25",
    "rollNo": "23F81A0581",
    "name": "KALLURU VAISHNAVI",
    "email": "23f81a0581@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875577?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 18,
    "pending": 17,
    "streak": 5,
    "longestStreak": 11,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 5,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-25-1",
        "studentId": "student-25",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-25-2",
        "studentId": "student-25",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-25-3",
        "studentId": "student-25",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-25-4",
        "studentId": "student-25",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-25-1",
        "author": "Mrs. G. Pavani",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Linked Lists curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-26",
    "rollNo": "23F81A0576",
    "name": "CHINTHAGINJALA SILPA",
    "email": "23f81a0576@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875600?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 18,
    "pending": 18,
    "streak": 4,
    "longestStreak": 6,
    "status": "Needs Attention",
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
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 4,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-26-1",
        "studentId": "student-26",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-26-2",
        "studentId": "student-26",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-26-3",
        "studentId": "student-26",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-26-4",
        "studentId": "student-26",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-26-1",
        "author": "Mrs. G. Pavani",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-27",
    "rollNo": "24F81A0522",
    "name": "CH. CHAKRI",
    "email": "chakri.24f81a0522@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Mastery",
    "progress": 82,
    "solved": 28,
    "attempted": 29,
    "pending": 6,
    "streak": 14,
    "longestStreak": 20,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 1,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-27-1",
        "studentId": "student-27",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-27-2",
        "studentId": "student-27",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-27-3",
        "studentId": "student-27",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-27-4",
        "studentId": "student-27",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 7
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
        "count": 8
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-27-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Arrays curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-28",
    "rollNo": "24F81A0534",
    "name": "P. GAYANI",
    "email": "24f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875646?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 21,
    "pending": 16,
    "streak": 5,
    "longestStreak": 7,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 6,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-28-1",
        "studentId": "student-28",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-28-2",
        "studentId": "student-28",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-28-3",
        "studentId": "student-28",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-28-4",
        "studentId": "student-28",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-28-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Stack curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-29",
    "rollNo": "24F81A0504",
    "name": "P. AKHILA",
    "email": "24f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875669?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Advanced",
    "progress": 65,
    "solved": 22,
    "attempted": 23,
    "pending": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 10,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-29-1",
        "studentId": "student-29",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-29-2",
        "studentId": "student-29",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-29-3",
        "studentId": "student-29",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-29-4",
        "studentId": "student-29",
        "action": "Solved",
        "problemTitle": "Daily Temperatures",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 5
      },
      {
        "date": "Fri",
        "count": 5
      },
      {
        "date": "Sat",
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-29-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-30",
    "rollNo": "24F81A0549",
    "name": "C. JAHNAVI",
    "email": "24f81a0549@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875692?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Mastery",
    "progress": 88,
    "solved": 30,
    "attempted": 32,
    "pending": 4,
    "streak": 13,
    "longestStreak": 15,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 3,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-30-1",
        "studentId": "student-30",
        "action": "Solved",
        "problemTitle": "Largest Rectangle in Histogram",
        "topic": "Stack",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-30-2",
        "studentId": "student-30",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-30-3",
        "studentId": "student-30",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-30-4",
        "studentId": "student-30",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 6
      },
      {
        "date": "Tue",
        "count": 6
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
        "count": 7
      },
      {
        "date": "Sat",
        "count": 6
      },
      {
        "date": "Sun",
        "count": 5
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-30-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Stack curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-31",
    "rollNo": "24F81A0544",
    "name": "S. HARSHITHA",
    "email": "24f81a0544@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875715?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Advanced",
    "progress": 79,
    "solved": 27,
    "attempted": 29,
    "pending": 7,
    "streak": 10,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-31-1",
        "studentId": "student-31",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-31-2",
        "studentId": "student-31",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-31-3",
        "studentId": "student-31",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-31-4",
        "studentId": "student-31",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-31-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-32",
    "rollNo": "24F81A05B2",
    "name": "S. SUDHA",
    "email": "24f81a05b2@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875738?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 26,
    "pending": 10,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 12,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-32-1",
        "studentId": "student-32",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-32-2",
        "studentId": "student-32",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-32-3",
        "studentId": "student-32",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-32-4",
        "studentId": "student-32",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-32-1",
        "author": "Mrs. Ludvika",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-33",
    "rollNo": "24F81A0553",
    "name": "S. KARTHIK",
    "email": "24f81a0553@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875761?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Advanced",
    "progress": 68,
    "solved": 23,
    "attempted": 26,
    "pending": 11,
    "streak": 7,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 11,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-33-1",
        "studentId": "student-33",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-33-2",
        "studentId": "student-33",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-33-3",
        "studentId": "student-33",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-33-4",
        "studentId": "student-33",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-33-1",
        "author": "Mr. Vishnu",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-34",
    "rollNo": "24F81A0530",
    "name": "K. CHANDRA SEKHAR",
    "email": "24f81a0530@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875784?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 18,
    "pending": 18,
    "streak": 4,
    "longestStreak": 8,
    "status": "Needs Attention",
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
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 4,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-34-1",
        "studentId": "student-34",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-34-2",
        "studentId": "student-34",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-34-3",
        "studentId": "student-34",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-34-4",
        "studentId": "student-34",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-34-1",
        "author": "Mr. Vishnu",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-35",
    "rollNo": "24F81A0537",
    "name": "G. GOWTHAM",
    "email": "24f81a0537@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875807?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 16,
    "pending": 19,
    "streak": 3,
    "longestStreak": 9,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 3,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-35-1",
        "studentId": "student-35",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-35-2",
        "studentId": "student-35",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-35-3",
        "studentId": "student-35",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-35-4",
        "studentId": "student-35",
        "action": "Solved",
        "problemTitle": "Maximum Subarray",
        "topic": "Dynamic Programming",
        "difficulty": "Easy",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 2
      },
      {
        "date": "Thu",
        "count": 2
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
        "id": "note-35-1",
        "author": "Mr. Vishnu",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-36",
    "rollNo": "24F81A0532",
    "name": "M. ESWAR",
    "email": "24f81a0532@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875830?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Mastery",
    "progress": 91,
    "solved": 31,
    "attempted": 32,
    "pending": 3,
    "streak": 15,
    "longestStreak": 21,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Queue": {
        "solved": 2,
        "total": 2,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 4,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-36-1",
        "studentId": "student-36",
        "action": "Solved",
        "problemTitle": "Sliding Window Maximum",
        "topic": "Queue",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-36-2",
        "studentId": "student-36",
        "action": "Solved",
        "problemTitle": "Largest Rectangle in Histogram",
        "topic": "Stack",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-36-3",
        "studentId": "student-36",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-36-4",
        "studentId": "student-36",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 7
      },
      {
        "date": "Tue",
        "count": 6
      },
      {
        "date": "Wed",
        "count": 5
      },
      {
        "date": "Thu",
        "count": 8
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 6
      },
      {
        "date": "Sun",
        "count": 5
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-36-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Queue curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-37",
    "rollNo": "24F81A0554",
    "name": "K. KEERTHANA",
    "email": "24f81a0554@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875853?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 53,
    "solved": 18,
    "attempted": 21,
    "pending": 16,
    "streak": 5,
    "longestStreak": 11,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 6,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-37-1",
        "studentId": "student-37",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-37-2",
        "studentId": "student-37",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-37-3",
        "studentId": "student-37",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-37-4",
        "studentId": "student-37",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-37-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Stack curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-38",
    "rollNo": "24F81A0548",
    "name": "D. HIMA VARSHA",
    "email": "24f81a0548@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875876?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 56,
    "solved": 19,
    "attempted": 20,
    "pending": 15,
    "streak": 6,
    "longestStreak": 10,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 5,
        "percentage": 40
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 7,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-38-1",
        "studentId": "student-38",
        "action": "Solved",
        "problemTitle": "Daily Temperatures",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-38-2",
        "studentId": "student-38",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-38-3",
        "studentId": "student-38",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-38-4",
        "studentId": "student-38",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
      },
      {
        "date": "Thu",
        "count": 4
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
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-38-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Stack curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-39",
    "rollNo": "24F81A0557",
    "name": "B. KISHORE NAIK",
    "email": "24f81a0557@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875899?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Advanced",
    "progress": 76,
    "solved": 26,
    "attempted": 27,
    "pending": 8,
    "streak": 9,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "percentage": 67
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 14,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-39-1",
        "studentId": "student-39",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-39-2",
        "studentId": "student-39",
        "action": "Solved",
        "problemTitle": "Coin Change",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-39-3",
        "studentId": "student-39",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-39-4",
        "studentId": "student-39",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-39-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Dynamic Programming curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-40",
    "rollNo": "24F81A0508",
    "name": "E. ANUSHA",
    "email": "24f81a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875922?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Intermediate",
    "progress": 47,
    "solved": 16,
    "attempted": 19,
    "pending": 18,
    "streak": 4,
    "longestStreak": 10,
    "status": "Needs Attention",
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
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 4,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-40-1",
        "studentId": "student-40",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-40-2",
        "studentId": "student-40",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-40-3",
        "studentId": "student-40",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-40-4",
        "studentId": "student-40",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-40-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-41",
    "rollNo": "24F81A0550",
    "name": "U. JHANAKI",
    "email": "24f81a0550@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875945?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Advanced",
    "progress": 71,
    "solved": 24,
    "attempted": 25,
    "pending": 10,
    "streak": 8,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 12,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-41-1",
        "studentId": "student-41",
        "action": "Solved",
        "problemTitle": "Course Schedule",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-41-2",
        "studentId": "student-41",
        "action": "Solved",
        "problemTitle": "Clone Graph",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-41-3",
        "studentId": "student-41",
        "action": "Solved",
        "problemTitle": "Number of Islands",
        "topic": "Graphs",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-41-4",
        "studentId": "student-41",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 4
      },
      {
        "date": "Thu",
        "count": 5
      },
      {
        "date": "Fri",
        "count": 6
      },
      {
        "date": "Sat",
        "count": 4
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-41-1",
        "author": "Mrs. Manjusha",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Graphs curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-42",
    "rollNo": "24F81A05C7",
    "name": "M. VENKATESWARLU",
    "email": "24f81a05c7@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875968?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 32,
    "pending": 5,
    "streak": 11,
    "longestStreak": 13,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 2,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-42-1",
        "studentId": "student-42",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-42-2",
        "studentId": "student-42",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-42-3",
        "studentId": "student-42",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-42-4",
        "studentId": "student-42",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 5
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
        "count": 6
      },
      {
        "date": "Fri",
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-42-1",
        "author": "Mrs. Teja",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-43",
    "rollNo": "24F81A0591",
    "name": "P. PRASANNA KUMAR",
    "email": "24f81a0591@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875991?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Intermediate",
    "progress": 50,
    "solved": 17,
    "attempted": 20,
    "pending": 17,
    "streak": 4,
    "longestStreak": 9,
    "status": "Needs Attention",
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
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 5,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-43-1",
        "studentId": "student-43",
        "action": "Solved",
        "problemTitle": "Remove Nth Node From End of List",
        "topic": "Linked Lists",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-43-2",
        "studentId": "student-43",
        "action": "Solved",
        "problemTitle": "Longest Palindromic Substring",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-43-3",
        "studentId": "student-43",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-43-4",
        "studentId": "student-43",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "id": "note-43-1",
        "author": "Mrs. Teja",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Linked Lists curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-44",
    "rollNo": "24F81A0590",
    "name": "T. PRABAKAR",
    "email": "24f81a0590@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876014?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Advanced",
    "progress": 62,
    "solved": 21,
    "attempted": 23,
    "pending": 13,
    "streak": 6,
    "longestStreak": 12,
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
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 9,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-44-1",
        "studentId": "student-44",
        "action": "Solved",
        "problemTitle": "Binary Tree Level Order Traversal",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-44-2",
        "studentId": "student-44",
        "action": "Solved",
        "problemTitle": "Lowest Common Ancestor of a BST",
        "topic": "Trees",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-44-3",
        "studentId": "student-44",
        "action": "Solved",
        "problemTitle": "Daily Temperatures",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-44-4",
        "studentId": "student-44",
        "action": "Solved",
        "problemTitle": "Min Stack",
        "topic": "Stack",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 3
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
        "count": 4
      },
      {
        "date": "Sun",
        "count": 3
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-44-1",
        "author": "Mrs. Teja",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Trees curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-45",
    "rollNo": "24F81A05C0",
    "name": "T. TEJA",
    "email": "24f81a05c0@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876037?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Mastery",
    "progress": 85,
    "solved": 29,
    "attempted": 32,
    "pending": 5,
    "streak": 12,
    "longestStreak": 14,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 5,
        "total": 5,
        "percentage": 100
      },
      "Strings": {
        "solved": 4,
        "total": 4,
        "percentage": 100
      },
      "Linked Lists": {
        "solved": 4,
        "total": 4,
        "percentage": 100
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
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 15,
        "total": 15
      },
      "hard": {
        "solved": 2,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-45-1",
        "studentId": "student-45",
        "action": "Solved",
        "problemTitle": "Minimum Window Substring",
        "topic": "Strings",
        "difficulty": "Hard",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-45-2",
        "studentId": "student-45",
        "action": "Solved",
        "problemTitle": "Trapping Rain Water",
        "topic": "Arrays",
        "difficulty": "Hard",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-45-3",
        "studentId": "student-45",
        "action": "Solved",
        "problemTitle": "House Robber",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-45-4",
        "studentId": "student-45",
        "action": "Solved",
        "problemTitle": "Longest Increasing Subsequence",
        "topic": "Dynamic Programming",
        "difficulty": "Medium",
        "timeAgo": "3d ago",
        "status": "Passed"
      }
    ],
    "submissionsHistory": [
      {
        "date": "Mon",
        "count": 6
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
        "count": 7
      },
      {
        "date": "Sat",
        "count": 5
      },
      {
        "date": "Sun",
        "count": 4
      }
    ],
    "mentorFeedbackNotes": [
      {
        "id": "note-45-1",
        "author": "Mrs. Teja",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
  },
  {
    "id": "student-46",
    "rollNo": "24F81A0592",
    "name": "E. PRASHANTH",
    "email": "24f81a0592@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713876060?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Intermediate",
    "progress": 44,
    "solved": 15,
    "attempted": 18,
    "pending": 19,
    "streak": 3,
    "longestStreak": 8,
    "status": "Needs Attention",
    "topicProgress": {
      "Arrays": {
        "solved": 4,
        "total": 5,
        "percentage": 80
      },
      "Strings": {
        "solved": 2,
        "total": 4,
        "percentage": 50
      },
      "Linked Lists": {
        "solved": 3,
        "total": 4,
        "percentage": 75
      },
      "Stack": {
        "solved": 1,
        "total": 4,
        "percentage": 25
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
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 2,
        "total": 6,
        "percentage": 33
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 12,
        "total": 12
      },
      "medium": {
        "solved": 3,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [
      {
        "id": "act-46-1",
        "studentId": "student-46",
        "action": "Solved",
        "problemTitle": "Longest Substring Without Repeating Characters",
        "topic": "Strings",
        "difficulty": "Medium",
        "timeAgo": "2h ago",
        "status": "Passed"
      },
      {
        "id": "act-46-2",
        "studentId": "student-46",
        "action": "Solved",
        "problemTitle": "Container With Most Water",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "1d ago",
        "status": "Passed"
      },
      {
        "id": "act-46-3",
        "studentId": "student-46",
        "action": "Solved",
        "problemTitle": "3Sum",
        "topic": "Arrays",
        "difficulty": "Medium",
        "timeAgo": "2d ago",
        "status": "Passed"
      },
      {
        "id": "act-46-4",
        "studentId": "student-46",
        "action": "Solved",
        "problemTitle": "Maximum Subarray",
        "topic": "Dynamic Programming",
        "difficulty": "Easy",
        "timeAgo": "3d ago",
        "status": "Passed"
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
        "count": 2
      },
      {
        "date": "Thu",
        "count": 2
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
        "id": "note-46-1",
        "author": "Mrs. Teja",
        "date": "Feb 18, 2026",
        "note": "Consistent practice demonstrated on Strings curriculum modules. Keep up the daily momentum."
      }
    ]
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
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211186?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-6",
      "student-7",
      "student-8",
      "student-9"
    ],
    "avgProgress": 76,
    "totalSolved": 103,
    "totalAttempted": 112,
    "avgStreak": 10.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 90,
      "Strings": 88,
      "Linked Lists": 100,
      "Stack": 75,
      "Queue": 62,
      "Trees": 75,
      "Graphs": 56,
      "Dynamic Programming": 58
    },
    "rank": 1
  },
  {
    "id": "team-4",
    "teamNumber": "Team 04",
    "name": "Graph Gurus",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Lakshmi",
    "mentorEmail": "lakshmi.s@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211220?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-14",
      "student-15",
      "student-16",
      "student-17",
      "student-18"
    ],
    "avgProgress": 74,
    "totalSolved": 125,
    "totalAttempted": 135,
    "avgStreak": 8.8,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 88,
      "Strings": 75,
      "Linked Lists": 100,
      "Stack": 75,
      "Queue": 50,
      "Trees": 76,
      "Graphs": 60,
      "Dynamic Programming": 56
    },
    "rank": 2
  },
  {
    "id": "team-5",
    "teamNumber": "Team 05",
    "name": "Stack Smashers",
    "mentorId": "mentor-5",
    "mentorName": "Mr. N. Rajesh",
    "mentorEmail": "rajesh.n@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211237?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-19",
      "student-20",
      "student-21",
      "student-22",
      "student-23"
    ],
    "avgProgress": 73,
    "totalSolved": 125,
    "totalAttempted": 137,
    "avgStreak": 9.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 88,
      "Strings": 80,
      "Linked Lists": 100,
      "Stack": 65,
      "Queue": 50,
      "Trees": 72,
      "Graphs": 60,
      "Dynamic Programming": 63
    },
    "rank": 3
  },
  {
    "id": "team-7",
    "teamNumber": "Team 07",
    "name": "Tree Titans",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "mentorEmail": "ludvika@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211271?w=150&auto=format&fit=crop&q=80",
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
    "totalAttempted": 160,
    "avgStreak": 9.5,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 87,
      "Strings": 79,
      "Linked Lists": 100,
      "Stack": 75,
      "Queue": 50,
      "Trees": 73,
      "Graphs": 54,
      "Dynamic Programming": 58
    },
    "rank": 4
  },
  {
    "id": "team-3",
    "teamNumber": "Team 03",
    "name": "Dynamic Dynamos",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "mentorEmail": "ramesh.m@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211203?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-10",
      "student-11",
      "student-12",
      "student-13"
    ],
    "avgProgress": 69,
    "totalSolved": 94,
    "totalAttempted": 103,
    "avgStreak": 8.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 85,
      "Strings": 75,
      "Linked Lists": 94,
      "Stack": 62,
      "Queue": 50,
      "Trees": 70,
      "Graphs": 50,
      "Dynamic Programming": 58
    },
    "rank": 5
  },
  {
    "id": "team-9",
    "teamNumber": "Team 09",
    "name": "Bitwise Battlers",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "mentorEmail": "manjusha@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211305?w=150&auto=format&fit=crop&q=80",
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
    "totalAttempted": 144,
    "avgStreak": 7.8,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 83,
      "Strings": 79,
      "Linked Lists": 96,
      "Stack": 67,
      "Queue": 58,
      "Trees": 60,
      "Graphs": 38,
      "Dynamic Programming": 47
    },
    "rank": 6
  },
  {
    "id": "team-10",
    "teamNumber": "Team 10",
    "name": "Heap Heroes",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "mentorEmail": "teja.faculty@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211322?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-42",
      "student-43",
      "student-44",
      "student-45",
      "student-46"
    ],
    "avgProgress": 65,
    "totalSolved": 111,
    "totalAttempted": 125,
    "avgStreak": 7.2,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 88,
      "Strings": 80,
      "Linked Lists": 95,
      "Stack": 55,
      "Queue": 50,
      "Trees": 64,
      "Graphs": 30,
      "Dynamic Programming": 53
    },
    "rank": 7
  },
  {
    "id": "team-1",
    "teamNumber": "Team 01",
    "name": "Algorithm Aces",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "mentorEmail": "suresh.kumar@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211169?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-1",
      "student-2",
      "student-3",
      "student-4",
      "student-5"
    ],
    "avgProgress": 58,
    "totalSolved": 98,
    "totalAttempted": 112,
    "avgStreak": 6.2,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 84,
      "Strings": 70,
      "Linked Lists": 85,
      "Stack": 45,
      "Queue": 50,
      "Trees": 56,
      "Graphs": 25,
      "Dynamic Programming": 43
    },
    "rank": 8
  },
  {
    "id": "team-6",
    "teamNumber": "Team 06",
    "name": "Queue Queens",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. G. Pavani",
    "mentorEmail": "pavani.g@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211254?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-24",
      "student-25",
      "student-26"
    ],
    "avgProgress": 55,
    "totalSolved": 56,
    "totalAttempted": 62,
    "avgStreak": 5.3,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 80,
      "Strings": 75,
      "Linked Lists": 92,
      "Stack": 42,
      "Queue": 50,
      "Trees": 53,
      "Graphs": 17,
      "Dynamic Programming": 33
    },
    "rank": 9
  },
  {
    "id": "team-8",
    "teamNumber": "Team 08",
    "name": "Recursion Rangers",
    "mentorId": "mentor-8",
    "mentorName": "Mr. Vishnu",
    "mentorEmail": "vishnu@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211288?w=150&auto=format&fit=crop&q=80",
    "studentIds": [
      "student-33",
      "student-34",
      "student-35"
    ],
    "avgProgress": 53,
    "totalSolved": 54,
    "totalAttempted": 60,
    "avgStreak": 4.7,
    "status": "Needs Attention",
    "topicPerformance": {
      "Arrays": 80,
      "Strings": 67,
      "Linked Lists": 83,
      "Stack": 42,
      "Queue": 50,
      "Trees": 53,
      "Graphs": 17,
      "Dynamic Programming": 33
    },
    "rank": 10
  },
  {
    "id": "team-11",
    "teamNumber": "Team 11",
    "name": "Matrix Masters",
    "mentorId": "mentor-11",
    "mentorName": "Dr. M. Srinivasa Rao",
    "mentorEmail": "mentor.11@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211339?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 11
  },
  {
    "id": "team-12",
    "teamNumber": "Team 12",
    "name": "Hash Hackers",
    "mentorId": "mentor-12",
    "mentorName": "Prof. Sunita Deshmukh",
    "mentorEmail": "mentor.12@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211356?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 12
  },
  {
    "id": "team-13",
    "teamNumber": "Team 13",
    "name": "Pointer Prodigies",
    "mentorId": "mentor-13",
    "mentorName": "Dr. Ananya Ray",
    "mentorEmail": "mentor.13@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211373?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 13
  },
  {
    "id": "team-14",
    "teamNumber": "Team 14",
    "name": "Greedy Giants",
    "mentorId": "mentor-14",
    "mentorName": "Prof. K. Venkatesh",
    "mentorEmail": "mentor.14@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211390?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 14
  },
  {
    "id": "team-15",
    "teamNumber": "Team 15",
    "name": "Backtrack Busters",
    "mentorId": "mentor-15",
    "mentorName": "Dr. P. Rajesh Kumar",
    "mentorEmail": "mentor.15@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211407?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 15
  },
  {
    "id": "team-16",
    "teamNumber": "Team 16",
    "name": "Trie Troopers",
    "mentorId": "mentor-16",
    "mentorName": "Prof. B. Deepa",
    "mentorEmail": "mentor.16@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211424?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 16
  },
  {
    "id": "team-17",
    "teamNumber": "Team 17",
    "name": "Search Specialists",
    "mentorId": "mentor-17",
    "mentorName": "Dr. S. Mohan Das",
    "mentorEmail": "mentor.17@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211441?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 17
  },
  {
    "id": "team-18",
    "teamNumber": "Team 18",
    "name": "Sorting Stars",
    "mentorId": "mentor-18",
    "mentorName": "Prof. Kavita Reddy",
    "mentorEmail": "mentor.18@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211458?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 18
  },
  {
    "id": "team-19",
    "teamNumber": "Team 19",
    "name": "Divide Conquerors",
    "mentorId": "mentor-19",
    "mentorName": "Dr. C. Balasubramanian",
    "mentorEmail": "mentor.19@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211475?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 19
  },
  {
    "id": "team-20",
    "teamNumber": "Team 20",
    "name": "Logic Lords",
    "mentorId": "mentor-20",
    "mentorName": "Prof. Meera Nair",
    "mentorEmail": "mentor.20@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "mentorAvatar": "https://images.unsplash.com/photo-1507003211492?w=150&auto=format&fit=crop&q=80",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0.0,
    "status": "Active",
    "topicPerformance": {
      "Arrays": 0,
      "Strings": 0,
      "Linked Lists": 0,
      "Stack": 0,
      "Queue": 0,
      "Trees": 0,
      "Graphs": 0,
      "Dynamic Programming": 0
    },
    "rank": 20
  }
];

export const PROBLEMS_BANK: Problem[] = [
  {
    "id": "prob-1",
    "title": "Two Sum",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "acceptanceRate": "54.2%",
    "url": "https://leetcode.com/problems/two-sum"
  },
  {
    "id": "prob-2",
    "title": "Best Time to Buy and Sell Stock",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "Maximize profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    "acceptanceRate": "53.8%",
    "url": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock"
  },
  {
    "id": "prob-3",
    "title": "3Sum",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Find all unique triplets in the array which gives the sum of zero.",
    "acceptanceRate": "34.1%",
    "url": "https://leetcode.com/problems/3sum"
  },
  {
    "id": "prob-4",
    "title": "Container With Most Water",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    "acceptanceRate": "55.0%",
    "url": "https://leetcode.com/problems/container-with-most-water"
  },
  {
    "id": "prob-5",
    "title": "Trapping Rain Water",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Compute how much water an elevation map can trap after raining.",
    "acceptanceRate": "60.4%",
    "url": "https://leetcode.com/problems/trapping-rain-water"
  },
  {
    "id": "prob-6",
    "title": "Valid Palindrome",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Determine if a string is a palindrome, considering only alphanumeric characters and ignoring cases.",
    "acceptanceRate": "47.1%",
    "url": "https://leetcode.com/problems/valid-palindrome"
  },
  {
    "id": "prob-7",
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Find the length of the longest substring without repeating characters.",
    "acceptanceRate": "35.0%",
    "url": "https://leetcode.com/problems/longest-substring-without-repeating-characters"
  },
  {
    "id": "prob-8",
    "title": "Longest Palindromic Substring",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Return the longest palindromic substring in s.",
    "acceptanceRate": "33.8%",
    "url": "https://leetcode.com/problems/longest-palindromic-substring"
  },
  {
    "id": "prob-9",
    "title": "Minimum Window Substring",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Find the minimum window substring of s that contains every character in t.",
    "acceptanceRate": "42.5%",
    "url": "https://leetcode.com/problems/minimum-window-substring"
  },
  {
    "id": "prob-10",
    "title": "Reverse Linked List",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "Reverse a singly linked list and return the reversed list head.",
    "acceptanceRate": "75.4%",
    "url": "https://leetcode.com/problems/reverse-linked-list"
  },
  {
    "id": "prob-11",
    "title": "Merge Two Sorted Lists",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "Merge two sorted linked lists into one sorted list.",
    "acceptanceRate": "64.2%",
    "url": "https://leetcode.com/problems/merge-two-sorted-lists"
  },
  {
    "id": "prob-12",
    "title": "Linked List Cycle",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "Determine if a linked list contains a cycle.",
    "acceptanceRate": "50.1%",
    "url": "https://leetcode.com/problems/linked-list-cycle"
  },
  {
    "id": "prob-13",
    "title": "Remove Nth Node From End of List",
    "topic": "Linked Lists",
    "difficulty": "Medium",
    "description": "Remove the nth node from the end of the list and return its head.",
    "acceptanceRate": "45.7%",
    "url": "https://leetcode.com/problems/remove-nth-node-from-end-of-list"
  },
  {
    "id": "prob-14",
    "title": "Valid Parentheses",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Determine if an input string with brackets (), {}, [] is valid.",
    "acceptanceRate": "40.8%",
    "url": "https://leetcode.com/problems/valid-parentheses"
  },
  {
    "id": "prob-15",
    "title": "Min Stack",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in O(1) time.",
    "acceptanceRate": "53.9%",
    "url": "https://leetcode.com/problems/min-stack"
  },
  {
    "id": "prob-16",
    "title": "Daily Temperatures",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Calculate how many days to wait until a warmer temperature occurs.",
    "acceptanceRate": "66.2%",
    "url": "https://leetcode.com/problems/daily-temperatures"
  },
  {
    "id": "prob-17",
    "title": "Largest Rectangle in Histogram",
    "topic": "Stack",
    "difficulty": "Hard",
    "description": "Find the area of the largest rectangle in the given histogram bar heights.",
    "acceptanceRate": "44.1%",
    "url": "https://leetcode.com/problems/largest-rectangle-in-histogram"
  },
  {
    "id": "prob-18",
    "title": "Implement Queue using Stacks",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Implement a FIFO queue using only two standard LIFO stacks.",
    "acceptanceRate": "65.3%",
    "url": "https://leetcode.com/problems/implement-queue-using-stacks"
  },
  {
    "id": "prob-19",
    "title": "Sliding Window Maximum",
    "topic": "Queue",
    "difficulty": "Hard",
    "description": "Return the maximum element in each sliding window of size k moving across nums.",
    "acceptanceRate": "46.8%",
    "url": "https://leetcode.com/problems/sliding-window-maximum"
  },
  {
    "id": "prob-20",
    "title": "Maximum Depth of Binary Tree",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Find the maximum depth (number of nodes along longest path from root to leaf) of a binary tree.",
    "acceptanceRate": "75.6%",
    "url": "https://leetcode.com/problems/maximum-depth-of-binary-tree"
  },
  {
    "id": "prob-21",
    "title": "Invert Binary Tree",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Invert a binary tree and return its root.",
    "acceptanceRate": "77.1%",
    "url": "https://leetcode.com/problems/invert-binary-tree"
  },
  {
    "id": "prob-22",
    "title": "Lowest Common Ancestor of a BST",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Find the lowest common ancestor node of two given nodes in a BST.",
    "acceptanceRate": "64.5%",
    "url": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree"
  },
  {
    "id": "prob-23",
    "title": "Binary Tree Level Order Traversal",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Return the level order traversal of a binary tree's node values.",
    "acceptanceRate": "67.0%",
    "url": "https://leetcode.com/problems/binary-tree-level-order-traversal"
  },
  {
    "id": "prob-24",
    "title": "Binary Tree Maximum Path Sum",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "Find the maximum path sum of any non-empty path in a binary tree.",
    "acceptanceRate": "40.1%",
    "url": "https://leetcode.com/problems/binary-tree-maximum-path-sum"
  },
  {
    "id": "prob-25",
    "title": "Number of Islands",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Count the number of connected islands in an m x n 2D binary grid.",
    "acceptanceRate": "59.2%",
    "url": "https://leetcode.com/problems/number-of-islands"
  },
  {
    "id": "prob-26",
    "title": "Clone Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Return a deep copy (clone) of a connected undirected graph.",
    "acceptanceRate": "56.4%",
    "url": "https://leetcode.com/problems/clone-graph"
  },
  {
    "id": "prob-27",
    "title": "Course Schedule",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Determine if it is possible to finish all courses given prerequisite course pairs (cycle detection).",
    "acceptanceRate": "47.3%",
    "url": "https://leetcode.com/problems/course-schedule"
  },
  {
    "id": "prob-28",
    "title": "Word Ladder",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "Find the length of the shortest transformation sequence from beginWord to endWord.",
    "acceptanceRate": "38.9%",
    "url": "https://leetcode.com/problems/word-ladder"
  },
  {
    "id": "prob-29",
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Calculate distinct ways to reach top of staircase with 1 or 2 steps at a time.",
    "acceptanceRate": "53.1%",
    "url": "https://leetcode.com/problems/climbing-stairs"
  },
  {
    "id": "prob-30",
    "title": "Coin Change",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Find fewest number of coins needed to make up a given amount.",
    "acceptanceRate": "43.9%",
    "url": "https://leetcode.com/problems/coin-change"
  },
  {
    "id": "prob-31",
    "title": "Longest Increasing Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Find length of longest strictly increasing subsequence in an array.",
    "acceptanceRate": "55.3%",
    "url": "https://leetcode.com/problems/longest-increasing-subsequence"
  },
  {
    "id": "prob-32",
    "title": "House Robber",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Determine maximum amount of money you can rob tonight without alerting police.",
    "acceptanceRate": "51.2%",
    "url": "https://leetcode.com/problems/house-robber"
  },
  {
    "id": "prob-33",
    "title": "Edit Distance",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Return minimum number of operations required to convert word1 to word2.",
    "acceptanceRate": "56.8%",
    "url": "https://leetcode.com/problems/edit-distance"
  },
  {
    "id": "prob-34",
    "title": "Maximum Subarray",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "Find the contiguous subarray with the largest sum and return its sum (Kadane's Algorithm).",
    "acceptanceRate": "50.9%",
    "url": "https://leetcode.com/problems/maximum-subarray"
  }
];

export const DEAN_USER: CurrentUser = {
  id: 'dean-1',
  name: 'Dr. R. V. Raman',
  email: 'dean.academics@gkce.edu.in',
  role: 'DEAN',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  title: 'Dean of Academics & Institutional Development',
};

export const DEFAULT_MENTOR_USER: CurrentUser = {
  id: 'mentor-7',
  name: 'Mrs. Ludvika',
  email: 'ludvika@gkce.edu.in',
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
  email: 'chakri.24f81a0522@gkce.edu.in',
  role: 'STUDENT',
  avatar: 'https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80',
  title: 'B.Tech Student, GKCE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  studentData: ALL_STUDENTS.find(s => s.id === 'student-27'),
};
