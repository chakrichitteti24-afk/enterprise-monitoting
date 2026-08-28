import sys
import os
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, timezone, timedelta
import bcrypt

# Ensure UTF-8 console output
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

DATABASE_URL = os.environ.get("DATABASE_URL") or "postgresql://neondb_owner:npg_xPGygHtMbX26@ep-proud-rain-a5pb0iy6-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

DEAN_PASSWORD = "gkce@1234"
MENTOR_PASSWORD = "Mentor@GKCE2026"
STUDENT_PASSWORD = "gkce@1234"

def get_hash(pwd: str) -> str:
    salt = bcrypt.gensalt(rounds=10)
    return bcrypt.hashpw(pwd.encode("utf-8"), salt).decode("utf-8")

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

DDL_STATEMENTS = """
-- 1. Create Enums if not exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
        CREATE TYPE user_role_enum AS ENUM ('STUDENT', 'MENTOR', 'DEAN');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'student_status_enum') THEN
        CREATE TYPE student_status_enum AS ENUM ('ACTIVE', 'AT_RISK', 'INACTIVE', 'PROBATION');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dsa_level_enum') THEN
        CREATE TYPE dsa_level_enum AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'MASTERY');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'problem_difficulty_enum') THEN
        CREATE TYPE problem_difficulty_enum AS ENUM ('EASY', 'MEDIUM', 'HARD');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'dsa_topic_enum') THEN
        CREATE TYPE dsa_topic_enum AS ENUM ('ARRAYS', 'STRINGS', 'LINKED_LISTS', 'STACK', 'QUEUE', 'TREES', 'GRAPHS', 'DYNAMIC_PROGRAMMING');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'submission_status_enum') THEN
        CREATE TYPE submission_status_enum AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR');
    END IF;
END $$;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'STUDENT',
    avatar_url VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Teams Table
CREATE TABLE IF NOT EXISTS teams (
    id SERIAL PRIMARY KEY,
    team_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Mentors Table
CREATE TABLE IF NOT EXISTS mentors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_team_id INTEGER UNIQUE NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    department VARCHAR(100) NOT NULL DEFAULT 'Computer Science & Engg',
    phone VARCHAR(20),
    experience_years INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    dsa_level dsa_level_enum NOT NULL DEFAULT 'BEGINNER',
    status student_status_enum NOT NULL DEFAULT 'ACTIVE',
    github_username VARCHAR(100),
    leetcode_username VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Student Progress Table
CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    problems_solved INTEGER NOT NULL DEFAULT 0,
    problems_attempted INTEGER NOT NULL DEFAULT 0,
    overall_percentage DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    easy_solved INTEGER NOT NULL DEFAULT 0,
    medium_solved INTEGER NOT NULL DEFAULT 0,
    hard_solved INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DSA Problems Bank Table
CREATE TABLE IF NOT EXISTS dsa_problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty problem_difficulty_enum NOT NULL DEFAULT 'EASY',
    topic dsa_topic_enum NOT NULL DEFAULT 'ARRAYS',
    leetcode_url VARCHAR(500),
    acceptance_rate VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL REFERENCES dsa_problems(id) ON DELETE CASCADE,
    status submission_status_enum NOT NULL DEFAULT 'ACCEPTED',
    language VARCHAR(50) NOT NULL DEFAULT 'Java',
    code_snippet TEXT,
    runtime_ms INTEGER,
    memory_mb DOUBLE PRECISION,
    score INTEGER NOT NULL DEFAULT 100,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    detail TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Mentor Notes Table
CREATE TABLE IF NOT EXISTS mentor_notes (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    mentor_id INTEGER NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Weekly Exams Table
CREATE TABLE IF NOT EXISTS weekly_exams (
    id VARCHAR(50) PRIMARY KEY,
    week_number INTEGER NOT NULL DEFAULT 1,
    tier VARCHAR(20) DEFAULT 'EASY',
    tier_badge VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    topic_focus VARCHAR(255) NOT NULL DEFAULT 'DSA Core Curriculum',
    scheduled_date VARCHAR(20) NOT NULL,
    start_time VARCHAR(20) NOT NULL DEFAULT '10:00 AM',
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    total_marks INTEGER NOT NULL DEFAULT 100,
    pass_marks INTEGER NOT NULL DEFAULT 50,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    created_by VARCHAR(100) NOT NULL DEFAULT 'Root (Dean of Academic Affairs / Sudo Admin)',
    questions JSON NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Student Exam Submissions Table
CREATE TABLE IF NOT EXISTS student_exam_submissions (
    id VARCHAR(100) PRIMARY KEY,
    exam_id VARCHAR(50) NOT NULL REFERENCES weekly_exams(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    student_roll_no VARCHAR(50) NOT NULL,
    team_number VARCHAR(50) NOT NULL DEFAULT 'Team 01',
    randomized_set_code VARCHAR(50),
    status VARCHAR(30) NOT NULL DEFAULT 'EVALUATED',
    score INTEGER NOT NULL DEFAULT 0,
    total_marks INTEGER NOT NULL DEFAULT 100,
    questions_solved INTEGER NOT NULL DEFAULT 0,
    passed_count INTEGER NOT NULL DEFAULT 0,
    total_question_count INTEGER NOT NULL DEFAULT 0,
    time_spent_minutes INTEGER NOT NULL DEFAULT 0,
    answers JSON NOT NULL DEFAULT '{}',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Student Verified Problems (Mentor / Dean Daily Problem Verification)
CREATE TABLE IF NOT EXISTS student_verified_problems (
    id SERIAL PRIMARY KEY,
    student_identifier VARCHAR(50) NOT NULL,
    problem_id VARCHAR(50) NOT NULL,
    day_number INTEGER,
    verified_by VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_svp_student ON student_verified_problems(student_identifier);
CREATE INDEX IF NOT EXISTS idx_svp_problem ON student_verified_problems(problem_id);
"""

def main():
    print(f"Connecting to Neon PostgreSQL...", flush=True)
    conn = psycopg2.connect(DATABASE_URL)
    conn.autocommit = True
    cur = conn.cursor()

    print("1. Creating schema, enums, and tables...", flush=True)
    cur.execute(DDL_STATEMENTS)
    print("Tables and Schema successfully initialized on Neon!", flush=True)

    # Check if users exist
    cur.execute("SELECT COUNT(*) FROM users;")
    user_count = cur.fetchone()[0]
    print(f"Existing Users in Neon: {user_count}", flush=True)

    if user_count == 0:
        print("2. Seeding Dean Root user...", flush=True)
        dean_hash = get_hash(DEAN_PASSWORD)
        mentor_hash = get_hash(MENTOR_PASSWORD)
        student_hash = get_hash(STUDENT_PASSWORD)

        cur.execute(
            """
            INSERT INTO users (name, email, password_hash, role, avatar_url)
            VALUES (%s, %s, %s, %s, %s) RETURNING id;
            """,
            ("Sudo Users", "root@gkce.edu.in", dean_hash, "DEAN", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
        )
        dean_id = cur.fetchone()[0]

        print("3. Seeding 8 Teams and 8 Mentors...", flush=True)
        team_ids = []
        mentor_ids = []
        for i, (m_name, m_email, m_dept, m_exp) in enumerate(MENTORS_DATA, 1):
            team_num = f"Team {i:02d}"
            team_name = TEAM_NAMES[i-1] if i-1 < len(TEAM_NAMES) else f"Cohort {i:02d}"
            
            cur.execute(
                "INSERT INTO teams (team_number, name) VALUES (%s, %s) RETURNING id;",
                (team_num, team_name)
            )
            t_id = cur.fetchone()[0]
            team_ids.append(t_id)

            cur.execute(
                """
                INSERT INTO users (name, email, password_hash, role, avatar_url)
                VALUES (%s, %s, %s, %s, %s) RETURNING id;
                """,
                (m_name, m_email, mentor_hash, "MENTOR", f"https://images.unsplash.com/photo-{1507003211186 + i * 17}?w=150&auto=format&fit=crop&q=80")
            )
            m_user_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO mentors (user_id, assigned_team_id, department, phone, experience_years)
                VALUES (%s, %s, %s, %s, %s) RETURNING id;
                """,
                (m_user_id, t_id, m_dept, f"+91 98480 {10000 + i}", m_exp)
            )
            mentor_ids.append(cur.fetchone()[0])

        print("4. Seeding 39 Authentic Students across 8 Teams...", flush=True)
        for s in REAL_GKCE_STUDENTS:
            name = s["name"]
            roll = s["roll"]
            team_idx = s["team"] - 1
            t_id = team_ids[team_idx]

            # Generate clean email
            clean_name = name.split(".")[0].lower().replace(" ", "")
            email = f"{clean_name}{roll.lower()}@gkce.edu.in"
            if roll == "24F81A0522":
                email = "chakri24f81a0522@gkce.edu.in"

            cur.execute(
                """
                INSERT INTO users (name, email, password_hash, role, avatar_url)
                VALUES (%s, %s, %s, %s, %s) RETURNING id;
                """,
                (name, email, student_hash, "STUDENT", "https://images.unsplash.com/photo-1535713875002?w=150&auto=format&fit=crop&q=80")
            )
            s_user_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO students (user_id, roll_number, team_id, dsa_level, status)
                VALUES (%s, %s, %s, %s, %s) RETURNING id;
                """,
                (s_user_id, roll, t_id, "BEGINNER", "ACTIVE")
            )
            s_id = cur.fetchone()[0]

            cur.execute(
                """
                INSERT INTO student_progress (student_id, problems_solved, problems_attempted, overall_percentage, current_streak, longest_streak)
                VALUES (%s, 0, 0, 0.0, 0, 0);
                """,
                (s_id,)
            )

        print("\n========================================================")
        print("   ✅ NEON POSTGRESQL INITIALIZATION & SEEDING COMPLETE! ")
        print("========================================================")
        print(f"Dean:        root@gkce.edu.in | {DEAN_PASSWORD}")
        print(f"Mentors:     ludwikha@gkce.edu.in | {MENTOR_PASSWORD}")
        print(f"Students:    chakri24f81a0522@gkce.edu.in | {STUDENT_PASSWORD}")
        print("========================================================")

    cur.close()
    conn.close()

if __name__ == "__main__":
    main()
