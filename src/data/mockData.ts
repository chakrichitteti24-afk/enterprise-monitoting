// GKCE DSA Student Monitoring Platform — Clean Baseline Dataset (0% Fresh Start)
// Total Students: 46 authentic GKCE CSE Students enrolled
// Total Teams: 20 Mentored Teams
// Total DSA Curriculum Problems: 34 Core Challenges
// All progress and solves are earned dynamically in real-time as students solve problems.

import { CurrentUser, Mentor, Problem, Student, Team } from '../types';

export const TOTAL_CURRICULUM_PROBLEMS = 34;

export const DSA_TOPICS = [
  'Arrays',
  'Strings',
  'Linked Lists',
  'Stack',
  'Queue',
  'Trees',
  'Graphs',
  'Dynamic Programming',
] as const;

export const TOPIC_CURRICULUM_TOTALS: Record<string, number> = {
  Arrays: 5,
  Strings: 4,
  'Linked Lists': 4,
  Stack: 4,
  Queue: 2,
  Trees: 5,
  Graphs: 4,
  'Dynamic Programming': 6,
};

export const ALL_MENTORS: Mentor[] = [
  {
    "id": "mentor-1",
    "name": "Dr. K. Suresh Kumar",
    "email": "suresh.kumar@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-1",
    "assignedTeamNumber": "Team 01",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-2",
    "name": "Mrs. P. Radhika",
    "email": "radhika.p@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-2",
    "assignedTeamNumber": "Team 02",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-3",
    "name": "Mr. M. Ramesh",
    "email": "ramesh.m@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-3",
    "assignedTeamNumber": "Team 03",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-4",
    "name": "Mrs. S. Sailaja",
    "email": "sailaja.s@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-4",
    "assignedTeamNumber": "Team 04",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-5",
    "name": "Dr. V. Rajesh",
    "email": "rajesh.v@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-5",
    "assignedTeamNumber": "Team 05",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-6",
    "name": "Mrs. K. Divya",
    "email": "divya.k@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-6",
    "assignedTeamNumber": "Team 06",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-7",
    "name": "Mrs. Ludvika",
    "email": "ludvika@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-7",
    "assignedTeamNumber": "Team 07",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-8",
    "name": "Mrs. S. Swathi",
    "email": "swathi.s@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-8",
    "assignedTeamNumber": "Team 08",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-9",
    "name": "Mrs. Manjusha",
    "email": "manjusha@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-9",
    "assignedTeamNumber": "Team 09",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-10",
    "name": "Mrs. Teja",
    "email": "teja@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-10",
    "assignedTeamNumber": "Team 10",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-11",
    "name": "Dr. P. Venkatesh",
    "email": "venkatesh.p@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-11",
    "assignedTeamNumber": "Team 11",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-12",
    "name": "Mrs. G. Haritha",
    "email": "haritha.g@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-12",
    "assignedTeamNumber": "Team 12",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-13",
    "name": "Mr. K. Prasad",
    "email": "prasad.k@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-13",
    "assignedTeamNumber": "Team 13",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-14",
    "name": "Mrs. N. Lakshmi",
    "email": "lakshmi.n@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-14",
    "assignedTeamNumber": "Team 14",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-15",
    "name": "Dr. S. Naresh",
    "email": "naresh.s@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-15",
    "assignedTeamNumber": "Team 15",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-16",
    "name": "Mrs. B. Kavitha",
    "email": "kavitha.b@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-16",
    "assignedTeamNumber": "Team 16",
    "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-17",
    "name": "Mr. R. V. Rao",
    "email": "rao.rv@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-17",
    "assignedTeamNumber": "Team 17",
    "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-18",
    "name": "Mrs. T. Anusha",
    "email": "anusha.t@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-18",
    "assignedTeamNumber": "Team 18",
    "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-19",
    "name": "Mr. D. Mahesh",
    "email": "mahesh.d@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-19",
    "assignedTeamNumber": "Team 19",
    "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  },
  {
    "id": "mentor-20",
    "name": "Mrs. C. Geetha",
    "email": "geetha.c@gkce.edu.in",
    "department": "Computer Science & Engg",
    "assignedTeamId": "team-20",
    "assignedTeamNumber": "Team 20",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  }
];

export const ALL_STUDENTS: Student[] = [
  {
    "id": "student-1",
    "rollNo": "23F81A0502",
    "name": "BODDU ANANTHALAKSHMI",
    "email": "ananthalakshmi23f81a0502@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-2",
    "rollNo": "23F81A0507",
    "name": "PITTI DEVIKA (MQ)",
    "email": "devika23f81a0507@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528754120?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-3",
    "rollNo": "23F81A0513",
    "name": "GALLA KAVITHA",
    "email": "kavitha23f81a0513@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528766465?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-4",
    "rollNo": "23F81A0511",
    "name": "BATTA JASWITHA",
    "email": "jaswitha23f81a0511@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528778810?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-5",
    "rollNo": "23F81A0538",
    "name": "JEELAGA THANUSHA",
    "email": "thanusha23f81a0538@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528791155?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-1",
    "teamNumber": "Team 01",
    "mentorId": "mentor-1",
    "mentorName": "Dr. K. Suresh Kumar",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-6",
    "rollNo": "23F81A0510",
    "name": "SHAIK HABEEBA",
    "email": "habeeba23f81a0510@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528803500?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-7",
    "rollNo": "23F81A0504",
    "name": "GADDAM BHARGAVI",
    "email": "bhargavi23f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528815845?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-8",
    "rollNo": "23F81A0525",
    "name": "GADDAM PALLAVI",
    "email": "pallavi23f81a0525@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528828190?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-9",
    "rollNo": "23F81A0534",
    "name": "KATURU SRAVANTHI",
    "email": "sravanthi23f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528840535?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-2",
    "teamNumber": "Team 02",
    "mentorId": "mentor-2",
    "mentorName": "Mrs. P. Radhika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-10",
    "rollNo": "23F81A0514",
    "name": "MODI KAVYA",
    "email": "kavya23f81a0514@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528852880?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-11",
    "rollNo": "24F85A0508",
    "name": "VUKKADALA MANASA",
    "email": "manasa24f85a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528865225?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-12",
    "rollNo": "23F81A0509",
    "name": "KUTLURU DIVYA SRI",
    "email": "divyasri23f81a0509@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528877570?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-13",
    "rollNo": "23F81A0542",
    "name": "KONERU VYSHNAVI",
    "email": "vyshnavi23f81a0542@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528889915?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-3",
    "teamNumber": "Team 03",
    "mentorId": "mentor-3",
    "mentorName": "Mr. M. Ramesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-14",
    "rollNo": "23F81A0517",
    "name": "P. MEGHANA",
    "email": "meghana23f81a0517@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528902260?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Sailaja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-15",
    "rollNo": "23F81A0535",
    "name": "P. SUNITHA",
    "email": "sunitha23f81a0535@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528914605?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Sailaja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-16",
    "rollNo": "23F81A0520",
    "name": "M. KEERTHANA",
    "email": "keerthana23f81a0520@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528926950?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Sailaja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-17",
    "rollNo": "23F81A0541",
    "name": "G. JYOTHI",
    "email": "jyothi23f81a0541@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528939295?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-4",
    "teamNumber": "Team 04",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Sailaja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-18",
    "rollNo": "23F81A0529",
    "name": "B. KEERTHI",
    "email": "keerthi23f81a0529@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528951640?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Dr. V. Rajesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-19",
    "rollNo": "23F81A0512",
    "name": "C. THEJASWINI",
    "email": "thejaswini23f81a0512@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528963985?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Dr. V. Rajesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-20",
    "rollNo": "23F81A0533",
    "name": "T. CHANDANA",
    "email": "chandana23f81a0533@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528976330?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Dr. V. Rajesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-21",
    "rollNo": "23F81A0523",
    "name": "V. SHALINI",
    "email": "shalini23f81a0523@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534528988675?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-5",
    "teamNumber": "Team 05",
    "mentorId": "mentor-5",
    "mentorName": "Dr. V. Rajesh",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-22",
    "rollNo": "23F81A0531",
    "name": "K. CHARITHA",
    "email": "charitha23f81a0531@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529001020?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. K. Divya",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-23",
    "rollNo": "23F81A0527",
    "name": "M. BHAVITHA",
    "email": "bhavitha23f81a0527@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529013365?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. K. Divya",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-24",
    "rollNo": "23F81A0503",
    "name": "CH. TEJASWI",
    "email": "tejaswi23f81a0503@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529025710?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. K. Divya",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-25",
    "rollNo": "23F81A0518",
    "name": "K. ROJA",
    "email": "roja23f81a0518@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529038055?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-6",
    "teamNumber": "Team 06",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. K. Divya",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-26",
    "rollNo": "24F81A0522",
    "name": "CH. CHAKRI",
    "email": "chakri24f81a0522@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-27",
    "rollNo": "24F81A0534",
    "name": "P. GAYANI",
    "email": "gayani24f81a0534@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529062745?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-28",
    "rollNo": "24F81A0504",
    "name": "P. AKHILA",
    "email": "akhila24f81a0504@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529075090?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-29",
    "rollNo": "24F81A0549",
    "name": "C. JAHNAVI",
    "email": "jahnavi24f81a0549@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529087435?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-30",
    "rollNo": "24F81A0544",
    "name": "S. HARSHITHA",
    "email": "harshitha24f81a0544@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529099780?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-31",
    "rollNo": "24F81A05B2",
    "name": "S. SUDHA",
    "email": "sudha24f81a05b2@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529112125?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-7",
    "teamNumber": "Team 07",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-32",
    "rollNo": "24F81A0569",
    "name": "K. HEMALATHA",
    "email": "hemalatha24f81a0569@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529124470?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mrs. S. Swathi",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-33",
    "rollNo": "24F81A0563",
    "name": "D. SUMITHRA",
    "email": "sumithra24f81a0563@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529136815?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mrs. S. Swathi",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-34",
    "rollNo": "24F81A05A6",
    "name": "S. VENKATESH",
    "email": "venkatesh24f81a05a6@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529149160?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mrs. S. Swathi",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-35",
    "rollNo": "24F81A0573",
    "name": "M. SUDARSHAN",
    "email": "sudarshan24f81a0573@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529161505?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-8",
    "teamNumber": "Team 08",
    "mentorId": "mentor-8",
    "mentorName": "Mrs. S. Swathi",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-36",
    "rollNo": "24F81A0532",
    "name": "M. ESWAR",
    "email": "eswar24f81a0532@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529173850?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-37",
    "rollNo": "24F81A0554",
    "name": "K. KEERTHANA",
    "email": "keerthana24f81a0554@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529186195?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-38",
    "rollNo": "24F81A0548",
    "name": "D. HIMA VARSHA",
    "email": "himavarsha24f81a0548@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529198540?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-39",
    "rollNo": "24F81A0557",
    "name": "B. KISHORE NAIK",
    "email": "kishore24f81a0557@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529210885?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-40",
    "rollNo": "24F81A0508",
    "name": "E. ANUSHA",
    "email": "anusha24f81a0508@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529223230?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-41",
    "rollNo": "24F81A0550",
    "name": "U. JHANAKI",
    "email": "jhanaki24f81a0550@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529235575?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-9",
    "teamNumber": "Team 09",
    "mentorId": "mentor-9",
    "mentorName": "Mrs. Manjusha",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-42",
    "rollNo": "24F81A05C7",
    "name": "M. VENKATESWARLU",
    "email": "venkateswarlu24f81a05c7@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529247920?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-43",
    "rollNo": "24F81A0591",
    "name": "P. PRASANNA KUMAR",
    "email": "prasanna24f81a0591@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529260265?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-44",
    "rollNo": "24F81A0590",
    "name": "T. PRABAKAR",
    "email": "prabakar24f81a0590@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529272610?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-45",
    "rollNo": "24F81A05C0",
    "name": "T. TEJA",
    "email": "teja24f81a05c0@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529284955?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  },
  {
    "id": "student-46",
    "rollNo": "24F81A0592",
    "name": "E. PRASHANTH",
    "email": "prashanth24f81a0592@gkce.edu.in",
    "avatar": "https://images.unsplash.com/photo-1534529297300?w=150&auto=format&fit=crop&q=80",
    "teamId": "team-10",
    "teamNumber": "Team 10",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "dsaLevel": "Beginner",
    "progress": 0,
    "solved": 0,
    "attempted": 0,
    "pending": 34,
    "streak": 0,
    "longestStreak": 0,
    "status": "Active",
    "topicProgress": {
      "Arrays": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Strings": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Linked Lists": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Stack": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Queue": {
        "solved": 0,
        "total": 2,
        "percentage": 0
      },
      "Trees": {
        "solved": 0,
        "total": 5,
        "percentage": 0
      },
      "Graphs": {
        "solved": 0,
        "total": 4,
        "percentage": 0
      },
      "Dynamic Programming": {
        "solved": 0,
        "total": 6,
        "percentage": 0
      }
    },
    "difficultyStats": {
      "easy": {
        "solved": 0,
        "total": 12
      },
      "medium": {
        "solved": 0,
        "total": 15
      },
      "hard": {
        "solved": 0,
        "total": 7
      }
    },
    "recentActivities": [],
    "submissionsHistory": [],
    "mentorFeedbackNotes": []
  }
];

export const ALL_TEAMS: Team[] = [
  {
    "id": "team-1",
    "teamNumber": "Team 01",
    "name": "Dynamic Dynamos",
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
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 1
  },
  {
    "id": "team-2",
    "teamNumber": "Team 02",
    "name": "Binary Brains",
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
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 2
  },
  {
    "id": "team-3",
    "teamNumber": "Team 03",
    "name": "Algorithm Aces",
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
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 3
  },
  {
    "id": "team-4",
    "teamNumber": "Team 04",
    "name": "Recursion Rangers",
    "mentorId": "mentor-4",
    "mentorName": "Mrs. S. Sailaja",
    "mentorEmail": "sailaja.s@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-14",
      "student-15",
      "student-16",
      "student-17"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 4
  },
  {
    "id": "team-5",
    "teamNumber": "Team 05",
    "name": "Stack Masters",
    "mentorId": "mentor-5",
    "mentorName": "Dr. V. Rajesh",
    "mentorEmail": "rajesh.v@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-18",
      "student-19",
      "student-20",
      "student-21"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 5
  },
  {
    "id": "team-6",
    "teamNumber": "Team 06",
    "name": "Queue Queens",
    "mentorId": "mentor-6",
    "mentorName": "Mrs. K. Divya",
    "mentorEmail": "divya.k@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-22",
      "student-23",
      "student-24",
      "student-25"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 6
  },
  {
    "id": "team-7",
    "teamNumber": "Team 07",
    "name": "Tree Titans",
    "mentorId": "mentor-7",
    "mentorName": "Mrs. Ludvika",
    "mentorEmail": "ludvika@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-26",
      "student-27",
      "student-28",
      "student-29",
      "student-30",
      "student-31"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 7
  },
  {
    "id": "team-8",
    "teamNumber": "Team 08",
    "name": "Graph Gurus",
    "mentorId": "mentor-8",
    "mentorName": "Mrs. S. Swathi",
    "mentorEmail": "swathi.s@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-32",
      "student-33",
      "student-34",
      "student-35"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 8
  },
  {
    "id": "team-9",
    "teamNumber": "Team 09",
    "name": "Hash Heroes",
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
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 9
  },
  {
    "id": "team-10",
    "teamNumber": "Team 10",
    "name": "Sort Savants",
    "mentorId": "mentor-10",
    "mentorName": "Mrs. Teja",
    "mentorEmail": "teja@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [
      "student-42",
      "student-43",
      "student-44",
      "student-45",
      "student-46"
    ],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "rank": 10
  },
  {
    "id": "team-11",
    "teamNumber": "Team 11",
    "name": "Trie Troopers",
    "mentorId": "mentor-11",
    "mentorName": "Dr. P. Venkatesh",
    "mentorEmail": "venkatesh.p@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Heap Hawks",
    "mentorId": "mentor-12",
    "mentorName": "Mrs. G. Haritha",
    "mentorEmail": "haritha.g@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Bitwise Bards",
    "mentorId": "mentor-13",
    "mentorName": "Mr. K. Prasad",
    "mentorEmail": "prasad.k@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Matrix Mavericks",
    "mentorId": "mentor-14",
    "mentorName": "Mrs. N. Lakshmi",
    "mentorEmail": "lakshmi.n@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Greedy Giants",
    "mentorId": "mentor-15",
    "mentorName": "Dr. S. Naresh",
    "mentorEmail": "naresh.s@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Backtrack Brigade",
    "mentorId": "mentor-16",
    "mentorName": "Mrs. B. Kavitha",
    "mentorEmail": "kavitha.b@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Segment Sages",
    "mentorId": "mentor-17",
    "mentorName": "Mr. R. V. Rao",
    "mentorEmail": "rao.rv@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Fenwick Force",
    "mentorId": "mentor-18",
    "mentorName": "Mrs. T. Anusha",
    "mentorEmail": "anusha.t@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Disjoint Dragons",
    "mentorId": "mentor-19",
    "mentorName": "Mr. D. Mahesh",
    "mentorEmail": "mahesh.d@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "name": "Flow Knights",
    "mentorId": "mentor-20",
    "mentorName": "Mrs. C. Geetha",
    "mentorEmail": "geetha.c@gkce.edu.in",
    "mentorDepartment": "Computer Science & Engg",
    "studentIds": [],
    "avgProgress": 0,
    "totalSolved": 0,
    "totalAttempted": 0,
    "avgStreak": 0,
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
    "acceptanceRate": "54.2%"
  },
  {
    "id": "prob-2",
    "title": "Best Time to Buy and Sell Stock",
    "topic": "Arrays",
    "difficulty": "Easy",
    "description": "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    "acceptanceRate": "53.8%"
  },
  {
    "id": "prob-3",
    "title": "3Sum",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
    "acceptanceRate": "34.1%"
  },
  {
    "id": "prob-4",
    "title": "Container With Most Water",
    "topic": "Arrays",
    "difficulty": "Medium",
    "description": "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    "acceptanceRate": "55.0%"
  },
  {
    "id": "prob-5",
    "title": "Trapping Rain Water",
    "topic": "Arrays",
    "difficulty": "Hard",
    "description": "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "acceptanceRate": "60.4%"
  },
  {
    "id": "prob-6",
    "title": "Valid Anagram",
    "topic": "Strings",
    "difficulty": "Easy",
    "description": "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
    "acceptanceRate": "64.2%"
  },
  {
    "id": "prob-7",
    "title": "Longest Substring Without Repeating Characters",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Given a string s, find the length of the longest substring without repeating characters.",
    "acceptanceRate": "35.0%"
  },
  {
    "id": "prob-8",
    "title": "Longest Palindromic Substring",
    "topic": "Strings",
    "difficulty": "Medium",
    "description": "Given a string s, return the longest palindromic substring in s.",
    "acceptanceRate": "33.8%"
  },
  {
    "id": "prob-9",
    "title": "Minimum Window Substring",
    "topic": "Strings",
    "difficulty": "Hard",
    "description": "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
    "acceptanceRate": "42.5%"
  },
  {
    "id": "prob-10",
    "title": "Reverse Linked List",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    "acceptanceRate": "75.4%"
  },
  {
    "id": "prob-11",
    "title": "Merge Two Sorted Lists",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
    "acceptanceRate": "64.2%"
  },
  {
    "id": "prob-12",
    "title": "Linked List Cycle",
    "topic": "Linked Lists",
    "difficulty": "Easy",
    "description": "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    "acceptanceRate": "50.1%"
  },
  {
    "id": "prob-13",
    "title": "Reorder List",
    "topic": "Linked Lists",
    "difficulty": "Medium",
    "description": "You are given the head of a singly linked-list. Reorder the list to be on the specified alternating format.",
    "acceptanceRate": "55.2%"
  },
  {
    "id": "prob-14",
    "title": "Valid Parentheses",
    "topic": "Stack",
    "difficulty": "Easy",
    "description": "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "acceptanceRate": "40.8%"
  },
  {
    "id": "prob-15",
    "title": "Min Stack",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    "acceptanceRate": "53.9%"
  },
  {
    "id": "prob-16",
    "title": "Daily Temperatures",
    "topic": "Stack",
    "difficulty": "Medium",
    "description": "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.",
    "acceptanceRate": "66.2%"
  },
  {
    "id": "prob-17",
    "title": "Largest Rectangle in Histogram",
    "topic": "Stack",
    "difficulty": "Hard",
    "description": "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "acceptanceRate": "44.1%"
  },
  {
    "id": "prob-18",
    "title": "Implement Queue using Stacks",
    "topic": "Queue",
    "difficulty": "Easy",
    "description": "Implement a first in first out (FIFO) queue using only two stacks.",
    "acceptanceRate": "65.3%"
  },
  {
    "id": "prob-19",
    "title": "Sliding Window Maximum",
    "topic": "Queue",
    "difficulty": "Hard",
    "description": "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.",
    "acceptanceRate": "46.8%"
  },
  {
    "id": "prob-20",
    "title": "Maximum Depth of Binary Tree",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Given the root of a binary tree, return its maximum depth.",
    "acceptanceRate": "75.6%"
  },
  {
    "id": "prob-21",
    "title": "Invert Binary Tree",
    "topic": "Trees",
    "difficulty": "Easy",
    "description": "Given the root of a binary tree, invert the tree, and return its root.",
    "acceptanceRate": "77.1%"
  },
  {
    "id": "prob-22",
    "title": "Binary Tree Level Order Traversal",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
    "acceptanceRate": "67.0%"
  },
  {
    "id": "prob-23",
    "title": "Validate Binary Search Tree",
    "topic": "Trees",
    "difficulty": "Medium",
    "description": "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
    "acceptanceRate": "33.0%"
  },
  {
    "id": "prob-24",
    "title": "Binary Tree Maximum Path Sum",
    "topic": "Trees",
    "difficulty": "Hard",
    "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.",
    "acceptanceRate": "40.1%"
  },
  {
    "id": "prob-25",
    "title": "Number of Islands",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    "acceptanceRate": "59.2%"
  },
  {
    "id": "prob-26",
    "title": "Clone Graph",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.",
    "acceptanceRate": "56.4%"
  },
  {
    "id": "prob-27",
    "title": "Course Schedule",
    "topic": "Graphs",
    "difficulty": "Medium",
    "description": "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return true if you can finish all courses.",
    "acceptanceRate": "47.2%"
  },
  {
    "id": "prob-28",
    "title": "Word Ladder",
    "topic": "Graphs",
    "difficulty": "Hard",
    "description": "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the number of words in the shortest transformation sequence.",
    "acceptanceRate": "38.6%"
  },
  {
    "id": "prob-29",
    "title": "Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "acceptanceRate": "53.1%"
  },
  {
    "id": "prob-30",
    "title": "House Robber",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "You are a professional robber planning to rob houses along a street. Determine the maximum amount of money you can rob tonight without alerting the police.",
    "acceptanceRate": "51.3%"
  },
  {
    "id": "prob-31",
    "title": "Coin Change",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.",
    "acceptanceRate": "44.0%"
  },
  {
    "id": "prob-32",
    "title": "Longest Increasing Subsequence",
    "topic": "Dynamic Programming",
    "difficulty": "Medium",
    "description": "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
    "acceptanceRate": "54.8%"
  },
  {
    "id": "prob-33",
    "title": "Min Cost Climbing Stairs",
    "topic": "Dynamic Programming",
    "difficulty": "Easy",
    "description": "You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Return the minimum cost to reach the top of the floor.",
    "acceptanceRate": "66.5%"
  },
  {
    "id": "prob-34",
    "title": "Edit Distance",
    "topic": "Dynamic Programming",
    "difficulty": "Hard",
    "description": "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
    "acceptanceRate": "56.8%"
  }
];

export const DEAN_USER: CurrentUser = {
  id: 'dean-1',
  name: 'Prof. Dr. V. Rama Devi, Ph.D.',
  email: 'dean.academics@gkce.edu.in',
  role: 'DEAN',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  title: 'Dean of Academic Affairs & Head of Technical Training',
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
  email: 'chakri24f81a0522@gkce.edu.in',
  role: 'STUDENT',
  avatar: 'https://images.unsplash.com/photo-1535713875623?w=150&auto=format&fit=crop&q=80',
  title: 'B.Tech Student, GKCE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  studentData: ALL_STUDENTS.find(s => s.id === 'student-27'),
};
