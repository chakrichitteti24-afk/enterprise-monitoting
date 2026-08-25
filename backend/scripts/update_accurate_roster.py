import json
import os

TEAMS_INPUT = [
  {
    "team": "Team 1",
    "mentor": "K.S.GAYATHRI",
    "students": [
      { "roll_no": "23F81A0502", "student_name": "ANANTHALAKSHMI.BODDU" },
      { "roll_no": "23F81A0507", "student_name": "DEVIKA.PITTI" },
      { "roll_no": "23F81A0513", "student_name": "KAVITHA.GALLA" },
      { "roll_no": "23F81A0511", "student_name": "JASWITHA.BATTA" },
      { "roll_no": "23F81A0538", "student_name": "THANUSHA.JEELAGA" }
    ]
  },
  {
    "team": "Team 2",
    "mentor": "SK SHABANA",
    "students": [
      { "roll_no": "23F81A0510", "student_name": "HABEEBA.SHAIK" },
      { "roll_no": "23F81A0504", "student_name": "BHARGAVI.GADDAM" },
      { "roll_no": "23F81A0525", "student_name": "PALLAVI.GADDAM" },
      { "roll_no": "23F81A0534", "student_name": "SRAVANTHI.KATURU" }
    ]
  },
  {
    "team": "Team 3",
    "mentor": "V.RAMYA",
    "students": [
      { "roll_no": "23F81A0514", "student_name": "KAVYA.MODI" },
      { "roll_no": "24F85A0508", "student_name": "MANASA VUKKADALA" },
      { "roll_no": "23F81A0509", "student_name": "DIVYA SRI.KUTLURU" },
      { "roll_no": "23F81A0542", "student_name": "VYSHNAVI.KONERU" }
    ]
  },
  {
    "team": "Team 4",
    "mentor": "SAMYUKTHA",
    "students": [
      { "roll_no": "23F81A0520", "student_name": "MUNI KUMAR.KARUMANCHI" },
      { "roll_no": "23F81A0521", "student_name": "MUNI SAI SUDHARSAN.NELLORE" },
      { "roll_no": "23F81A0529", "student_name": "SAI.PALETI" },
      { "roll_no": "23F81A0535", "student_name": "SRIHARI.VAVILA" },
      { "roll_no": "23F81A0527", "student_name": "PUNEETH.PAGADALA" }
    ]
  },
  {
    "team": "Team 5",
    "mentor": "K.SUDHAKAR",
    "students": [
      { "roll_no": "23F81A0545", "student_name": "BHANU TEJA.PILLI" },
      { "roll_no": "23F81A0562", "student_name": "JAYASREE.BHASKAR" },
      { "roll_no": "23F81A0572", "student_name": "SAILAJA.CHALLA" },
      { "roll_no": "23F81A0578", "student_name": "SRAVANI.BONUBOYINA" },
      { "roll_no": "24F85A0517", "student_name": "VINEELA KEERTHI SREERAM" }
    ]
  },
  {
    "team": "Team 6",
    "mentor": "K.KEERTHANA",
    "students": [
      { "roll_no": "23F81A0552", "student_name": "DIVYA KUMAWAT.PANNALAL" },
      { "roll_no": "23F81A0577", "student_name": "SONI.VETTI" },
      { "roll_no": "23F81A0581", "student_name": "VAISHNAVI.KALLURU" },
      { "roll_no": "23F81A0576", "student_name": "SILPA.CHINTHAGINJALA" }
    ]
  },
  {
    "team": "Team 7",
    "mentor": "A.LUDWIKA",
    "students": [
      { "roll_no": "24F81A0522", "student_name": "CH. CHAKRI" },
      { "roll_no": "24F81A0534", "student_name": "P.GAYANI" },
      { "roll_no": "24F81A0504", "student_name": "P.AKHILA" },
      { "roll_no": "24F81A0549", "student_name": "C.JAHNAVI" },
      { "roll_no": "24F81A0544", "student_name": "S. HARSHITHA" },
      { "roll_no": "24F81A0553", "student_name": "S.KARTHIK" }
    ]
  },
  {
    "team": "Team 8",
    "mentor": "C.MANJUSHA",
    "students": [
      { "roll_no": "24F81A0532", "student_name": "M.ESWAR" },
      { "roll_no": "24F81A0554", "student_name": "K.KEERTHANA" },
      { "roll_no": "24F81A0548", "student_name": "D. HIMA VARSHA" },
      { "roll_no": "24F81A0557", "student_name": "B.KISHORE NAIK" },
      { "roll_no": "24F81A0508", "student_name": "E. ANUSHA" },
      { "roll_no": "24F81A0550", "student_name": "U. JHANAKI" }
    ]
  }
]

TEAM_NAMES = [
    "Algorithm Aces", "Binary Bandits", "Dynamic Dynamos", "Graph Gurus",
    "Stack Smashers", "Queue Queens", "Tree Titans", "Recursion Rangers"
]

MENTOR_EMAILS = {
    "K.S.GAYATHRI": "ksgayathri@gkce.edu.in",
    "SK SHABANA": "skshabana@gkce.edu.in",
    "V.RAMYA": "vramya@gkce.edu.in",
    "SAMYUKTHA": "samyuktha@gkce.edu.in",
    "K.SUDHAKAR": "ksudhakar@gkce.edu.in",
    "K.KEERTHANA": "kkeerthana@gkce.edu.in",
    "A.LUDWIKA": "ludwikha@gkce.edu.in",
    "C.MANJUSHA": "manjusha@gkce.edu.in"
}

def clean_student_name_for_email(name: str) -> str:
    clean = name.replace('.', ' ').strip()
    parts = clean.split()
    first_part = parts[0].lower()
    if len(first_part) <= 2 and len(parts) > 1:
        return parts[1].lower()
    return first_part

def generate_mock_data():
    all_mentors = []
    all_students = []
    all_teams = []

    student_idx = 1
    for t_idx, team_data in enumerate(TEAMS_INPUT, 1):
        team_num_str = f"Team {t_idx:02d}"
        team_id = f"team-{t_idx}"
        mentor_name = team_data["mentor"]
        mentor_email = MENTOR_EMAILS.get(mentor_name, f"mentor.{t_idx}@gkce.edu.in")
        mentor_id = f"mentor-{t_idx}"

        mentor_obj = {
            "id": mentor_id,
            "name": mentor_name,
            "email": mentor_email,
            "department": "Computer Science & Engg",
            "phone": f"+91 98480 {10000 + t_idx}",
            "avatar": f"https://images.unsplash.com/photo-{1507003211169 + t_idx * 17}?w=150&auto=format&fit=crop&q=80",
            "assignedTeamId": team_id,
            "assignedTeamNumber": team_num_str,
            "experienceYears": 8
        }
        all_mentors.append(mentor_obj)

        team_student_ids = []

        for st in team_data["students"]:
            s_name = st["student_name"]
            s_roll = st["roll_no"]
            s_id = f"student-{student_idx}"
            team_student_ids.append(s_id)
            prefix = clean_student_name_for_email(s_name)
            s_email = f"{prefix}{s_roll.lower()}@gkce.edu.in"

            # 100% accurate initial state: 0 fake progress!
            student_obj = {
                "id": s_id,
                "rollNo": s_roll,
                "name": s_name,
                "email": s_email,
                "avatar": f"https://images.unsplash.com/photo-{1535713875002 + student_idx * 23}?w=150&auto=format&fit=crop&q=80",
                "teamId": team_id,
                "teamNumber": team_num_str,
                "mentorId": mentor_id,
                "mentorName": mentor_name,
                "dsaLevel": "Beginner",
                "progress": 0,
                "solved": 0,
                "attempted": 0,
                "pending": 100,
                "streak": 0,
                "longestStreak": 0,
                "status": "Active",
                "topicProgress": {
                    "Arrays": { "solved": 0, "total": 55, "percentage": 0 },
                    "Strings": { "solved": 0, "total": 15, "percentage": 0 },
                    "Linked Lists": { "solved": 0, "total": 10, "percentage": 0 },
                    "Stack": { "solved": 0, "total": 10, "percentage": 0 },
                    "Queue": { "solved": 0, "total": 5, "percentage": 0 },
                    "Trees": { "solved": 0, "total": 5, "percentage": 0 },
                    "Graphs": { "solved": 0, "total": 0, "percentage": 0 },
                    "Dynamic Programming": { "solved": 0, "total": 0, "percentage": 0 }
                },
                "difficultyStats": {
                    "easy": { "solved": 0, "total": 70 },
                    "medium": { "solved": 0, "total": 28 },
                    "hard": { "solved": 0, "total": 2 }
                },
                "recentActivities": [],
                "submissionsHistory": [],
                "mentorFeedbackNotes": [],
                "verifiedProblemIds": [],
                "leetcodeUsername": f"{s_name.lower().replace('.', '_').replace(' ', '_')[:12]}_{s_roll[-4:]}",
                "githubUsername": f"{s_name.lower().replace('.', '').replace(' ', '')[:10]}_{s_roll[-4:]}"
            }
            all_students.append(student_obj)
            student_idx += 1

        team_obj = {
            "id": team_id,
            "teamNumber": team_num_str,
            "name": TEAM_NAMES[t_idx - 1] if t_idx - 1 < len(TEAM_NAMES) else f"Team {t_idx:02d}",
            "mentorId": mentor_id,
            "mentorName": mentor_name,
            "mentorEmail": mentor_email,
            "mentorDepartment": "Computer Science & Engg",
            "studentIds": team_student_ids,
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
            "rank": t_idx
        }
        all_teams.append(team_obj)

    # Find Chakri or fallback student for default
    chakri_student = next((s for s in all_students if "CHAKRI" in s["name"]), all_students[0])
    ludwika_mentor = next((m for m in all_mentors if "LUDWIKA" in m["name"]), all_mentors[6])

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
  'Arrays': 55,
  'Strings': 15,
  'Linked Lists': 10,
  'Stack': 10,
  'Queue': 5,
  'Trees': 5,
  'Graphs': 0,
  'Dynamic Programming': 0,
}};

export const TOTAL_CURRICULUM_PROBLEMS = 100;

export const ALL_MENTORS: Mentor[] = {json.dumps(all_mentors, indent=2)};

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
  id: '{ludwika_mentor["id"]}',
  name: '{ludwika_mentor["name"]}',
  email: '{ludwika_mentor["email"]}',
  role: 'MENTOR',
  avatar: '{ludwika_mentor["avatar"]}',
  title: 'Faculty Mentor, Dept. of CSE',
  teamId: '{ludwika_mentor["assignedTeamId"]}',
  teamNumber: '{ludwika_mentor["assignedTeamNumber"]}',
  mentorData: ALL_MENTORS.find(m => m.id === '{ludwika_mentor["id"]}'),
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

    mock_path = r"d:\gkce\src\data\mockData.ts"
    with open(mock_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"Generated {mock_path} successfully with {len(all_students)} authentic students across {len(all_teams)} teams.")

if __name__ == "__main__":
    generate_mock_data()
