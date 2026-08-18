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

# Demo credentials for development/demo only
DEAN_PASSWORD = "Dean@GKCE2026"
MENTOR_PASSWORD = "Mentor@GKCE2026"
STUDENT_PASSWORD = "Student@GKCE2026"

INDIAN_STUDENT_NAMES = [
    "Aarav Sharma", "Aditi Patel", "Akash Verma", "Ananya Mukherjee", "Chirag Reddy",
    "Deepika Iyer", "Harish Kumar", "Isha Nair", "Kavya Joshi", "Manish Gupta",
    "Neha Chawla", "Pranav Deshmukh", "Rahul Nambiar", "Riya Sen", "Rohan Pillai",
    "Siddharth Roy", "Sneha Kulkarni", "Tanvi Bhat", "Varun Chopra", "Vikram Rathore",
    "Aditya Rao", "Aniket Das", "Ankita Roy", "Ashwin Murthy", "Bhavya Singh",
    "Darshan Hegde", "Divya Menon", "Gautam Bose", "Geeta Pandey", "Himanshu Saxena",
    "Ishaan Kapoor", "Janani Iyer", "Kartik Venkat", "Kirthi Raj", "Lakshmi Priya",
    "Madhav Rao", "Maya Srinivasan", "Naveen Reddy", "Nidhi Agarwal", "Nikhil Kamath",
    "Pallavi Soni", "Pooja Hegde", "Priyanka Shenoy", "Raghav Somani", "Rajeshwari M",
    "Ramesh Babu", "Ritu Phogat", "Sanjay Jha", "Sanya Mirza", "Sarath Chandran",
    "Shashank Jain", "Shreya Ghoshal", "Simran Kaur", "Smriti Mandhana", "Sohan Lal",
    "Sourav Ganguly", "Srikant Tiwari", "Subhashree Ray", "Sudhir Kumar", "Sumit Nagal",
    "Suraj Sharma", "Suresh Raina", "Swetha Mohan", "Tanmay Bhat", "Tarun Tahiliani",
    "Trisha Krishnan", "Uday Kotak", "Uma Devi", "Utkarsh Ambudkar", "Vaibhav Taneja",
    "Vaishali Rameshbabu", "Vandana Shiva", "Venkatesh Prasad", "Vikas Khanna", "Vinay Pathak",
    "Vineet Kumar", "Vinod Rai", "Virender Sehwag", "Vishal Dadlani", "Vivek Agnihotri",
    "Yashasvi Jaiswal", "Yuvraj Singh", "Zoya Akhtar", "Abhinav Bindra", "Alia Bhatt",
    "Amartya Sen", "Amitabh Bachchan", "Anupam Kher", "Aravind Adiga", "Arjun Rampal",
    "Ashish Nehra", "Ayushmann Khurrana", "Bappi Lahiri", "Chetan Bhagat", "Dhanush K",
    "Diljit Dosanjh", "Farhan Akhtar", "Hima Das", "Irfaan Khan", "Jasprit Bumrah"
]

MENTOR_DATA = [
    ("Dr. M. Srinivasa Rao", "CSE (Algorithms)", 14),
    ("Prof. Sunita Deshmukh", "CSE (Data Structures)", 12),
    ("Dr. Ananya Ray", "CSE (Machine Learning)", 10),
    ("Prof. K. Venkatesh", "CSE (Systems & Cloud)", 15),
    ("Dr. P. Rajesh Kumar", "CSE (Competitive Programming)", 11),
    ("Prof. B. Deepa", "CSE (Database & Architecture)", 9),
    ("Dr. S. Mohan Das", "CSE (Algorithms)", 16),
    ("Prof. Kavita Reddy", "CSE (Full Stack & Systems)", 8),
    ("Dr. C. Balasubramanian", "CSE (Software Engineering)", 13),
    ("Prof. Meera Nair", "CSE (Theoretical CS)", 10),
    ("Dr. G. Hariprasad", "CSE (Networks & Security)", 12),
    ("Prof. Swati Joshi", "CSE (Operating Systems)", 7),
    ("Dr. N. Murthy", "CSE (Distributed Systems)", 18),
    ("Prof. Sandhya Rani", "CSE (Web & Mobile)", 9),
    ("Dr. D. Chandrasekhar", "CSE (Graph Theory)", 14),
    ("Prof. Anita Sharma", "CSE (Object Oriented Tech)", 11),
    ("Dr. J. Raghavan", "CSE (Computer Architecture)", 15),
    ("Prof. Pratibha Patil", "CSE (Data Mining)", 8),
    ("Dr. E. Sudhakar", "CSE (Information Security)", 13),
    ("Prof. Rekha Varma", "CSE (Artificial Intelligence)", 10),
]

TEAM_NAMES = [
    "Algorithm Aces", "Binary Bandits", "Dynamic Dynamos", "Graph Gurus", "Stack Smashers",
    "Queue Queens", "Tree Titans", "Recursion Rangers", "Bitwise Battlers", "Heap Heroes",
    "Matrix Masters", "Hash Hackers", "Pointer Prodigies", "Greedy Giants", "Backtrack Busters",
    "Trie Troopers", "Search Specialists", "Sorting Stars", "Divide Conquerors", "Logic Lords"
]

DSA_PROBLEMS_SEED = [
    # Arrays
    ("Two Sum", "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/two-sum", "54.2%"),
    ("Best Time to Buy and Sell Stock", "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize profit by choosing a single day to buy and a different day in the future to sell.", ProblemDifficulty.EASY, DSATopic.ARRAYS, "https://leetcode.com/problems/best-time-to-buy-and-sell-stock", "53.8%"),
    ("3Sum", "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/3sum", "34.1%"),
    ("Container With Most Water", "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.", ProblemDifficulty.MEDIUM, DSATopic.ARRAYS, "https://leetcode.com/problems/container-with-most-water", "55.0%"),
    ("Trapping Rain Water", "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.", ProblemDifficulty.HARD, DSATopic.ARRAYS, "https://leetcode.com/problems/trapping-rain-water", "60.4%"),
    # Strings
    ("Valid Palindrome", "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.", ProblemDifficulty.EASY, DSATopic.STRINGS, "https://leetcode.com/problems/valid-palindrome", "46.7%"),
    ("Longest Substring Without Repeating Characters", "Given a string s, find the length of the longest substring without repeating characters.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/longest-substring-without-repeating-characters", "34.8%"),
    ("Group Anagrams", "Given an array of strings strs, group the anagrams together. You can return the answer in any order.", ProblemDifficulty.MEDIUM, DSATopic.STRINGS, "https://leetcode.com/problems/group-anagrams", "68.2%"),
    ("Minimum Window Substring", "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t is included in the window.", ProblemDifficulty.HARD, DSATopic.STRINGS, "https://leetcode.com/problems/minimum-window-substring", "42.5%"),
    # Linked Lists
    ("Reverse Linked List", "Given the head of a singly linked list, reverse the list, and return the reversed list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/reverse-linked-list", "75.8%"),
    ("Merge Two Sorted Lists", "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/merge-two-sorted-lists", "63.9%"),
    ("Linked List Cycle", "Given head, the head of a linked list, determine if the linked list has a cycle in it.", ProblemDifficulty.EASY, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/linked-list-cycle", "49.6%"),
    ("LRU Cache", "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", ProblemDifficulty.MEDIUM, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/lru-cache", "42.0%"),
    ("Merge k Sorted Lists", "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.", ProblemDifficulty.HARD, DSATopic.LINKED_LISTS, "https://leetcode.com/problems/merge-k-sorted-lists", "51.8%"),
    # Stack
    ("Valid Parentheses", "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.", ProblemDifficulty.EASY, DSATopic.STACK, "https://leetcode.com/problems/valid-parentheses", "40.8%"),
    ("Min Stack", "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/min-stack", "53.6%"),
    ("Daily Temperatures", "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.", ProblemDifficulty.MEDIUM, DSATopic.STACK, "https://leetcode.com/problems/daily-temperatures", "66.3%"),
    ("Largest Rectangle in Histogram", "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.", ProblemDifficulty.HARD, DSATopic.STACK, "https://leetcode.com/problems/largest-rectangle-in-histogram", "44.2%"),
    # Queue
    ("Implement Queue using Stacks", "Implement a first in first out (FIFO) queue using only two stacks.", ProblemDifficulty.EASY, DSATopic.QUEUE, "https://leetcode.com/problems/implement-queue-using-stacks", "65.1%"),
    ("Sliding Window Maximum", "You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. Return the max sliding window.", ProblemDifficulty.HARD, DSATopic.QUEUE, "https://leetcode.com/problems/sliding-window-maximum", "46.8%"),
    # Trees
    ("Maximum Depth of Binary Tree", "Given the root of a binary tree, return its maximum depth.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/maximum-depth-of-binary-tree", "75.1%"),
    ("Invert Binary Tree", "Given the root of a binary tree, invert the tree, and return its root.", ProblemDifficulty.EASY, DSATopic.TREES, "https://leetcode.com/problems/invert-binary-tree", "77.0%"),
    ("Validate Binary Search Tree", "Given the root of a binary tree, determine if it is a valid binary search tree (BST).", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/validate-binary-search-tree", "32.8%"),
    ("Binary Tree Level Order Traversal", "Given the root of a binary tree, return the level order traversal of its nodes' values.", ProblemDifficulty.MEDIUM, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-level-order-traversal", "66.5%"),
    ("Binary Tree Maximum Path Sum", "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. Return the maximum path sum of any non-empty path.", ProblemDifficulty.HARD, DSATopic.TREES, "https://leetcode.com/problems/binary-tree-maximum-path-sum", "39.9%"),
    # Graphs
    ("Number of Islands", "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/number-of-islands", "58.7%"),
    ("Clone Graph", "Given a reference of a node in a connected undirected graph. Return a deep copy (clone) of the graph.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/clone-graph", "56.4%"),
    ("Course Schedule", "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites. Return true if you can finish all courses.", ProblemDifficulty.MEDIUM, DSATopic.GRAPHS, "https://leetcode.com/problems/course-schedule", "47.2%"),
    ("Alien Dictionary", "There is a new alien language that uses the English alphabet. Given a list of words from the alien language's dictionary, sorted lexicographically by the rules of this new language, derive the order of letters.", ProblemDifficulty.HARD, DSATopic.GRAPHS, "https://leetcode.com/problems/alien-dictionary", "35.6%"),
    # Dynamic Programming
    ("Climbing Stairs", "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?", ProblemDifficulty.EASY, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/climbing-stairs", "53.2%"),
    ("Coin Change", "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/coin-change", "44.0%"),
    ("Longest Increasing Subsequence", "Given an integer array nums, return the length of the longest strictly increasing subsequence.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/longest-increasing-subsequence", "55.1%"),
    ("Word Break", "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/word-break", "46.5%"),
    ("Edit Distance", "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.", ProblemDifficulty.MEDIUM, DSATopic.DYNAMIC_PROGRAMMING, "https://leetcode.com/problems/edit-distance", "56.3%"),
]


def seed_database():
    print("[INFO] Initializing GKCE DSA Database Seeder...")
    engine.dispose()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("[SUCCESS] Clean database tables created.")

    db: Session = SessionLocal()

    try:
        # 1. Seed DSA Problems
        created_problems = []
        for title, desc, diff, topic, url, acc in DSA_PROBLEMS_SEED:
            prob = DSAProblem(
                title=title,
                description=desc,
                difficulty=diff,
                topic=topic,
                platform_url=url,
                acceptance_rate=acc,
                total_test_cases=10,
                created_at=datetime.now(timezone.utc) - timedelta(days=60),
            )
            created_problems.append(prob)
        db.add_all(created_problems)
        db.commit()
        for p in created_problems:
            db.refresh(p)
        problem_ids = [p.id for p in created_problems]
        print(f"[SUCCESS] Seeded {len(created_problems)} Curriculum DSA Problems across 8 Topics.")

        # 2. Seed 1 Dean
        dean_user = User(
            name="Dr. R. V. Raman",
            email="dean.academics@gkce.edu.in",
            password_hash=get_password_hash(DEAN_PASSWORD),
            role=UserRole.DEAN,
            is_active=True,
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        )
        db.add(dean_user)
        db.commit()
        print(f"[SUCCESS] Seeded Dean: {dean_user.name} ({dean_user.email})")

        # 3. Seed 20 Teams
        teams = []
        for i in range(20):
            team_num = f"Team {i + 1:02d}"
            team_name = TEAM_NAMES[i]
            team = Team(
                team_number=team_num,
                name=team_name,
                created_at=datetime.now(timezone.utc) - timedelta(days=90),
            )
            teams.append(team)
        db.add_all(teams)
        db.commit()
        for t in teams:
            db.refresh(t)

        # 4. Seed 20 Mentors (1 per team)
        mentor_users = []
        mentor_pwd_hash = get_password_hash(MENTOR_PASSWORD)
        for i in range(20):
            mentor_info = MENTOR_DATA[i]
            mentor_email = f"mentor.{i + 1:02d}@gkce.edu.in"
            mentor_user = User(
                name=mentor_info[0],
                email=mentor_email,
                password_hash=mentor_pwd_hash,
                role=UserRole.MENTOR,
                is_active=True,
                avatar_url=f"https://images.unsplash.com/photo-{1500000000000 + i * 100000}?w=150&auto=format&fit=crop&q=80",
            )
            mentor_users.append(mentor_user)
        db.add_all(mentor_users)
        db.commit()
        for mu in mentor_users:
            db.refresh(mu)

        mentors = []
        for i in range(20):
            mentor_info = MENTOR_DATA[i]
            mentor = Mentor(
                user_id=mentor_users[i].id,
                assigned_team_id=teams[i].id,
                department=mentor_info[1],
                phone=f"+91 98480 {10000 + i * 111}",
                experience_years=mentor_info[2],
            )
            mentors.append(mentor)
        db.add_all(mentors)
        db.commit()
        for m in mentors:
            db.refresh(m)

        for i in range(20):
            teams[i].mentor_id = mentors[i].id
        db.commit()
        print(f"[SUCCESS] Seeded exactly 20 Teams and 20 Mentors (1:1 Relationship).")

        # 5. Seed 100 Students Users
        student_users = []
        student_pwd_hash = get_password_hash(STUDENT_PASSWORD)
        for i in range(100):
            student_idx = i + 1
            student_name = INDIAN_STUDENT_NAMES[i]
            student_email = f"student.{student_idx:03d}@gkce.edu.in"
            st_user = User(
                name=student_name,
                email=student_email,
                password_hash=student_pwd_hash,
                role=UserRole.STUDENT,
                is_active=(student_idx not in [50, 99]),
                avatar_url=f"https://images.unsplash.com/photo-{1530000000000 + student_idx * 10000}?w=150&auto=format&fit=crop&q=80",
            )
            student_users.append(st_user)
        db.add_all(student_users)
        db.commit()
        for su in student_users:
            db.refresh(su)

        # 6. Seed 100 Students
        students = []
        progress_list = []
        submissions_list = []
        activity_list = []
        notes_list = []

        for i in range(100):
            student_idx = i + 1
            roll_no = f"22CSE{student_idx:03d}"
            student_name = INDIAN_STUDENT_NAMES[i]
            team_idx = i // 5
            current_team_id = teams[team_idx].id
            current_mentor_id = mentors[team_idx].id

            # Status distribution
            if student_idx in [14, 28, 45, 62, 79, 93]:
                st_status = StudentStatus.NEEDS_ATTENTION
                st_level = DSALevel.BEGINNER
                progress_pct = round(random.uniform(42.0, 58.0), 1)
                streak_days = random.randint(0, 2)
            elif student_idx in [50, 99]:
                st_status = StudentStatus.INACTIVE
                st_level = DSALevel.BEGINNER
                progress_pct = round(random.uniform(20.0, 35.0), 1)
                streak_days = 0
            else:
                st_status = StudentStatus.ACTIVE
                st_level = random.choice([DSALevel.INTERMEDIATE, DSALevel.ADVANCED, DSALevel.MASTERY])
                progress_pct = round(random.uniform(68.0, 96.0), 1)
                streak_days = random.randint(4, 24)

            student = Student(
                user_id=student_users[i].id,
                roll_number=roll_no,
                team_id=current_team_id,
                dsa_level=st_level,
                status=st_status,
                github_username=student_name.lower().replace(" ", ""),
                leetcode_username=f"gkce_{student_name.lower().replace(' ', '_')}",
            )
            students.append(student)

        db.add_all(students)
        db.commit()
        for st in students:
            db.refresh(st)

        # 7. Seed Progress, Submissions, Activity Logs, and Notes
        for i in range(100):
            student = students[i]
            student_idx = i + 1
            team_idx = i // 5
            current_mentor_id = mentors[team_idx].id

            if student.status == StudentStatus.NEEDS_ATTENTION:
                progress_pct = round(random.uniform(42.0, 58.0), 1)
                streak_days = random.randint(0, 2)
            elif student.status == StudentStatus.INACTIVE:
                progress_pct = round(random.uniform(20.0, 35.0), 1)
                streak_days = 0
            else:
                progress_pct = round(random.uniform(68.0, 96.0), 1)
                streak_days = random.randint(4, 24)

            solved_problems_count = int((progress_pct / 100.0) * 140)
            attempted_problems_count = solved_problems_count + random.randint(2, 8)

            easy_cnt = min(50, round(solved_problems_count * 0.55))
            med_cnt = min(65, round(solved_problems_count * 0.35))
            hard_cnt = max(0, solved_problems_count - easy_cnt - med_cnt)

            prog = StudentProgress(
                student_id=student.id,
                problems_solved=solved_problems_count,
                problems_attempted=attempted_problems_count,
                overall_percentage=progress_pct,
                current_streak=streak_days,
                longest_streak=max(streak_days, random.randint(streak_days, 28)),
                easy_solved=easy_cnt,
                medium_solved=med_cnt,
                hard_solved=hard_cnt,
                updated_at=datetime.now(timezone.utc),
            )
            progress_list.append(prog)

            # Sample submissions
            solved_sample = random.sample(problem_ids, min(len(problem_ids), random.randint(6, 15)))
            for prob_id in solved_sample:
                sub = Submission(
                    student_id=student.id,
                    problem_id=prob_id,
                    status=SubmissionStatus.SOLVED,
                    score=100.0,
                    runtime_ms=random.randint(35, 75),
                    memory_mb=round(random.uniform(41.0, 44.5), 1),
                    code_snippet="class Solution {\n    public int[] solve() {\n        return new int[]{0, 1};\n    }\n}",
                    language="Java",
                    submitted_at=datetime.now(timezone.utc) - timedelta(days=random.randint(0, 14)),
                )
                submissions_list.append(sub)

            # Activity Log
            recent_pid = random.choice(problem_ids)
            act = ActivityLog(
                student_id=student.id,
                problem_id=recent_pid,
                activity_type="SOLVED",
                description=f"Solved practice problem #{recent_pid} with optimal O(N) complexity",
                created_at=datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 48)),
            )
            activity_list.append(act)

            # Mentor Note
            if student.status == StudentStatus.NEEDS_ATTENTION:
                note = MentorNote(
                    student_id=student.id,
                    mentor_id=current_mentor_id,
                    note="Assigned personalized Dynamic Programming and Recursion remedial problem set. Recommended 1-on-1 office hour review.",
                    created_at=datetime.now(timezone.utc) - timedelta(days=2),
                )
                notes_list.append(note)

        db.add_all(progress_list)
        db.add_all(submissions_list)
        db.add_all(activity_list)
        db.add_all(notes_list)
        db.commit()

        print("[SUCCESS] Seeded 1 Dean, 20 Teams, 20 Mentors, 100 Students (5 per team) & Submissions.")

        print("\n" + "=" * 70)
        print("[COMPLETE] GKCE DSA PLATFORM SEEDING COMPLETED SUCCESSFULLY!")
        print("=" * 70)
        print("DEMO CREDENTIALS (DEVELOPMENT ONLY):")
        print(f"  * Dean:    dean.academics@gkce.edu.in / {DEAN_PASSWORD}")
        print(f"  * Mentor:  mentor.07@gkce.edu.in      / {MENTOR_PASSWORD} (Team 07)")
        print(f"  * Student: student.031@gkce.edu.in    / {STUDENT_PASSWORD} (Roll: 22CSE031)")
        print("=" * 70 + "\n")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding database: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
