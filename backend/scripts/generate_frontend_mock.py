import os
import json
import random

RAW_STUDENTS = [
    # Group 1 (Team 01)
    {"name": "BODDU ANANTHALAKSHMI", "roll": "23F81A0502", "team": 1, "class": "III B.Tech CSE"},
    {"name": "PITTI DEVIKA (MQ)", "roll": "23F81A0507", "team": 1, "class": "III B.Tech CSE"},
    {"name": "GALLA KAVITHA", "roll": "23F81A0513", "team": 1, "class": "III B.Tech CSE"},
    {"name": "BATTA JASWITHA", "roll": "23F81A0511", "team": 1, "class": "III B.Tech CSE"},
    {"name": "JEELAGA THANUSHA", "roll": "23F81A0538", "team": 1, "class": "III B.Tech CSE"},

    # Group 2 (Team 02)
    {"name": "SHAIK HABEEBA", "roll": "23F81A0510", "team": 2, "class": "III B.Tech CSE"},
    {"name": "GADDAM BHARGAVI", "roll": "23F81A0504", "team": 2, "class": "III B.Tech CSE"},
    {"name": "GADDAM PALLAVI", "roll": "23F81A0525", "team": 2, "class": "III B.Tech CSE"},
    {"name": "KATURU SRAVANTHI", "roll": "23F81A0534", "team": 2, "class": "III B.Tech CSE"},

    # Group 3 (Team 03)
    {"name": "MODI KAVYA", "roll": "23F81A0514", "team": 3, "class": "III B.Tech CSE"},
    {"name": "VUKKADALA MANASA", "roll": "24F85A0508", "team": 3, "class": "III B.Tech CSE"},
    {"name": "KUTLURU DIVYA SRI", "roll": "23F81A0509", "team": 3, "class": "III B.Tech CSE"},
    {"name": "KONERU VYSHNAVI", "roll": "23F81A0542", "team": 3, "class": "III B.Tech CSE"},

    # Group 4 (Team 04)
    {"name": "KARUMANCHI MUNI KUMAR", "roll": "23F81A0520", "team": 4, "class": "III B.Tech CSE"},
    {"name": "NELLORE MUNI SAI SUDHARSAN", "roll": "23F81A0521", "team": 4, "class": "III B.Tech CSE"},
    {"name": "PALETI SAI", "roll": "23F81A0529", "team": 4, "class": "III B.Tech CSE"},
    {"name": "VAVILA SRIHARI", "roll": "23F81A0535", "team": 4, "class": "III B.Tech CSE"},
    {"name": "PAGADALA PUNEETH", "roll": "23F81A0527", "team": 4, "class": "III B.Tech CSE"},

    # Group 5 (Team 05)
    {"name": "PILLI BHANU TEJA", "roll": "23F81A0545", "team": 5, "class": "III B.Tech CSE"},
    {"name": "BHASKAR JAYASREE", "roll": "23F81A0562", "team": 5, "class": "III B.Tech CSE"},
    {"name": "CHALLA SAILAJA", "roll": "23F81A0572", "team": 5, "class": "III B.Tech CSE"},
    {"name": "BONUBOYINA SRAVANI", "roll": "23F81A0578", "team": 5, "class": "III B.Tech CSE"},
    {"name": "SREERAM VINEELA KEERTHI", "roll": "24F85A0517", "team": 5, "class": "III B.Tech CSE"},

    # Group 6 (Team 06)
    {"name": "VETTI SONI", "roll": "23F81A0577", "team": 6, "class": "III B.Tech CSE"},
    {"name": "KALLURU VAISHNAVI", "roll": "23F81A0581", "team": 6, "class": "III B.Tech CSE"},
    {"name": "CHINTHAGINJALA SILPA", "roll": "23F81A0576", "team": 6, "class": "III B.Tech CSE"},

    # Group 7 (Team 07) - Mentor: Mrs. Ludwikha
    {"name": "CH. CHAKRI", "roll": "24F81A0522", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},
    {"name": "P. GAYANI", "roll": "24F81A0534", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},
    {"name": "P. AKHILA", "roll": "24F81A0504", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},
    {"name": "C. JAHNAVI", "roll": "24F81A0549", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},
    {"name": "S. HARSHITHA", "roll": "24F81A0544", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},
    {"name": "S. SUDHA", "roll": "24F81A05B2", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludwikha"},

    # Group 8 (Team 08) - Mentor: Mr. Vishnu
    {"name": "S. KARTHIK", "roll": "24F81A0553", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},
    {"name": "K. CHANDRA SEKHAR", "roll": "24F81A0530", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},
    {"name": "G. GOWTHAM", "roll": "24F81A0537", "team": 8, "class": "II B.Tech CSE", "mentor": "Mr. Vishnu"},

    # Group 9 (Team 09) - Mentor: Mrs. Manjusha
    {"name": "M. ESWAR", "roll": "24F81A0532", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "K. KEERTHANA", "roll": "24F81A0554", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "D. HIMA VARSHA", "roll": "24F81A0548", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "B. KISHORE NAIK", "roll": "24F81A0557", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "E. ANUSHA", "roll": "24F81A0508", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},
    {"name": "U. JHANAKI", "roll": "24F81A0550", "team": 9, "class": "III B.Tech CSE A", "mentor": "Mrs. Manjusha"},

    # Group 10 (Team 10) - Mentor: Mrs. Teja
    {"name": "M. VENKATESWARLU", "roll": "24F81A05C7", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "P. PRASANNA KUMAR", "roll": "24F81A0591", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "T. PRABAKAR", "roll": "24F81A0590", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "T. TEJA", "roll": "24F81A05C0", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
    {"name": "E. PRASHANTH", "roll": "24F81A0592", "team": 10, "class": "II B.Tech CSE", "mentor": "Mrs. Teja"},
]

MENTORS_LIST = [
    {"id": "mentor-1", "name": "Dr. K. Suresh Kumar", "email": "suresh.kumar@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10001", "teamId": "team-1", "teamNum": "Team 01", "exp": 12},
    {"id": "mentor-2", "name": "Mrs. P. Radhika", "email": "radhika.p@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10002", "teamId": "team-2", "teamNum": "Team 02", "exp": 8},
    {"id": "mentor-3", "name": "Mr. M. Ramesh", "email": "ramesh.m@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10003", "teamId": "team-3", "teamNum": "Team 03", "exp": 7},
    {"id": "mentor-4", "name": "Mrs. S. Lakshmi", "email": "lakshmi.s@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10004", "teamId": "team-4", "teamNum": "Team 04", "exp": 9},
    {"id": "mentor-5", "name": "Mr. N. Rajesh", "email": "rajesh.n@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10005", "teamId": "team-5", "teamNum": "Team 05", "exp": 6},
    {"id": "mentor-6", "name": "Mrs. G. Pavani", "email": "pavani.g@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10006", "teamId": "team-6", "teamNum": "Team 06", "exp": 5},
    {"id": "mentor-7", "name": "Mrs. Ludwikha", "email": "ludwikha@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10007", "teamId": "team-7", "teamNum": "Team 07", "exp": 8},
    {"id": "mentor-8", "name": "Mr. Vishnu", "email": "vishnu@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10008", "teamId": "team-8", "teamNum": "Team 08", "exp": 7},
    {"id": "mentor-9", "name": "Mrs. Manjusha", "email": "manjusha@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10009", "teamId": "team-9", "teamNum": "Team 09", "exp": 10},
    {"id": "mentor-10", "name": "Mrs. Teja", "email": "teja.faculty@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10010", "teamId": "team-10", "teamNum": "Team 10", "exp": 6},
    {"id": "mentor-11", "name": "Dr. M. Srinivasa Rao", "email": "mentor.11@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10011", "teamId": "team-11", "teamNum": "Team 11", "exp": 14},
    {"id": "mentor-12", "name": "Prof. Sunita Deshmukh", "email": "mentor.12@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10012", "teamId": "team-12", "teamNum": "Team 12", "exp": 12},
    {"id": "mentor-13", "name": "Dr. Ananya Ray", "email": "mentor.13@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10013", "teamId": "team-13", "teamNum": "Team 13", "exp": 10},
    {"id": "mentor-14", "name": "Prof. K. Venkatesh", "email": "mentor.14@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10014", "teamId": "team-14", "teamNum": "Team 14", "exp": 15},
    {"id": "mentor-15", "name": "Dr. P. Rajesh Kumar", "email": "mentor.15@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10015", "teamId": "team-15", "teamNum": "Team 15", "exp": 11},
    {"id": "mentor-16", "name": "Prof. B. Deepa", "email": "mentor.16@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10016", "teamId": "team-16", "teamNum": "Team 16", "exp": 9},
    {"id": "mentor-17", "name": "Dr. S. Mohan Das", "email": "mentor.17@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10017", "teamId": "team-17", "teamNum": "Team 17", "exp": 16},
    {"id": "mentor-18", "name": "Prof. Kavita Reddy", "email": "mentor.18@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10018", "teamId": "team-18", "teamNum": "Team 18", "exp": 8},
    {"id": "mentor-19", "name": "Dr. C. Balasubramanian", "email": "mentor.19@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10019", "teamId": "team-19", "teamNum": "Team 19", "exp": 13},
    {"id": "mentor-20", "name": "Prof. Meera Nair", "email": "mentor.20@gkce.edu.in", "dept": "Computer Science & Engg", "phone": "+91 98480 10020", "teamId": "team-20", "teamNum": "Team 20", "exp": 10},
]

TEAM_NAMES = [
    "Algorithm Aces", "Binary Bandits", "Dynamic Dynamos", "Graph Gurus", "Stack Smashers",
    "Queue Queens", "Tree Titans", "Recursion Rangers", "Bitwise Battlers", "Heap Heroes",
    "Matrix Masters", "Hash Hackers", "Pointer Prodigies", "Greedy Giants", "Backtrack Busters",
    "Trie Troopers", "Search Specialists", "Sorting Stars", "Divide Conquerors", "Logic Lords"
]

random.seed(42)

special_emails = {
    'CH. CHAKRI': 'chakri',
    'PITTI DEVIKA (MQ)': 'devika',
    'BODDU ANANTHALAKSHMI': 'ananthalakshmi',
    'GALLA KAVITHA': 'kavitha',
    'BATTA JASWITHA': 'jaswitha',
    'JEELAGA THANUSHA': 'thanusha',
    'SHAIK HABEEBA': 'habeeba',
    'GADDAM BHARGAVI': 'bhargavi',
    'GADDAM PALLAVI': 'pallavi',
    'KATURU SRAVANTHI': 'sravanthi',
    'MODI KAVYA': 'kavya',
    'VUKKADALA MANASA': 'manasa',
    'KUTLURU DIVYA SRI': 'divyasri',
    'KONERU VYSHNAVI': 'vyshnavi',
    'KARUMANCHI MUNI KUMAR': 'munikumar',
    'NELLORE MUNI SAI SUDHARSAN': 'sudharsan',
    'PALETI SAI': 'sai',
    'VAVILA SRIHARI': 'srihari',
    'PAGADALA PUNEETH': 'puneeth',
    'PILLI BHANU TEJA': 'bhanuteja',
    'BHASKAR JAYASREE': 'jayasree',
    'CHALLA SAILAJA': 'sailaja',
    'BONUBOYINA SRAVANI': 'sravani',
    'SREERAM VINEELA KEERTHI': 'vineelakeerthi',
    'VETTI SONI': 'soni',
    'KALLURU VAISHNAVI': 'vaishnavi',
    'CHINTHAGINJALA SILPA': 'silpa',
    'P. GAYANI': 'gayani',
    'P. AKHILA': 'akhila',
    'C. JAHNAVI': 'jahnavi',
    'S. HARSHITHA': 'harshitha',
    'S. SUDHA': 'sudha',
    'S. KARTHIK': 'karthik',
    'K. CHANDRA SEKHAR': 'chandrasekhar',
    'G. GOWTHAM': 'gowtham',
    'M. ESWAR': 'eswar',
    'K. KEERTHANA': 'keerthana',
    'D. HIMA VARSHA': 'himavarsha',
    'B. KISHORE NAIK': 'kishore',
    'E. ANUSHA': 'anusha',
    'U. JHANAKI': 'jhanaki',
    'M. VENKATESWARLU': 'venkateswarlu',
    'P. PRASANNA KUMAR': 'prasanna',
    'T. PRABAKAR': 'prabakar',
    'T. TEJA': 'teja',
    'E. PRASHANTH': 'prashanth'
}

def get_student_email(name: str, roll: str) -> str:
    import re
    clean = re.sub(r'\(.*?\)', '', name).strip()
    parts = clean.replace('.', ' ').split()
    sig_parts = [p for p in parts if len(p) > 2]
    if name in special_emails:
        prefix = special_emails[name]
    elif sig_parts:
        prefix = sig_parts[-1].lower() if len(sig_parts[0]) <= 2 else sig_parts[0].lower()
    else:
        prefix = parts[0].lower()
    return f"{prefix}{roll.lower()}@gkce.edu.in"

# Build students list
all_students = []
for idx, st_raw in enumerate(RAW_STUDENTS, 1):
    t_id = st_raw["team"]
    t_num = f"Team {t_id:02d}"
    mentor_obj = MENTORS_LIST[t_id - 1]
    name = st_raw["name"]
    roll = st_raw["roll"]
    
    email = get_student_email(name, roll)

    perf_factor = random.uniform(0.70, 0.95) if "CHAKRI" in name or idx % 3 == 0 else random.uniform(0.45, 0.85)
    solved = int(34 * perf_factor)
    attempted = min(34, solved + random.randint(1, 3))
    pending = max(0, 34 - attempted)
    progress = round((solved / 34) * 100)
    streak = random.randint(3, 14)
    longest_streak = streak + random.randint(2, 6)

    dsa_level = (
        'Mastery' if solved >= 28
        else 'Advanced' if solved >= 20
        else 'Intermediate' if solved >= 12
        else 'Beginner'
    )

    status = 'Active' if perf_factor >= 0.50 else 'Needs Attention'

    topic_prog = {
        'Arrays': {'solved': min(5, int(5 * perf_factor)), 'total': 5, 'percentage': int((min(5, int(5 * perf_factor)) / 5) * 100)},
        'Strings': {'solved': min(4, int(4 * perf_factor)), 'total': 4, 'percentage': int((min(4, int(4 * perf_factor)) / 4) * 100)},
        'Linked Lists': {'solved': min(4, int(4 * perf_factor)), 'total': 4, 'percentage': int((min(4, int(4 * perf_factor)) / 4) * 100)},
        'Stack': {'solved': min(4, int(4 * perf_factor)), 'total': 4, 'percentage': int((min(4, int(4 * perf_factor)) / 4) * 100)},
        'Queue': {'solved': min(2, int(2 * perf_factor)), 'total': 2, 'percentage': int((min(2, int(2 * perf_factor)) / 2) * 100)},
        'Trees': {'solved': min(5, int(5 * perf_factor)), 'total': 5, 'percentage': int((min(5, int(5 * perf_factor)) / 5) * 100)},
        'Graphs': {'solved': min(4, int(4 * perf_factor)), 'total': 4, 'percentage': int((min(4, int(4 * perf_factor)) / 4) * 100)},
        'Dynamic Programming': {'solved': min(6, int(6 * perf_factor)), 'total': 6, 'percentage': int((min(6, int(6 * perf_factor)) / 6) * 100)},
    }

    all_students.append({
        "id": f"student-{idx}",
        "rollNo": roll,
        "name": name,
        "email": email,
        "avatar": f"https://images.unsplash.com/photo-{1535713875002 + idx * 23}?w=150&auto=format&fit=crop&q=80",
        "teamId": f"team-{t_id}",
        "teamNumber": t_num,
        "mentorId": mentor_obj["id"],
        "mentorName": mentor_obj["name"],
        "dsaLevel": dsa_level,
        "progress": progress,
        "solved": solved,
        "attempted": attempted,
        "pending": pending,
        "streak": streak,
        "longestStreak": longest_streak,
        "status": status,
        "topicProgress": topic_prog,
        "difficultyStats": {
            "easy": {"solved": min(11, int(11 * perf_factor)), "total": 11},
            "medium": {"solved": min(14, int(14 * perf_factor)), "total": 14},
            "hard": {"solved": min(9, int(9 * perf_factor)), "total": 9},
        },
        "recentActivities": [
            {
                "id": f"act-{idx}-1",
                "action": "Solved Problem",
                "problemTitle": "Two Sum",
                "topic": "Arrays",
                "timestamp": "2026-08-20T10:30:00Z",
                "timeAgo": "2 hours ago",
                "status": "Completed",
                "difficulty": "Easy",
            },
            {
                "id": f"act-{idx}-2",
                "action": "Attempted Problem",
                "problemTitle": "Longest Palindromic Substring",
                "topic": "Strings",
                "timestamp": "2026-08-19T14:15:00Z",
                "timeAgo": "1 day ago",
                "status": "Completed",
                "difficulty": "Medium",
            },
        ],
        "submissionsHistory": [
            {"date": "Mon", "count": random.randint(1, 4)},
            {"date": "Tue", "count": random.randint(2, 5)},
            {"date": "Wed", "count": random.randint(1, 6)},
            {"date": "Thu", "count": random.randint(3, 7)},
            {"date": "Fri", "count": random.randint(2, 8)},
            {"date": "Sat", "count": random.randint(0, 3)},
            {"date": "Sun", "count": random.randint(1, 4)},
        ],
        "mentorFeedbackNotes": [
            {
                "id": f"note-{idx}",
                "date": "2026-08-18",
                "author": mentor_obj["name"],
                "note": f"Consistent practice demonstrated in DSA Level-1 curriculum. Recommended focusing on Tree Traversals.",
            }
        ],
        "leetcodeUsername": f"{name.lower().replace(' ', '_')[:12]}_{roll[-4:]}",
        "githubUsername": f"{name.lower().replace(' ', '')[:10]}_{roll[-4:]}",
    })

# Build teams list
all_teams = []
for i in range(20):
    t_id_str = f"team-{i+1}"
    t_num_str = f"Team {i+1:02d}"
    t_name = TEAM_NAMES[i]
    m_obj = MENTORS_LIST[i]
    
    t_students = [s for s in all_students if s["teamId"] == t_id_str]
    count = len(t_students)
    avg_prog = round(sum(s["progress"] for s in t_students) / count) if count > 0 else 75
    tot_solved = sum(s["solved"] for s in t_students) if count > 0 else 110
    tot_attempted = sum(s["attempted"] for s in t_students) if count > 0 else 130
    avg_streak = round(sum(s["streak"] for s in t_students) / count, 1) if count > 0 else 8.2
    
    status = 'Active' if avg_prog >= 60 else 'Needs Attention'
    
    all_teams.append({
        "id": t_id_str,
        "teamNumber": t_num_str,
        "name": t_name,
        "mentorId": m_obj["id"],
        "mentorName": m_obj["name"],
        "mentorEmail": m_obj["email"],
        "mentorDepartment": m_obj["dept"],
        "studentIds": [s["id"] for s in t_students],
        "avgProgress": avg_prog,
        "totalSolved": tot_solved,
        "totalAttempted": tot_attempted,
        "avgStreak": avg_streak,
        "status": status,
        "topicPerformance": {
            'Arrays': 85,
            'Strings': 80,
            'Linked Lists': 78,
            'Stack': 74,
            'Queue': 70,
            'Trees': 68,
            'Graphs': 62,
            'Dynamic Programming': 58,
        },
        "rank": i + 1,
    })

all_teams.sort(key=lambda x: x["avgProgress"], reverse=True)
for rank_idx, tm in enumerate(all_teams, 1):
    tm["rank"] = rank_idx

# Find Chakri for default student user
chakri_student = next((s for s in all_students if "CHAKRI" in s["name"]), all_students[0])
ludwikha_mentor = next((m for m in MENTORS_LIST if m["name"] == "Mrs. Ludwikha"), MENTORS_LIST[6])

ts_content = f"""import {{ DSATopic, Mentor, Problem, Student, Team, CurrentUser }} from '../types';
import {{ PROBLEMS_BANK_100 }} from './dsaCurriculum100';

export {{ PROBLEMS_BANK_100 as PROBLEMS_BANK }} from './dsaCurriculum100';

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

export const TOPIC_CURRICULUM_TOTALS: Record<DSATopic, number> = {{
  'Arrays': 5,
  'Strings': 4,
  'Linked Lists': 4,
  'Stack': 4,
  'Queue': 2,
  'Trees': 5,
  'Graphs': 4,
  'Dynamic Programming': 6,
}};

export const TOTAL_CURRICULUM_PROBLEMS = 34;

export const ALL_MENTORS: Mentor[] = {json.dumps([
    {
        "id": m["id"],
        "name": m["name"],
        "email": m["email"],
        "department": m["dept"],
        "phone": m["phone"],
        "avatar": f"https://images.unsplash.com/photo-{1507003211169 + idx * 17}?w=150&auto=format&fit=crop&q=80",
        "assignedTeamId": m["teamId"],
        "assignedTeamNumber": m["teamNum"],
        "experienceYears": m["exp"],
    } for idx, m in enumerate(MENTORS_LIST)
], indent=2)};

export const ALL_STUDENTS: Student[] = {json.dumps(all_students, indent=2)};

export const ALL_TEAMS: Team[] = {json.dumps(all_teams, indent=2)};

export const DEAN_USER: CurrentUser = {{
  id: 'dean-1',
  name: 'Sudo Users',
  email: 'root@gkce.edu.in',
  role: 'DEAN',
  avatar: 'https://api.dicebear.com/7.x/lorelei-neutral/svg?seed=GKCE_Dean_SUDO&backgroundColor=0f172a&radius=16',
  title: 'Dean of Academic Affairs & Head of Technical Training',
}};

export const DEFAULT_MENTOR_USER: CurrentUser = {{
  id: 'mentor-7',
  name: 'Mrs. Ludwikha',
  email: 'ludwikha@gkce.edu.in',
  role: 'MENTOR',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  title: 'Faculty Mentor, Dept. of CSE',
  teamId: 'team-7',
  teamNumber: 'Team 07',
  mentorData: ALL_MENTORS.find(m => m.id === 'mentor-7'),
}};

export const DEFAULT_STUDENT_USER: CurrentUser = {{
  id: '{chakri_student["id"]}',
  name: '{chakri_student["name"]}',
  email: '{chakri_student["email"]}',
  role: 'STUDENT',
  avatar: '{chakri_student["avatar"]}',
  title: 'B.Tech Student, GKCE',
  teamId: '{chakri_student["teamId"]}',
  teamNumber: '{chakri_student["teamNumber"]}',
  studentData: ALL_STUDENTS.find(s => s.id === '{chakri_student["id"]}'),
}};
"""

with open(r"d:\gkce\src\data\mockData.ts", "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Generated mockData.ts with {len(all_students)} authentic students and {len(all_teams)} teams successfully.")
