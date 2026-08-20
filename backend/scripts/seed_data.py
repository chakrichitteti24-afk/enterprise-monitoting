import sys
import os
import random
from datetime import datetime, timezone, timedelta

# Ensure UTF-8 output encoding on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure backend root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.core.security import get_password_hash
from app.models.enums import (
    UserRole,
    StudentStatus,
    DSALevel,
    ProblemDifficulty,
    DSATopic,
    SubmissionStatus,
)
from app.models.user import User
from app.models.team import Team
from app.models.mentor import Mentor
from app.models.student import Student
from app.models.problem import DSAProblem
from app.models.submission import Submission
from app.models.progress import StudentProgress
from app.models.activity import ActivityLog
from app.models.note import MentorNote

# Demo credentials for institutional access
DEAN_PASSWORD = "Dean@GKCE2026"
MENTOR_PASSWORD = "Mentor@GKCE2026"
STUDENT_PASSWORD = "Student@GKCE2026"

# Real GKCE Students Roster from In-House DSA Training Programme
REAL_GKCE_STUDENTS = [
    # Team 01 (5 Students)
    {"name": "BODDU ANANTHALAKSHMI", "roll": "23F81A0502", "team": 1, "class": "III B.Tech CSE"},
    {"name": "PITTI DEVIKA (MQ)", "roll": "23F81A0507", "team": 1, "class": "III B.Tech CSE"},
    {"name": "GALLA KAVITHA", "roll": "23F81A0513", "team": 1, "class": "III B.Tech CSE"},
    {"name": "BATTA JASWITHA", "roll": "23F81A0511", "team": 1, "class": "III B.Tech CSE"},
    {"name": "JEELAGA THANUSHA", "roll": "23F81A0538", "team": 1, "class": "III B.Tech CSE"},

    # Team 02 (4 Students)
    {"name": "SHAIK HABEEBA", "roll": "23F81A0510", "team": 2, "class": "III B.Tech CSE"},
    {"name": "GADDAM BHARGAVI", "roll": "23F81A0504", "team": 2, "class": "III B.Tech CSE"},
    {"name": "GADDAM PALLAVI", "roll": "23F81A0525", "team": 2, "class": "III B.Tech CSE"},
    {"name": "KATURU SRAVANTHI", "roll": "23F81A0534", "team": 2, "class": "III B.Tech CSE"},

    # Team 03 (4 Students)
    {"name": "MODI KAVYA", "roll": "23F81A0514", "team": 3, "class": "III B.Tech CSE"},
    {"name": "VUKKADALA MANASA", "roll": "24F85A0508", "team": 3, "class": "III B.Tech CSE"},
    {"name": "KUTLURU DIVYA SRI", "roll": "23F81A0509", "team": 3, "class": "III B.Tech CSE"},
    {"name": "KONERU VYSHNAVI", "roll": "23F81A0542", "team": 3, "class": "III B.Tech CSE"},

    # Team 04 (5 Students)
    {"name": "KARUMANCHI MUNI KUMAR", "roll": "23F81A0520", "team": 4, "class": "III B.Tech CSE"},
    {"name": "NELLORE MUNI SAI SUDHARSAN", "roll": "23F81A0521", "team": 4, "class": "III B.Tech CSE"},
    {"name": "PALETI SAI", "roll": "23F81A0529", "team": 4, "class": "III B.Tech CSE"},
    {"name": "VAVILA SRIHARI", "roll": "23F81A0535", "team": 4, "class": "III B.Tech CSE"},
    {"name": "PAGADALA PUNEETH", "roll": "23F81A0527", "team": 4, "class": "III B.Tech CSE"},

    # Team 05 (5 Students)
    {"name": "PILLI BHANU TEJA", "roll": "23F81A0545", "team": 5, "class": "III B.Tech CSE"},
    {"name": "BHASKAR JAYASREE", "roll": "23F81A0562", "team": 5, "class": "III B.Tech CSE"},
    {"name": "CHALLA SAILAJA", "roll": "23F81A0572", "team": 5, "class": "III B.Tech CSE"},
    {"name": "BONUBOYINA SRAVANI", "roll": "23F81A0578", "team": 5, "class": "III B.Tech CSE"},
    {"name": "SREERAM VINEELA KEERTHI", "roll": "24F85A0517", "team": 5, "class": "III B.Tech CSE"},

    # Team 06 (3 Students)
    {"name": "VETTI SONI", "roll": "23F81A0577", "team": 6, "class": "III B.Tech CSE"},
    {"name": "KALLURU VAISHNAVI", "roll": "23F81A0581", "team": 6, "class": "III B.Tech CSE"},
    {"name": "CHINTHAGINJALA SILPA", "roll": "23F81A0576", "team": 6, "class": "III B.Tech CSE"},

    # Team 07 (6 Students) - Mentor: Mrs. Ludvika
    {"name": "CH. CHAKRI", "roll": "24F81A0522", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "P. GAYANI", "roll": "24F81A0534", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "P. AKHILA", "roll": "24F81A0504", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "C. JAHNAVI", "roll": "24F81A0549", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "S. HARSHITHA", "roll": "24F81A0544", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "S. SUDHA", "roll": "24F81A05B2", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},

    # Team 08 (3 Students) - Mentor: Mr. Vishnu
    {"name": "S. KARTHIK", "roll": "24F81A0553", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},
    {"name": "K. CHANDRA SEKHAR", "roll": "24F81A0530", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},
    {"name": "G. GOWTHAM", "roll": "24F81A0537", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},

    # Team 09 (6 Students) - Mentor: Mrs. Manjusha
    {"name": "M. ESWAR", "roll": "24F81A0532", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "K. KEERTHANA", "roll": "24F81A0554", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "D. HIMA VARSHA", "roll": "24F81A0548", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "B. KISHORE NAIK", "roll": "24F81A0557", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "E. ANUSHA", "roll": "24F81A0508", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "U. JHANAKI", "roll": "24F81A0550", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},

    # Team 10 (5 Students) - Mentor: Mrs. Teja
    {"name": "M. VENKATESWARLU", "roll": "24F81A05C7", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "P. PRASANNA KUMAR", "roll": "24F81A0591", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "T. PRABAKAR", "roll": "24F81A0590", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "T. TEJA", "roll": "24F81A05C0", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "E. PRASHANTH", "roll": "24F81A0592", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
]

# 20 Mentors metadata
MENTORS_DATA = [
    ("Dr. K. Suresh Kumar", "suresh.kumar@gkce.edu.in", "CSE (Algorithms)", 12),
    ("Mrs. P. Radhika", "radhika.p@gkce.edu.in", "CSE (Data Structures)", 8),
    ("Mr. M. Ramesh", "ramesh.m@gkce.edu.in", "CSE (Software Engg)", 7),
    ("Mrs. S. Lakshmi", "lakshmi.s@gkce.edu.in", "CSE (Machine Learning)", 9),
    ("Mr. N. Rajesh", "rajesh.n@gkce.edu.in", "CSE (Database Systems)", 6),
    ("Mrs. G. Pavani", "pavani.g@gkce.edu.in", "CSE (Programming Tech)", 5),
    ("Mrs. Ludvika", "ludvika@gkce.edu.in", "CSE (DSA & Full Stack)", 8),
    ("Mr. Vishnu", "vishnu@gkce.edu.in", "CSE (Algorithms & Cloud)", 7),
    ("Mrs. Manjusha", "manjusha@gkce.edu.in", "CSE (Problem Solving)", 10),
    ("Mrs. Teja", "teja.faculty@gkce.edu.in", "CSE (Applied DSA)", 6),
    ("Dr. M. Srinivasa Rao", "mentor.11@gkce.edu.in", "CSE (Algorithms)", 14),
    ("Prof. Sunita Deshmukh", "mentor.12@gkce.edu.in", "CSE (Data Structures)", 12),
    ("Dr. Ananya Ray", "mentor.13@gkce.edu.in", "CSE (AI & Systems)", 10),
    ("Prof. K. Venkatesh", "mentor.14@gkce.edu.in", "CSE (Systems & Cloud)", 15),
    ("Dr. P. Rajesh Kumar", "mentor.15@gkce.edu.in", "CSE (Competitive Coding)", 11),
    ("Prof. B. Deepa", "mentor.16@gkce.edu.in", "CSE (Data Mining)", 9),
    ("Dr. S. Mohan Das", "mentor.17@gkce.edu.in", "CSE (Graph Theory)", 16),
    ("Prof. Kavita Reddy", "mentor.18@gkce.edu.in", "CSE (Full Stack)", 8),
    ("Dr. C. Balasubramanian", "mentor.19@gkce.edu.in", "CSE (Software Engg)", 13),
    ("Prof. Meera Nair", "mentor.20@gkce.edu.in", "CSE (Theoretical CS)", 10),
]

TEAM_NAMES = [
    "Algorithm Aces", "Binary Bandits", "Dynamic Dynamos", "Graph Gurus", "Stack Smashers",
    "Queue Queens", "Tree Titans", "Recursion Rangers", "Bitwise Battlers", "Heap Heroes",
    "Matrix Masters", "Hash Hackers", "Pointer Prodigies", "Greedy Giants", "Backtrack Busters",
    "Trie Troopers", "Search Specialists", "Sorting Stars", "Divide Conquerors", "Logic Lords"
]

DSA_PROBLEMS_SEED = [
    ("Two Sum", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/two-sum", "54.2%"),
    ("Best Time to Buy and Sell Stock", "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a different day in the future to sell.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", "53.8%"),
    ("3Sum", "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and nums[i] + nums[j] + nums[k] == 0.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/3sum", "34.1%"),
    ("Container With Most Water", "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/container-with-most-water", "55.0%"),
    ("Trapping Rain Water", "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", ProblemDifficulty.HARD, DSATopic.ARRAYS, "https://leetcode.com/problems/trapping-rain-water", "60.4%"),
    ("Valid Palindrome", "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", ProblemDifficulty.EASY, DSATopic.STRINGS, "https://leetcode.com/problems/valid-palindrome", "47.1%"),
    ("Longest Substring Without Repeating Characters", "Given a string s, find the length of the longest substring without repeating characters.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/longest-substring-without-repeating-characters", "35.0%"),
    ("Longest Palindromic Substring", "Given a string s, return the longest palindromic substring in s.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/longest-palindromic-substring", "33.8%"),
    ("Minimum Window Substring", "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.", ProblemDifficulty.HARD, DSATopic.STRINGS, "https://leetcode.com/problems/minimum-window-substring", "42.5%"),
    ("Reverse Linked List", "Given the head of a singly linked list, reverse the list, and return the reversed list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/reverse-linked-list", "75.4%"),
    ("Merge Two Sorted Lists", "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/merge-two-sorted-lists", "64.2%"),
    ("Linked List Cycle", "Given head, the head of a linked list, determine if the linked list has a cycle in it.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/linked-list-cycle", "50.1%"),
    ("Remove Nth Node From End of List", "Given the head of a linked list, remove the nth node from the end of the list and return its head.", ProblemDifficulty.MEDIUM, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/remove-nth-node-from-end-of-list", "45.7%"),
    ("Valid Parentheses", "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", ProblemDifficulty.EASY, DSATopic.STACK, "https://leetcode.com/problems/valid-parentheses", "40.8%"),
    ("Min Stack", "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/min-stack", "53.9%"),
    ("Daily Temperatures", "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/daily-temperatures", "66.2%"),
    ("Largest Rectangle in Histogram", "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.", ProblemDifficulty.HARD, DSATopic.STACK, "https://leetcode.com/problems/largest-rectangle-in-histogram", "44.1%"),
    ("Implement Queue using Stacks", "Implement a first in first out (FIFO) queue using only two stacks.", ProblemDifficulty.EASY, DSATopic.QUEUE, "https://leetcode.com/problems/implement-queue-using-stacks", "65.3%"),
    ("Sliding Window Maximum", "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.", ProblemDifficulty.HARD, DSATopic.QUEUE, "https://leetcode.com/problems/sliding-window-maximum", "46.8%"),
    ("Maximum Depth of Binary Tree", "Given the root of a binary tree, return its maximum depth.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/maximum-depth-of-binary-tree", "75.6%"),
    ("Invert Binary Tree", "Given the root of a binary tree, invert the tree, and return its root.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/invert-binary-tree", "77.1%"),
    ("Lowest Common Ancestor of a BST", "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree", "64.5%"),
    ("Binary Tree Level Order Traversal", "Given the root of a binary tree, return the level order traversal of its nodes' values.", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-level-order-traversal", "67.0%"),
    ("Binary Tree Maximum Path Sum", "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum of any non-empty path.", ProblemDifficulty.HARD, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-maximum-path-sum", "40.1%"),
    ("Number of Islands", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/number-of-islands", "59.2%"),
    ("Clone Graph", "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/clone-graph", "56.4%"),
    ("Course Schedule", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/course-schedule", "47.3%"),
    ("Word Ladder", "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words. Return the number of words in the shortest transformation sequence.", ProblemDifficulty.HARD, DSATopic.GRAPHS, "https://leetcode.com/problems/word-ladder", "38.9%"),
    ("Climbing Stairs", "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", ProblemDifficulty.EASY, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/climbing-stairs", "53.1%"),
    ("Coin Change", "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/coin-change", "43.9%"),
    ("Longest Increasing Subsequence", "Given an integer array nums, return the length of the longest strictly increasing subsequence.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/longest-increasing-subsequence", "55.3%"),
    ("House Robber", "You are a professional robber planning to rob houses along a street. Determine the maximum amount of money you can rob tonight without alerting the police.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/house-robber", "51.2%"),
    ("Edit Distance", "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.", ProblemDifficulty.HARD, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/edit-distance", "56.8%"),
]

def seed(db_session: Session = None):
    """Seed database with complete GKCE institutional dataset."""
    close_db = False
    if db_session is not None:
        db = db_session
    else:
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_db = True

    random.seed(42)

    try:
        # Precompute bcrypt password hashes
        print("[1/6] Precomputing security hashes...")
        dean_pwd_hash = get_password_hash(DEAN_PASSWORD)
        mentor_pwd_hash = get_password_hash(MENTOR_PASSWORD)
        student_pwd_hash = get_password_hash(STUDENT_PASSWORD)

        # 1. Dean User
        print("[2/6] Creating Dean Administrator...")
        dean_user = User(
            name="Dr. R. V. Raman",
            email="dean.academics@gkce.edu.in",
            password_hash=dean_pwd_hash,
            role=UserRole.DEAN,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            is_active=True,
        )
        db.add(dean_user)
        db.flush()

        # 2. Teams and Mentors (20 Teams)
        print("[3/6] Creating 20 Mentored Teams...")
        team_objs = []
        mentor_users = []
        mentor_profiles = []

        for i in range(20):
            t_num_str = f"Team {i+1:02d}"
            t_name = TEAM_NAMES[i]
            m_name, m_email, m_dept, m_exp = MENTORS_DATA[i]

            team = Team(team_number=t_num_str, name=t_name)
            db.add(team)
            db.flush()
            team_objs.append(team)

            m_user = User(
                name=m_name,
                email=m_email,
                password_hash=mentor_pwd_hash,
                role=UserRole.MENTOR,
                avatar_url=f"https://images.unsplash.com/photo-{1507003211169 + i * 17}?w=150&auto=format&fit=crop&q=80",
                is_active=True,
            )
            db.add(m_user)
            db.flush()
            mentor_users.append(m_user)

            m_profile = Mentor(
                user_id=m_user.id,
                department=m_dept,
                phone=f"+91 98480 {10000 + i}",
                experience_years=m_exp,
                assigned_team_id=team.id,
            )
            db.add(m_profile)
            mentor_profiles.append(m_profile)

        db.flush()

        # 3. DSA Problems (34 Problems)
        print("[4/6] Seeding DSA Problems Bank (34 Challenges)...")
        problem_objs = []
        for title, desc, diff, topic, url, acc in DSA_PROBLEMS_SEED:
            prob = DSAProblem(
                title=title,
                description=desc,
                difficulty=diff,
                topic=topic,
                platform_url=url,
                acceptance_rate=acc,
                total_test_cases=10,
            )
            db.add(prob)
            problem_objs.append(prob)
        db.flush()

        # 4. Students & Performance (Real GKCE Students Roster)
        print(f"[5/6] Ingesting {len(REAL_GKCE_STUDENTS)} Authentic GKCE Students...")
        student_users = []
        student_profiles = []
        progress_objs = []

        for idx, s_info in enumerate(REAL_GKCE_STUDENTS, 1):
            team_id = s_info["team"]
            team_obj = team_objs[team_id - 1]
            roll_no = s_info["roll"]
            name = s_info["name"]

            # Institutional email based on roll number
            email = f"{roll_no.lower()}@gkce.edu.in"
            if "CHAKRI" in name:
                email = "chakri.24f81a0522@gkce.edu.in"

            s_user = User(
                name=name,
                email=email,
                password_hash=student_pwd_hash,
                role=UserRole.STUDENT,
                avatar_url=f"https://images.unsplash.com/photo-{1535713875002 + idx * 23}?w=150&auto=format&fit=crop&q=80",
                is_active=True,
            )
            db.add(s_user)
            db.flush()
            student_users.append(s_user)

            # Assign realistic DSA performance metrics
            perf_factor = random.uniform(0.65, 0.95) if "CHAKRI" in name or idx % 3 == 0 else random.uniform(0.40, 0.85)
            solved_count = min(len(problem_objs), max(6, int(len(problem_objs) * perf_factor)))
            attempted_count = min(len(problem_objs), solved_count + random.randint(1, 4))
            streak = random.randint(3, 14)
            longest_streak = streak + random.randint(2, 6)

            dsa_level = (
                DSALevel.MASTERY if solved_count >= 28
                else DSALevel.ADVANCED if solved_count >= 20
                else DSALevel.INTERMEDIATE if solved_count >= 12
                else DSALevel.BEGINNER
            )

            status = StudentStatus.ACTIVE if perf_factor >= 0.50 else StudentStatus.NEEDS_ATTENTION

            s_profile = Student(
                user_id=s_user.id,
                roll_number=roll_no,
                team_id=team_obj.id,
                status=status,
                dsa_level=dsa_level,
                leetcode_username=f"{name.lower().replace(' ', '_')[:12]}_{roll_no[-4:]}",
                github_username=f"{name.lower().replace(' ', '')[:10]}_{roll_no[-4:]}",
            )
            db.add(s_profile)
            db.flush()
            student_profiles.append(s_profile)

            # Topic progress breakdown
            topic_prog = {}
            for top in DSATopic:
                t_probs = [p for p in problem_objs if p.topic == top]
                t_total = len(t_probs)
                t_solved = min(t_total, int(t_total * perf_factor))
                t_pct = int((t_solved / max(1, t_total)) * 100)
                topic_prog[top.value] = {"solved": t_solved, "total": t_total, "percentage": t_pct}

            easy_s = sum(1 for p in problem_objs[:solved_count] if p.difficulty == ProblemDifficulty.EASY)
            med_s = sum(1 for p in problem_objs[:solved_count] if p.difficulty == ProblemDifficulty.MEDIUM)
            hard_s = sum(1 for p in problem_objs[:solved_count] if p.difficulty == ProblemDifficulty.HARD)

            sp = StudentProgress(
                student_id=s_profile.id,
                problems_solved=solved_count,
                problems_attempted=attempted_count,
                overall_percentage=round((solved_count / len(problem_objs)) * 100, 1),
                current_streak=streak,
                longest_streak=longest_streak,
                easy_solved=easy_s,
                medium_solved=med_s,
                hard_solved=hard_s,
            )
            db.add(sp)
            progress_objs.append(sp)

        db.flush()

        # 5. Activity Logs & Submissions for Real Students
        print("[6/6] Generating Submissions & Mentorship Logs...")
        for s_prof in student_profiles:
            solved_sample = random.sample(problem_objs, min(5, len(problem_objs)))
            for prob in solved_sample:
                sub = Submission(
                    student_id=s_prof.id,
                    problem_id=prob.id,
                    status=SubmissionStatus.SOLVED,
                    score=100.0,
                    runtime_ms=random.randint(25, 95),
                    memory_mb=round(random.uniform(38.0, 48.0), 1),
                    code_snippet=f"// GKCE DSA Level 1 Solution for {prob.title}\nclass Solution {{\n    public int solve() {{\n        return 0;\n    }}\n}}",
                    language="Java",
                    submitted_at=datetime.now(timezone.utc) - timedelta(hours=random.randint(2, 72)),
                )
                db.add(sub)

                act = ActivityLog(
                    student_id=s_prof.id,
                    activity_type="SOLVED",
                    problem_id=prob.id,
                    description=f"Solved '{prob.title}' with 100% test case pass rate.",
                    created_at=sub.submitted_at,
                )
                db.add(act)

            # Add feedback notes
            db.add(
                MentorNote(
                    student_id=s_prof.id,
                    mentor_id=s_prof.team.mentor.id,
                    note=f"Good progress on Level-1 DSA concepts. Regular practice observed during lab sessions.",
                    created_at=datetime.now(timezone.utc) - timedelta(days=2),
                )
            )

        db.commit()

        print("\n==========================================================")
        print("   ✅ SEEDING COMPLETE WITH AUTHENTIC GKCE ROSTER!         ")
        print("==========================================================")
        print(f"Total Users:      {db.query(User).count()} (1 Dean, 20 Mentors, {len(REAL_GKCE_STUDENTS)} Students)")
        print(f"Teams:            {db.query(Team).count()} Teams")
        print(f"DSA Problems:     {db.query(DSAProblem).count()} Problems")
        print(f"Submissions:      {db.query(Submission).count()} Recorded Submissions")
        print(f"Dean:             dean.academics@gkce.edu.in | {DEAN_PASSWORD}")
        print(f"Mrs. Ludvika:     ludvika@gkce.edu.in | {MENTOR_PASSWORD}")
        print(f"CH. Chakri:       chakri.24f81a0522@gkce.edu.in | {STUDENT_PASSWORD}")
        print("==========================================================")

    except Exception as e:
        db.rollback()
        print(f"\n❌ Seeding failed: {e}")
        import traceback
        traceback.print_exc()
        raise e
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    seed()
