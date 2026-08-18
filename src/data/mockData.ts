import { DSATopic, Mentor, Problem, Student, StudentStatus, Team } from '../types';

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
  'Arrays': 25,
  'Strings': 20,
  'Linked Lists': 15,
  'Stack': 12,
  'Queue': 10,
  'Trees': 20,
  'Graphs': 18,
  'Dynamic Programming': 20,
};

export const TOTAL_CURRICULUM_PROBLEMS = Object.values(TOPIC_CURRICULUM_TOTALS).reduce((a, b) => a + b, 0); // 140 problems

export const MENTORS_DATA: Mentor[] = [
  { id: 'mentor-1', name: 'Dr. S. K. Venkatesh', email: 'venkatesh.sk@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23401', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-1', assignedTeamNumber: 'Team 01', experienceYears: 14 },
  { id: 'mentor-2', name: 'Prof. M. Lavanya', email: 'lavanya.m@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23402', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-2', assignedTeamNumber: 'Team 02', experienceYears: 9 },
  { id: 'mentor-3', name: 'Dr. K. Ramesh Babu', email: 'ramesh.k@gkce.edu.in', department: 'Information Technology', phone: '+91 94401 23403', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-3', assignedTeamNumber: 'Team 03', experienceYears: 16 },
  { id: 'mentor-4', name: 'Prof. P. Gayatri', email: 'gayatri.p@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23404', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-4', assignedTeamNumber: 'Team 04', experienceYears: 8 },
  { id: 'mentor-5', name: 'Dr. T. Srinivasa Rao', email: 'srinivas.t@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23405', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-5', assignedTeamNumber: 'Team 05', experienceYears: 12 },
  { id: 'mentor-6', name: 'Prof. V. Sunitha', email: 'sunitha.v@gkce.edu.in', department: 'Artificial Intelligence & DS', phone: '+91 94401 23406', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-6', assignedTeamNumber: 'Team 06', experienceYears: 7 },
  { id: 'mentor-7', name: 'Prof. Suresh Kumar', email: 'suresh.kumar@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23407', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-7', assignedTeamNumber: 'Team 07', experienceYears: 11 },
  { id: 'mentor-8', name: 'Dr. Ananya Mukherjee', email: 'ananya.m@gkce.edu.in', department: 'Information Technology', phone: '+91 94401 23408', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-8', assignedTeamNumber: 'Team 08', experienceYears: 10 },
  { id: 'mentor-9', name: 'Prof. D. Rajesh', email: 'rajesh.d@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23409', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-9', assignedTeamNumber: 'Team 09', experienceYears: 6 },
  { id: 'mentor-10', name: 'Dr. G. Lakshmi Prasanna', email: 'lakshmi.g@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23410', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-10', assignedTeamNumber: 'Team 10', experienceYears: 15 },
  { id: 'mentor-11', name: 'Prof. N. Harish', email: 'harish.n@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23411', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-11', assignedTeamNumber: 'Team 11', experienceYears: 9 },
  { id: 'mentor-12', name: 'Prof. B. Bhavani', email: 'bhavani.b@gkce.edu.in', department: 'Artificial Intelligence & DS', phone: '+91 94401 23412', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-12', assignedTeamNumber: 'Team 12', experienceYears: 8 },
  { id: 'mentor-13', name: 'Dr. C. Madhava Reddy', email: 'madhav.c@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23413', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-13', assignedTeamNumber: 'Team 13', experienceYears: 13 },
  { id: 'mentor-14', name: 'Prof. K. Sandhya', email: 'sandhya.k@gkce.edu.in', department: 'Information Technology', phone: '+91 94401 23414', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-14', assignedTeamNumber: 'Team 14', experienceYears: 7 },
  { id: 'mentor-15', name: 'Dr. Y. V. Subbarao', email: 'subbarao.y@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23415', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-15', assignedTeamNumber: 'Team 15', experienceYears: 18 },
  { id: 'mentor-16', name: 'Prof. R. Swapna', email: 'swapna.r@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23416', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-16', assignedTeamNumber: 'Team 16', experienceYears: 6 },
  { id: 'mentor-17', name: 'Prof. P. Naveen Kumar', email: 'naveen.p@gkce.edu.in', department: 'Artificial Intelligence & DS', phone: '+91 94401 23417', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-17', assignedTeamNumber: 'Team 17', experienceYears: 10 },
  { id: 'mentor-18', name: 'Dr. J. Padmavathi', email: 'padma.j@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23418', avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-18', assignedTeamNumber: 'Team 18', experienceYears: 14 },
  { id: 'mentor-19', name: 'Prof. M. Sravan', email: 'sravan.m@gkce.edu.in', department: 'Information Technology', phone: '+91 94401 23419', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-19', assignedTeamNumber: 'Team 19', experienceYears: 5 },
  { id: 'mentor-20', name: 'Dr. A. Giridhar', email: 'giridhar.a@gkce.edu.in', department: 'Computer Science & Engg', phone: '+91 94401 23420', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', assignedTeamId: 'team-20', assignedTeamNumber: 'Team 20', experienceYears: 17 },
];

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Sai', 'Ananya', 'Karthik', 'Sneha', 'Vikram', 'Divya', 'Harish', 'Pooja',
  'Aditya', 'Swati', 'Rohan', 'Manisha', 'Nikhil', 'Kavya', 'Tarun', 'Deepika', 'Varun', 'Meghana',
  'Abhishek', 'Shruti', 'Gautam', 'Keerthi', 'Manoj', 'Aishwarya', 'Pranav', 'Shreya', 'Siddharth', 'Bhavya',
  'Ajay', 'Pavani', 'Chaitanya', 'Lavanya', 'Vamshi', 'Ritu', 'Akash', 'Navya', 'Surya', 'Haritha',
  'Kalyan', 'Sowmya', 'Naveen', 'Sindhu', 'Rakesh', 'Pallavi', 'Sanjay', 'Vandana', 'Teja', 'Prathyusha',
  'Vinay', 'Radha', 'Kiran', 'Tanvi', 'Anil', 'Archana', 'Mahesh', 'Madhuri', 'Avinash', 'Sreeja',
  'Sunil', 'Jyothi', 'Lokesh', 'Tejaswi', 'Dinesh', 'Kalyani', 'Ganesh', 'Manasa', 'Vikas', 'Roopa',
  'Prasad', 'Sravani', 'Naresh', 'Aparna', 'Raghu', 'Usha', 'Sudheer', 'Mounika', 'Bhargav', 'Sireesha',
  'Santosh', 'Yamini', 'Vijay', 'Hema', 'Gopi', 'Gayathri', 'Sharath', 'Sirisha', 'Bhanu', 'Suhasini',
  'Shiva', 'Pranitha', 'Chandra', 'Sandhya', 'Mohan', 'Padma', 'Nagesh', 'Geetha', 'Ravi', 'Alekhya'
];

const LAST_NAMES = [
  'Sharma', 'Nair', 'Teja', 'Reddy', 'Varma', 'Patil', 'Rathod', 'Iyer', 'Kumar', 'Krishnan',
  'Rao', 'Deshmukh', 'Kulkarni', 'Joshi', 'Menon', 'Chowdary', 'Naidu', 'Murthy', 'Babu', 'Pillai',
  'Gupta', 'Singh', 'Verma', 'Mishra', 'Goud', 'Yadav', 'Raju', 'Bhatt', 'Nambiar', 'Shetty'
];

// Activity templates
const ACTIVITY_BANK = [
  { action: 'Solved', problemTitle: 'Binary Search', topic: 'Arrays' as DSATopic, difficulty: 'Easy' as const, status: 'Completed' as const, timeAgo: 'Today' },
  { action: 'Completed', problemTitle: 'Reverse Linked List', topic: 'Linked Lists' as DSATopic, difficulty: 'Easy' as const, status: 'Completed' as const, timeAgo: 'Yesterday' },
  { action: 'Solved', problemTitle: 'Two Sum', topic: 'Arrays' as DSATopic, difficulty: 'Easy' as const, status: 'Completed' as const, timeAgo: '2 days ago' },
  { action: 'Attempted', problemTitle: 'Longest Substring Without Repeating Characters', topic: 'Strings' as DSATopic, difficulty: 'Medium' as const, status: 'Attempted' as const, timeAgo: '3 days ago' },
  { action: 'Solved', problemTitle: 'Valid Parentheses', topic: 'Stack' as DSATopic, difficulty: 'Easy' as const, status: 'Completed' as const, timeAgo: '4 days ago' },
  { action: 'Passed', problemTitle: 'Invert Binary Tree', topic: 'Trees' as DSATopic, difficulty: 'Easy' as const, status: 'Passed' as const, timeAgo: '5 days ago' },
  { action: 'Solved', problemTitle: 'Coin Change', topic: 'Dynamic Programming' as DSATopic, difficulty: 'Medium' as const, status: 'Completed' as const, timeAgo: '6 days ago' },
  { action: 'Solved', problemTitle: 'Number of Islands', topic: 'Graphs' as DSATopic, difficulty: 'Medium' as const, status: 'Completed' as const, timeAgo: '7 days ago' },
  { action: 'Passed', problemTitle: 'Implement Queue using Stacks', topic: 'Queue' as DSATopic, difficulty: 'Easy' as const, status: 'Passed' as const, timeAgo: '8 days ago' },
  { action: 'Attempted', problemTitle: 'Course Schedule II', topic: 'Graphs' as DSATopic, difficulty: 'Medium' as const, status: 'Attempted' as const, timeAgo: '9 days ago' },
];

export const PROBLEMS_BANK: Problem[] = [
  { id: 'p-1', title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', acceptanceRate: '52.4%', solvedCount: 94 },
  { id: 'p-2', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', description: 'Maximize profit by choosing a single day to buy one stock and choosing a different day in the future to sell.', acceptanceRate: '54.1%', solvedCount: 91 },
  { id: 'p-3', title: 'Maximum Subarray (Kadane\'s)', topic: 'Arrays', difficulty: 'Medium', description: 'Find the subarray with the largest sum, and return its sum.', acceptanceRate: '50.8%', solvedCount: 84 },
  { id: 'p-4', title: '3Sum', topic: 'Arrays', difficulty: 'Medium', description: 'Find all unique triplets in the array which gives the sum of zero.', acceptanceRate: '33.9%', solvedCount: 68 },
  { id: 'p-5', title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', description: 'Find two lines that together with the x-axis form a container, such that the container contains the most water.', acceptanceRate: '55.2%', solvedCount: 76 },
  
  { id: 'p-6', title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', description: 'Determine if string t is an anagram of string s.', acceptanceRate: '64.3%', solvedCount: 96 },
  { id: 'p-7', title: 'Valid Palindrome', topic: 'Strings', difficulty: 'Easy', description: 'Determine if a given string is a palindrome, considering only alphanumeric characters and ignoring cases.', acceptanceRate: '46.7%', solvedCount: 90 },
  { id: 'p-8', title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', description: 'Find the length of the longest substring without repeating characters.', acceptanceRate: '34.8%', solvedCount: 79 },
  { id: 'p-9', title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', description: 'Return the longest palindromic substring in s.', acceptanceRate: '33.4%', solvedCount: 62 },
  { id: 'p-10', title: 'Group Anagrams', topic: 'Strings', difficulty: 'Medium', description: 'Group strings that are anagrams together in any order.', acceptanceRate: '68.0%', solvedCount: 71 },

  { id: 'p-11', title: 'Reverse Linked List', topic: 'Linked Lists', difficulty: 'Easy', description: 'Reverse a singly linked list and return its head.', acceptanceRate: '75.2%', solvedCount: 95 },
  { id: 'p-12', title: 'Merge Two Sorted Lists', topic: 'Linked Lists', difficulty: 'Easy', description: 'Merge the two lists into one sorted list by splicing together nodes of the first two lists.', acceptanceRate: '63.9%', solvedCount: 89 },
  { id: 'p-13', title: 'Linked List Cycle Detection (Floyd\'s)', topic: 'Linked Lists', difficulty: 'Easy', description: 'Determine if the linked list has a cycle in it using two pointers.', acceptanceRate: '49.1%', solvedCount: 88 },
  { id: 'p-14', title: 'Remove Nth Node From End of List', topic: 'Linked Lists', difficulty: 'Medium', description: 'Remove the nth node from the end of the list and return its head.', acceptanceRate: '44.3%', solvedCount: 73 },
  { id: 'p-15', title: 'Merge k Sorted Lists', topic: 'Linked Lists', difficulty: 'Hard', description: 'Merge all the linked-lists into one sorted linked-list and return it.', acceptanceRate: '51.8%', solvedCount: 42 },

  { id: 'p-16', title: 'Valid Parentheses', topic: 'Stack', difficulty: 'Easy', description: 'Determine if the input string containing brackets is valid.', acceptanceRate: '40.6%', solvedCount: 97 },
  { id: 'p-17', title: 'Min Stack', topic: 'Stack', difficulty: 'Medium', description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', acceptanceRate: '53.5%', solvedCount: 80 },
  { id: 'p-18', title: 'Daily Temperatures', topic: 'Stack', difficulty: 'Medium', description: 'Given an array of temperatures, return an array answer such that answer[i] is the number of days you have to wait.', acceptanceRate: '66.1%', solvedCount: 69 },
  { id: 'p-19', title: 'Largest Rectangle in Histogram', topic: 'Stack', difficulty: 'Hard', description: 'Find the area of the largest rectangle in the histogram.', acceptanceRate: '43.7%', solvedCount: 38 },

  { id: 'p-20', title: 'Implement Queue using Stacks', topic: 'Queue', difficulty: 'Easy', description: 'Implement a first in first out (FIFO) queue using only two stacks.', acceptanceRate: '64.8%', solvedCount: 86 },
  { id: 'p-21', title: 'Sliding Window Maximum', topic: 'Queue', difficulty: 'Hard', description: 'Return the max sliding window of size k using monotonic deque.', acceptanceRate: '46.6%', solvedCount: 45 },
  { id: 'p-22', title: 'Design Circular Deque', topic: 'Queue', difficulty: 'Medium', description: 'Design your implementation of the circular double-ended queue (deque).', acceptanceRate: '57.3%', solvedCount: 65 },

  { id: 'p-23', title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', description: 'Find the maximum depth of a binary tree (root to deepest leaf node).', acceptanceRate: '75.0%', solvedCount: 92 },
  { id: 'p-24', title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', description: 'Given the root of a binary tree, invert the tree, and return its root.', acceptanceRate: '76.4%', solvedCount: 94 },
  { id: 'p-25', title: 'Lowest Common Ancestor of a BST', topic: 'Trees', difficulty: 'Medium', description: 'Find the lowest common ancestor node of two given nodes in the BST.', acceptanceRate: '63.2%', solvedCount: 74 },
  { id: 'p-26', title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', description: 'Return the level order traversal of its nodes values (i.e., from left to right, level by level).', acceptanceRate: '66.5%', solvedCount: 77 },
  { id: 'p-27', title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'Hard', description: 'Design an algorithm to serialize and deserialize a binary tree.', acceptanceRate: '56.3%', solvedCount: 40 },

  { id: 'p-28', title: 'Number of Islands (BFS/DFS)', topic: 'Graphs', difficulty: 'Medium', description: 'Count the number of islands formed by connecting adjacent lands horizontally or vertically.', acceptanceRate: '58.3%', solvedCount: 79 },
  { id: 'p-29', title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', description: 'Given a reference of a node in a connected undirected graph, return a deep copy.', acceptanceRate: '56.0%', solvedCount: 68 },
  { id: 'p-30', title: 'Course Schedule (Topological Sort)', topic: 'Graphs', difficulty: 'Medium', description: 'Determine if it is possible for you to finish all courses given prerequisite dependencies.', acceptanceRate: '46.9%', solvedCount: 64 },
  { id: 'p-31', title: 'Word Ladder', topic: 'Graphs', difficulty: 'Hard', description: 'Return the number of words in the shortest transformation sequence from beginWord to endWord.', acceptanceRate: '38.4%', solvedCount: 36 },

  { id: 'p-32', title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', description: 'How many distinct ways can you climb to the top taking 1 or 2 steps?', acceptanceRate: '53.0%', solvedCount: 93 },
  { id: 'p-33', title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', description: 'Return the fewest number of coins that you need to make up that amount.', acceptanceRate: '43.3%', solvedCount: 70 },
  { id: 'p-34', title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', description: 'Return the length of the longest strictly increasing subsequence.', acceptanceRate: '54.5%', solvedCount: 67 },
  { id: 'p-35', title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'Medium', description: 'Find the minimum number of operations required to convert word1 to word2.', acceptanceRate: '56.2%', solvedCount: 58 },
];

// Target 100 students generator across 20 teams (5 students each)
export function generateAllData(): { students: Student[]; teams: Team[]; mentors: Mentor[] } {
  const students: Student[] = [];
  const teams: Team[] = [];
  const mentors = MENTORS_DATA;

  let globalStudentIndex = 0;

  // Preset team targets for realistic dean overview (overall average ~76%)
  const teamBasePerformances = [
    { teamNum: '01', progress: 84, status: 'Active' as const },
    { teamNum: '02', progress: 76, status: 'Active' as const },
    { teamNum: '03', progress: 91, status: 'Active' as const },
    { teamNum: '04', progress: 79, status: 'Active' as const },
    { teamNum: '05', progress: 68, status: 'Needs Attention' as const },
    { teamNum: '06', progress: 88, status: 'Active' as const },
    { teamNum: '07', progress: 78, status: 'Active' as const }, // Mentor Suresh Kumar, includes Rahul Sharma (82%, 54 solved)
    { teamNum: '08', progress: 83, status: 'Active' as const },
    { teamNum: '09', progress: 71, status: 'Active' as const },
    { teamNum: '10', progress: 92, status: 'Active' as const },
    { teamNum: '11', progress: 62, status: 'Needs Attention' as const },
    { teamNum: '12', progress: 74, status: 'Active' as const },
    { teamNum: '13', progress: 81, status: 'Active' as const },
    { teamNum: '14', progress: 69, status: 'Needs Attention' as const },
    { teamNum: '15', progress: 86, status: 'Active' as const },
    { teamNum: '16', progress: 54, status: 'Inactive' as const },
    { teamNum: '17', progress: 77, status: 'Active' as const },
    { teamNum: '18', progress: 89, status: 'Active' as const },
    { teamNum: '19', progress: 73, status: 'Active' as const },
    { teamNum: '20', progress: 80, status: 'Active' as const },
  ];

  for (let t = 0; t < 20; t++) {
    const teamIndex = t + 1;
    const teamId = `team-${teamIndex}`;
    const teamNumber = `Team ${teamIndex.toString().padStart(2, '0')}`;
    const mentor = mentors[t];
    const baseTarget = teamBasePerformances[t].progress;
    const teamStatus = teamBasePerformances[t].status;
    const teamStudentIds: string[] = [];

    const studentVariations = [-5, 3, -1, 4, -1]; // Average delta = 0

    for (let s = 0; s < 5; s++) {
      globalStudentIndex++;
      const studentId = `student-${globalStudentIndex}`;
      teamStudentIds.push(studentId);

      const rollNumInt = globalStudentIndex;
      const rollNo = `22CSE${rollNumInt.toString().padStart(3, '0')}`;
      const firstName = FIRST_NAMES[(globalStudentIndex - 1) % FIRST_NAMES.length];
      const lastName = LAST_NAMES[(globalStudentIndex * 7) % LAST_NAMES.length];
      const fullName = (t === 6 && s === 0) ? 'Rahul Sharma' : `${firstName} ${lastName}`;
      const rollFinal = (t === 6 && s === 0) ? '22CSE101' : rollNo;

      // Calculate progress and problem counts
      let progress = Math.min(100, Math.max(25, baseTarget + studentVariations[s]));
      if (t === 6 && s === 0) {
        progress = 82; // Exactly 82% for Rahul Sharma in Team 07
      }

      // Solved count (Rahul has exactly 54 problems solved if matching prompt)
      let solved = Math.round((progress / 100) * 110);
      if (t === 6 && s === 0) {
        solved = 54;
      }
      const attempted = Math.min(140, Math.round(solved * 1.25 + 5));
      const pending = Math.max(0, 140 - solved);

      let status: StudentStatus = 'Active';
      if (progress < 60) status = 'Inactive';
      else if (progress < 72) status = 'Needs Attention';

      // Streaks
      let streak = (t === 6 && s === 0) ? 12 : Math.max(1, Math.round((progress / 100) * 20) - (s % 3));
      if (status === 'Inactive') streak = 0;
      const longestStreak = streak + Math.floor(Math.random() * 8) + 4;

      let dsaLevel: Student['dsaLevel'] = 'Intermediate';
      if (progress >= 85) dsaLevel = 'Mastery';
      else if (progress >= 70) dsaLevel = 'Advanced';
      else if (progress >= 45) dsaLevel = 'Intermediate';
      else dsaLevel = 'Beginner';

      // Topic Progress for 8 topics
      const topicProgress: Record<DSATopic, { solved: number; total: number; percentage: number }> = {} as any;
      DSA_TOPICS.forEach((topic) => {
        const total = TOPIC_CURRICULUM_TOTALS[topic];
        const topicRatio = Math.max(0.2, Math.min(1.0, (progress / 100) + (Math.sin(s * 2 + topic.length) * 0.15)));
        const topicSolved = Math.round(total * topicRatio);
        topicProgress[topic] = {
          solved: topicSolved,
          total,
          percentage: Math.round((topicSolved / total) * 100),
        };
      });

      // Difficulty breakdown
      const easyTotal = 50;
      const mediumTotal = 65;
      const hardTotal = 25;
      const easySolved = Math.min(easyTotal, Math.round(solved * 0.55));
      const mediumSolved = Math.min(mediumTotal, Math.round(solved * 0.35));
      const hardSolved = Math.max(0, solved - easySolved - mediumSolved);

      // Activities
      const recentActivities = ACTIVITY_BANK.slice(s % 3, (s % 3) + 4).map((act, actIdx) => ({
        ...act,
        id: `act-${globalStudentIndex}-${actIdx}`,
        timestamp: new Date(Date.now() - actIdx * 86400000).toISOString(),
      }));

      // Submissions history for sparklines
      const submissionsHistory = [
        { date: 'Mon', count: Math.floor(Math.random() * 5) + 1 },
        { date: 'Tue', count: Math.floor(Math.random() * 7) + 2 },
        { date: 'Wed', count: Math.floor(Math.random() * 6) + 1 },
        { date: 'Thu', count: Math.floor(Math.random() * 8) + 3 },
        { date: 'Fri', count: Math.floor(Math.random() * 5) + 2 },
        { date: 'Sat', count: Math.floor(Math.random() * 9) + 4 },
        { date: 'Sun', count: Math.floor(Math.random() * 6) + 1 },
      ];

      students.push({
        id: studentId,
        rollNo: rollFinal,
        name: fullName,
        email: `${fullName.toLowerCase().replace(/\s+/g, '.')}.22@gkce.edu.in`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}&backgroundColor=b6e3f4,c0aede,d1d4f9`,
        teamId,
        teamNumber,
        mentorId: mentor.id,
        mentorName: mentor.name,
        dsaLevel,
        progress,
        solved,
        attempted,
        pending,
        streak,
        longestStreak,
        status,
        topicProgress,
        difficultyStats: {
          easy: { solved: easySolved, total: easyTotal },
          medium: { solved: mediumSolved, total: mediumTotal },
          hard: { solved: hardSolved, total: hardTotal },
        },
        recentActivities,
        submissionsHistory,
        leetcodeUsername: `${fullName.toLowerCase().replace(/\s+/g, '_')}_gkce`,
        githubUsername: `${fullName.toLowerCase().replace(/\s+/g, '')}22`,
        mentorFeedbackNotes: [
          {
            id: `note-${studentId}-1`,
            date: '2026-08-14',
            author: mentor.name,
            note: 'Consistent performance in Linked Lists and Stack. Recommended to practice more Medium DP questions.',
          }
        ]
      });
    }

    // Aggregate Team data from its 5 students
    const teamStudents = students.filter(st => st.teamId === teamId);
    const avgProg = Math.round(teamStudents.reduce((sum, st) => sum + st.progress, 0) / 5);
    const totalSolved = teamStudents.reduce((sum, st) => sum + st.solved, 0);
    const totalAttempted = teamStudents.reduce((sum, st) => sum + st.attempted, 0);
    const avgStreak = Math.round((teamStudents.reduce((sum, st) => sum + st.streak, 0) / 5) * 10) / 10;

    const topicPerformance: Record<DSATopic, number> = {} as any;
    DSA_TOPICS.forEach((topic) => {
      const avgTopic = Math.round(teamStudents.reduce((acc, st) => acc + st.topicProgress[topic].percentage, 0) / 5);
      topicPerformance[topic] = avgTopic;
    });

    teams.push({
      id: teamId,
      teamNumber,
      name: `Team ${teamIndex.toString().padStart(2, '0')}`,
      mentorId: mentor.id,
      mentorName: mentor.name,
      mentorEmail: mentor.email,
      mentorDepartment: mentor.department,
      studentIds: teamStudentIds,
      avgProgress: avgProg,
      totalSolved,
      totalAttempted,
      avgStreak,
      status: teamStatus,
      topicPerformance,
      rank: 0,
    });
  }

  // Assign ranks to teams based on avgProgress
  const sortedTeams = [...teams].sort((a, b) => b.avgProgress - a.avgProgress);
  sortedTeams.forEach((t, index) => {
    const found = teams.find(item => item.id === t.id);
    if (found) found.rank = index + 1;
  });

  return { students, teams, mentors };
}

// Generate the canonical dataset once
export const INITIAL_DATA = generateAllData();
export const ALL_STUDENTS = INITIAL_DATA.students;
export const ALL_TEAMS = INITIAL_DATA.teams;
export const ALL_MENTORS = INITIAL_DATA.mentors;

// Dean Privileged User
export const DEAN_USER = {
  id: 'dean-1',
  name: 'Dr. R. V. Raman',
  email: 'dean.academics@gkce.edu.in',
  role: 'DEAN' as const,
  title: 'Dean of Academic Affairs & Computing',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

// Default Mentor for Quick Switcher (Prof. Suresh Kumar - Team 07)
export const DEFAULT_MENTOR_USER = {
  id: ALL_MENTORS[6].id,
  name: ALL_MENTORS[6].name,
  email: ALL_MENTORS[6].email,
  role: 'MENTOR' as const,
  title: 'Assistant Professor, CSE Dept',
  avatar: ALL_MENTORS[6].avatar,
  mentorData: ALL_MENTORS[6],
  teamId: 'team-7',
  teamNumber: 'Team 07',
};

// Default Student for Quick Switcher (Rahul Sharma - Team 07 - 22CSE101)
export const DEFAULT_STUDENT_USER = {
  id: ALL_STUDENTS.find(s => s.teamNumber === 'Team 07')!.id,
  name: ALL_STUDENTS.find(s => s.teamNumber === 'Team 07')!.name,
  email: ALL_STUDENTS.find(s => s.teamNumber === 'Team 07')!.email,
  role: 'STUDENT' as const,
  title: 'B.Tech CSE - 3rd Year',
  avatar: ALL_STUDENTS.find(s => s.teamNumber === 'Team 07')!.avatar,
  studentData: ALL_STUDENTS.find(s => s.teamNumber === 'Team 07')!,
  teamId: 'team-7',
  teamNumber: 'Team 07',
};

// Overall Platform Aggregate Stats
export const PLATFORM_STATS = {
  totalStudents: 100,
  totalTeams: 20,
  totalMentors: 20,
  overallProgress: Math.round(ALL_STUDENTS.reduce((acc, s) => acc + s.progress, 0) / 100), // ~76%
  totalSolved: ALL_STUDENTS.reduce((acc, s) => acc + s.solved, 0),
  activeStudentsCount: ALL_STUDENTS.filter(s => s.status === 'Active').length,
  needsAttentionCount: ALL_STUDENTS.filter(s => s.status === 'Needs Attention').length,
  inactiveCount: ALL_STUDENTS.filter(s => s.status === 'Inactive').length,
  topTeam: ALL_TEAMS.reduce((prev, curr) => (curr.avgProgress > prev.avgProgress ? curr : prev), ALL_TEAMS[0]),
};
