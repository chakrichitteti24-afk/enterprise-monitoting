import json
import re

STUDENTS_RAW = [
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

    # Group 7 (Team 07) - Mentor: Mrs. Ludvika
    {"name": "CH. CHAKRI", "roll": "24F81A0522", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "P. GAYANI", "roll": "24F81A0534", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "P. AKHILA", "roll": "24F81A0504", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "C. JAHNAVI", "roll": "24F81A0549", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "S. HARSHITHA", "roll": "24F81A0544", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},
    {"name": "S. SUDHA", "roll": "24F81A05B2", "team": 7, "class": "II B.Tech CSE", "mentor": "Mrs. Ludvika"},

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

MENTORS_META = [
    {"id": 1, "name": "Dr. K. Suresh Kumar", "email": "suresh.kumar@gkce.edu.in", "team_id": 1, "team_number": "Team 01", "dept": "CSE", "exp": 12},
    {"id": 2, "name": "Mrs. P. Radhika", "email": "radhika.p@gkce.edu.in", "team_id": 2, "team_number": "Team 02", "dept": "CSE", "exp": 8},
    {"id": 3, "name": "Mr. M. Ramesh", "email": "ramesh.m@gkce.edu.in", "team_id": 3, "team_number": "Team 03", "dept": "CSE", "exp": 7},
    {"id": 4, "name": "Mrs. S. Lakshmi", "email": "lakshmi.s@gkce.edu.in", "team_id": 4, "team_number": "Team 04", "dept": "CSE", "exp": 9},
    {"id": 5, "name": "Mr. N. Rajesh", "email": "rajesh.n@gkce.edu.in", "team_id": 5, "team_number": "Team 05", "dept": "CSE", "exp": 6},
    {"id": 6, "name": "Mrs. G. Pavani", "email": "pavani.g@gkce.edu.in", "team_id": 6, "team_number": "Team 06", "dept": "CSE", "exp": 5},
    {"id": 7, "name": "Mrs. Ludvika", "email": "ludvika@gkce.edu.in", "team_id": 7, "team_number": "Team 07", "dept": "CSE", "exp": 8},
    {"id": 8, "name": "Mr. Vishnu", "email": "vishnu@gkce.edu.in", "team_id": 8, "team_number": "Team 08", "dept": "CSE", "exp": 7},
    {"id": 9, "name": "Mrs. Manjusha", "email": "manjusha@gkce.edu.in", "team_id": 9, "team_number": "Team 09", "dept": "CSE", "exp": 10},
    {"id": 10, "name": "Mrs. Teja", "email": "teja.faculty@gkce.edu.in", "team_id": 10, "team_number": "Team 10", "dept": "CSE", "exp": 6},
]

print(f"Total students configured: {len(STUDENTS_RAW)}")
print(f"Total mentors configured: {len(MENTORS_META)}")
