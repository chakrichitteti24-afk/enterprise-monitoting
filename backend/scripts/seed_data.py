import sys
import os
import random
import re
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

# Institutional demo credentials
DEAN_PASSWORD = "gkce@1234"
MENTOR_PASSWORD = "Mentor@GKCE2026"
STUDENT_PASSWORD = "gkce@1234"

# 8 Mentors metadata according to accurate schema
MENTORS_DATA = [
    ("K.S.GAYATHRI", "ksgayathri@gkce.edu.in", "Computer Science & Engg", 8),
    ("SK SHABANA", "skshabana@gkce.edu.in", "Computer Science & Engg", 8),
    ("V.RAMYA", "vramya@gkce.edu.in", "Computer Science & Engg", 7),
    ("SAMYUKTHA", "samyuktha@gkce.edu.in", "Computer Science & Engg", 8),
    ("K.SUDHAKAR", "ksudhakar@gkce.edu.in", "Computer Science & Engg", 9),
    ("K.KEERTHANA", "kkeerthana@gkce.edu.in", "Computer Science & Engg", 6),
    ("A.LUDWIKA", "ludwikha@gkce.edu.in", "Computer Science & Engg", 8),
    ("C.MANJUSHA", "manjusha@gkce.edu.in", "Computer Science & Engg", 10),
]

TEAM_NAMES = [
    "Algorithm Aces", "Binary Bandits", "Dynamic Dynamos", "Graph Gurus",
    "Stack Smashers", "Queue Queens", "Tree Titans", "Recursion Rangers"
]

# 34 Standardized DSA Problems
DSA_PROBLEMS_SEED = [
    # Arrays (5)
    ("Two Sum", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/two-sum", "54.2%"),
    ("Best Time to Buy and Sell Stock", "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a different day in the future to sell.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", "53.8%"),
    ("3Sum", "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and nums[i] + nums[j] + nums[k] == 0.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/3sum", "34.1%"),
    ("Container With Most Water", "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/container-with-most-water", "55.0%"),
    ("Trapping Rain Water", "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", ProblemDifficulty.HARD, DSATopic.ARRAYS, "https://leetcode.com/problems/trapping-rain-water", "60.4%"),

    # Strings (4)
    ("Valid Palindrome", "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", ProblemDifficulty.EASY, DSATopic.STRINGS, "https://leetcode.com/problems/valid-palindrome", "47.1%"),
    ("Longest Substring Without Repeating Characters", "Given a string s, find the length of the longest substring without repeating characters.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/longest-substring-without-repeating-characters", "35.0%"),
    ("Longest Palindromic Substring", "Given a string s, return the longest palindromic substring in s.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/longest-palindromic-substring", "33.8%"),
    ("Minimum Window Substring", "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.", ProblemDifficulty.HARD, DSATopic.STRINGS, "https://leetcode.com/problems/minimum-window-substring", "42.5%"),

    # Linked Lists (4)
    ("Reverse Linked List", "Given the head of a singly linked list, reverse the list, and return the reversed list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/reverse-linked-list", "75.4%"),
    ("Merge Two Sorted Lists", "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/merge-two-sorted-lists", "64.2%"),
    ("Linked List Cycle", "Given head, the head of a linked list, determine if the linked list has a cycle in it.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/linked-list-cycle", "50.1%"),
    ("Remove Nth Node From End of List", "Given the head of a linked list, remove the nth node from the end of the list and return its head.", ProblemDifficulty.MEDIUM, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/remove-nth-node-from-end-of-list", "45.7%"),

    # Stack (4)
    ("Valid Parentheses", "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", ProblemDifficulty.EASY, DSATopic.STACK, "https://leetcode.com/problems/valid-parentheses", "40.8%"),
    ("Min Stack", "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/min-stack", "53.9%"),
    ("Daily Temperatures", "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/daily-temperatures", "66.2%"),
    ("Largest Rectangle in Histogram", "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.", ProblemDifficulty.HARD, DSATopic.STACK, "https://leetcode.com/problems/largest-rectangle-in-histogram", "44.1%"),

    # Queue (2)
    ("Implement Queue using Stacks", "Implement a first in first out (FIFO) queue using only two stacks.", ProblemDifficulty.EASY, DSATopic.QUEUE, "https://leetcode.com/problems/implement-queue-using-stacks", "65.3%"),
    ("Sliding Window Maximum", "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.", ProblemDifficulty.HARD, DSATopic.QUEUE, "https://leetcode.com/problems/sliding-window-maximum", "46.8%"),

    # Trees (5)
    ("Maximum Depth of Binary Tree", "Given the root of a binary tree, return its maximum depth.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/maximum-depth-of-binary-tree", "75.6%"),
    ("Invert Binary Tree", "Given the root of a binary tree, invert the tree, and return its root.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/invert-binary-tree", "77.1%"),
    ("Lowest Common Ancestor of a BST", "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree", "64.5%"),
    ("Binary Tree Level Order Traversal", "Given the root of a binary tree, return the level order traversal of its nodes' values.", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-level-order-traversal", "67.0%"),
    ("Binary Tree Maximum Path Sum", "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum of any non-empty path.", ProblemDifficulty.HARD, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-maximum-path-sum", "40.1%"),

    # Graphs (4)
    ("Number of Islands", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/number-of-islands", "59.2%"),
    ("Clone Graph", "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/clone-graph", "56.4%"),
    ("Course Schedule", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/course-schedule", "47.3%"),
    ("Word Ladder", "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words. Return the number of words in the shortest transformation sequence.", ProblemDifficulty.HARD, DSATopic.GRAPHS, "https://leetcode.com/problems/word-ladder", "38.9%"),

    # Dynamic Programming (6)
    ("Climbing Stairs", "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", ProblemDifficulty.EASY, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/climbing-stairs", "53.1%"),
    ("Coin Change", "You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/coin-change", "43.9%"),
    ("Longest Increasing Subsequence", "Given an integer array nums, return the length of the longest strictly increasing subsequence.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/longest-increasing-subsequence", "55.3%"),
    ("House Robber", "You are a professional robber planning to rob houses along a street. Determine the maximum amount of money you can rob tonight without alerting the police.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/house-robber", "51.2%"),
    ("Edit Distance", "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.", ProblemDifficulty.HARD, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/edit-distance", "56.8%"),
    ("Maximum Subarray", "Find the contiguous subarray with the largest sum and return its sum (Kadane's Algorithm).", ProblemDifficulty.EASY, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/maximum-subarray", "50.9%"),
]

# Real GKCE Students Roster (39 Students across 8 Teams)
REAL_GKCE_STUDENTS = [
    # Team 1 (Mentor: K.S.GAYATHRI)
    {"name": "ANANTHALAKSHMI.BODDU", "roll": "23F81A0502", "team": 1},
    {"name": "DEVIKA.PITTI", "roll": "23F81A0507", "team": 1},
    {"name": "KAVITHA.GALLA", "roll": "23F81A0513", "team": 1},
    {"name": "JASWITHA.BATTA", "roll": "23F81A0511", "team": 1},
    {"name": "THANUSHA.JEELAGA", "roll": "23F81A0538", "team": 1},

    # Team 2 (Mentor: SK SHABANA)
    {"name": "HABEEBA.SHAIK", "roll": "23F81A0510", "team": 2},
    {"name": "BHARGAVI.GADDAM", "roll": "23F81A0504", "team": 2},
    {"name": "PALLAVI.GADDAM", "roll": "23F81A0525", "team": 2},
    {"name": "SRAVANTHI.KATURU", "roll": "23F81A0534", "team": 2},

    # Team 3 (Mentor: V.RAMYA)
    {"name": "KAVYA.MODI", "roll": "23F81A0514", "team": 3},
    {"name": "MANASA VUKKADALA", "roll": "24F85A0508", "team": 3},
    {"name": "DIVYA SRI.KUTLURU", "roll": "23F81A0509", "team": 3},
    {"name": "VYSHNAVI.KONERU", "roll": "23F81A0542", "team": 3},

    # Team 4 (Mentor: SAMYUKTHA)
    {"name": "MUNI KUMAR.KARUMANCHI", "roll": "23F81A0520", "team": 4},
    {"name": "MUNI SAI SUDHARSAN.NELLORE", "roll": "23F81A0521", "team": 4},
    {"name": "SAI.PALETI", "roll": "23F81A0529", "team": 4},
    {"name": "SRIHARI.VAVILA", "roll": "23F81A0535", "team": 4},
    {"name": "PUNEETH.PAGADALA", "roll": "23F81A0527", "team": 4},

    # Team 5 (Mentor: K.SUDHAKAR)
    {"name": "BHANU TEJA.PILLI", "roll": "23F81A0545", "team": 5},
    {"name": "JAYASREE.BHASKAR", "roll": "23F81A0562", "team": 5},
    {"name": "SAILAJA.CHALLA", "roll": "23F81A0572", "team": 5},
    {"name": "SRAVANI.BONUBOYINA", "roll": "23F81A0578", "team": 5},
    {"name": "VINEELA KEERTHI SREERAM", "roll": "24F85A0517", "team": 5},

    # Team 6 (Mentor: K.KEERTHANA)
    {"name": "DIVYA KUMAWAT.PANNALAL", "roll": "23F81A0552", "team": 6},
    {"name": "SONI.VETTI", "roll": "23F81A0577", "team": 6},
    {"name": "VAISHNAVI.KALLURU", "roll": "23F81A0581", "team": 6},
    {"name": "SILPA.CHINTHAGINJALA", "roll": "23F81A0576", "team": 6},

    # Team 7 (Mentor: A.LUDWIKA)
    {"name": "CH. CHAKRI", "roll": "24F81A0522", "team": 7},
    {"name": "P.GAYANI", "roll": "24F81A0534", "team": 7},
    {"name": "P.AKHILA", "roll": "24F81A0504", "team": 7},
    {"name": "C.JAHNAVI", "roll": "24F81A0549", "team": 7},
    {"name": "S. HARSHITHA", "roll": "24F81A0544", "team": 7},
    {"name": "S.KARTHIK", "roll": "24F81A0553", "team": 7},

    # Team 8 (Mentor: C.MANJUSHA)
    {"name": "M.ESWAR", "roll": "24F81A0532", "team": 8},
    {"name": "K.KEERTHANA", "roll": "24F81A0554", "team": 8},
    {"name": "D. HIMA VARSHA", "roll": "24F81A0548", "team": 8},
    {"name": "B.KISHORE NAIK", "roll": "24F81A0557", "team": 8},
    {"name": "E. ANUSHA", "roll": "24F81A0508", "team": 8},
    {"name": "U. JANAKI", "roll": "24F81A0550", "team": 8},
]


def seed(db_session: Session = None):
    """Seed database with complete GKCE institutional dataset."""
    import app.models  # Ensure all models are registered with Base metadata
    Base.metadata.create_all(bind=engine)
    close_db = False
    if db_session is not None:
        db = db_session
    else:
        db = SessionLocal()
        close_db = True

    try:
        # Precompute bcrypt password hashes
        print("[1/5] Precomputing security hashes...")
        dean_pwd_hash = get_password_hash(DEAN_PASSWORD)
        mentor_pwd_hash = get_password_hash(MENTOR_PASSWORD)
        student_pwd_hash = get_password_hash(STUDENT_PASSWORD)

        # 1. Dean User
        print("[2/5] Creating Dean Administrator...")
        dean_user = User(
            name="Sudo Users",
            email="root@gkce.edu.in",
            password_hash=dean_pwd_hash,
            role=UserRole.DEAN,
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            is_active=True,
        )
        db.add(dean_user)
        db.flush()

        # 2. Teams and Mentors (8 Teams)
        print(f"[3/5] Creating {len(MENTORS_DATA)} Mentored Teams...")
        team_objs = []
        mentor_users = []
        mentor_profiles = []

        for i in range(len(MENTORS_DATA)):
            t_num_str = f"Team {i+1:02d}"
            t_name = TEAM_NAMES[i] if i < len(TEAM_NAMES) else f"Team {i+1:02d}"
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
                phone=f"+91 98480 {10000 + i + 1}",
                experience_years=m_exp,
                assigned_team_id=team.id,
            )
            db.add(m_profile)
            mentor_profiles.append(m_profile)

        db.flush()

        # 3. DSA Problems (34 Problems)
        print("[4/5] Seeding DSA Problems Bank (34 Challenges)...")
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

        # 4. Students at Clean 0% Baseline (No Fake Submissions)
        print(f"[5/5] Ingesting {len(REAL_GKCE_STUDENTS)} Authentic GKCE Students at clean 0% baseline (no fake progress)...")
        student_users = []
        student_profiles = []

        def make_clean_student_email(roll: str, name: str) -> str:
            if "JHANAKI" in name.upper() or "JANAKI" in name.upper():
                prefix = "janaki"
            else:
                clean = name.replace('.', ' ').strip()
                parts = clean.split()
                first_part = parts[0].lower()
                if len(first_part) <= 2 and len(parts) > 1:
                    prefix = parts[1].lower()
                else:
                    prefix = first_part
            return f"{prefix}{roll.lower()}@gkce.edu.in"

        for idx, s_info in enumerate(REAL_GKCE_STUDENTS, 1):
            team_id = s_info["team"]
            team_obj = team_objs[team_id - 1]
            roll_no = s_info["roll"]
            name = s_info["name"]

            email = make_clean_student_email(roll_no, name)

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

            s_profile = Student(
                user_id=s_user.id,
                roll_number=roll_no,
                team_id=team_obj.id,
                status=StudentStatus.ACTIVE,
                dsa_level=DSALevel.BEGINNER,
                leetcode_username=f"{name.lower().replace('.', '_').replace(' ', '_')[:12]}_{roll_no[-4:]}",
                github_username=f"{name.lower().replace('.', '').replace(' ', '')[:10]}_{roll_no[-4:]}",
            )
            db.add(s_profile)
            db.flush()
            student_profiles.append(s_profile)

            sp = StudentProgress(
                student_id=s_profile.id,
                problems_solved=0,
                problems_attempted=0,
                overall_percentage=0.0,
                current_streak=0,
                longest_streak=0,
                easy_solved=0,
                medium_solved=0,
                hard_solved=0,
            )
            db.add(sp)

            # Add initial mentor enrollment note
            mentor_profile = mentor_profiles[team_id - 1]
            db.add(
                MentorNote(
                    student_id=s_profile.id,
                    mentor_id=mentor_profile.id,
                    note="Student enrolled in institutional DSA training cohort. Ready to begin curriculum problems.",
                    created_at=datetime.now(timezone.utc) - timedelta(days=2),
                )
            )

        db.commit()

        print("\n==========================================================")
        print("   ✅ SEEDING COMPLETE WITH ACCURATE DATA (NO FAKE PROGRESS)!")
        print("==========================================================")
        print(f"Total Users:      {db.query(User).count()} (1 Dean, {len(MENTORS_DATA)} Mentors, {len(REAL_GKCE_STUDENTS)} Students)")
        print(f"Teams:            {db.query(Team).count()} Teams")
        print(f"DSA Problems:     {db.query(DSAProblem).count()} Problems")
        print(f"Submissions:      {db.query(Submission).count()} Submissions (Clean baseline)")
        print(f"Dean:             root@gkce.edu.in | {DEAN_PASSWORD}")
        print(f"A. Ludwika:       ludwikha@gkce.edu.in | {MENTOR_PASSWORD}")
        print(f"CH. Chakri:       chakri24f81a0522@gkce.edu.in | {STUDENT_PASSWORD}")
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
