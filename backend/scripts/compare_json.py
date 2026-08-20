import json

USER_JSON = {
  "teams": [
    {
      "team_name": "Team 1",
      "mentor": "Mentor 1",
      "students": [
        {"name": "ANANTHALAKSHMI.BODDU", "roll_number": "23F81A0502"},
        {"name": "DEVIKA.PITTI(MQ)", "roll_number": "23F81A0507"},
        {"name": "KAVITHA.GALLA", "roll_number": "23F81A0513"},
        {"name": "JASWITHA.BATTA", "roll_number": "23F81A0511"},
        {"name": "THANUSHA.JEELAGA", "roll_number": "23F81A0538"}
      ]
    },
    {
      "team_name": "Team 2",
      "mentor": "Mentor 2",
      "students": [
        {"name": "HABEEBA.SHAIK", "roll_number": "23F81A0510"},
        {"name": "BHARGAVI.GADDAM", "roll_number": "23F81A0504"},
        {"name": "PALLAVI.GADDAM", "roll_number": "23F81A0525"},
        {"name": "SRAVANTHI.KATURU", "roll_number": "23F81A0534"}
      ]
    },
    {
      "team_name": "Team 3",
      "mentor": "Mentor 3",
      "students": [
        {"name": "KAVYA.MODI", "roll_number": "23F81A0514"},
        {"name": "MANASA VUKKADALA", "roll_number": "24F85A0508"},
        {"name": "DIVYA SRI.KUTLURU", "roll_number": "23F81A0509"},
        {"name": "VYSHNAVI.KONERU", "roll_number": "23F81A0542"}
      ]
    },
    {
      "team_name": "Team 4",
      "mentor": "Mentor 4",
      "students": [
        {"name": "MUNI KUMAR.KARUMANCHI", "roll_number": "23F81A0520"},
        {"name": "MUNI SAI SUDHARSAN.NELLORE", "roll_number": "23F81A0521"},
        {"name": "SAI.PALETI", "roll_number": "23F81A0529"},
        {"name": "SRIHARI.VAVILA", "roll_number": "23F81A0535"},
        {"name": "PUNEETH.PAGADALA", "roll_number": "23F81A0527"}
      ]
    },
    {
      "team_name": "Team 5",
      "mentor": "Mentor 5",
      "students": [
        {"name": "BHANU TEJA.PILLI", "roll_number": "23F81A0545"},
        {"name": "JAYASREE.BHASKAR", "roll_number": "23F81A0562"},
        {"name": "SAILAJA.CHALLA", "roll_number": "23F81A0572"},
        {"name": "SRAVANI.BONUBOYINA", "roll_number": "23F81A0578"},
        {"name": "VINEELA KEERTHI SREERAM", "roll_number": "24F85A0517"}
      ]
    },
    {
      "team_name": "Team 6",
      "mentor": "Mentor 6",
      "students": [
        {"name": "SONI.VETTI", "roll_number": "23F81A0577"},
        {"name": "VAISHNAVI.KALLURU", "roll_number": "23F81A0581"},
        {"name": "SILPA.CHINTHAGINJALA", "roll_number": "23F81A0576"}
      ]
    },
    {
      "team_name": "Team 7",
      "mentor": "Mrs. Ludvika",
      "students": [
        {"name": "CH. CHAKRI", "roll_number": "24F81A0522"},
        {"name": "P.GAYANI", "roll_number": "24F81A0534"},
        {"name": "P.AKHILA", "roll_number": "24F81A0504"},
        {"name": "C.JAHNAVI", "roll_number": "24F81A0549"},
        {"name": "S. HARSHITHA", "roll_number": "24F81A0544"},
        {"name": "S. SUDHA", "roll_number": "24F81A05B2"}
      ]
    },
    {
      "team_name": "Team 8",
      "mentor": "Mr. Vishnu",
      "students": [
        {"name": "S.KARTHIK", "roll_number": "24F81A0553"},
        {"name": "K. CHANDRA SEKHAR", "roll_number": "24F81A0530"},
        {"name": "G. GOWTHAM", "roll_number": "24F81A0537"}
      ]
    },
    {
      "team_name": "Team 9",
      "mentor": "Mrs. Manjusha",
      "students": [
        {"name": "M.ESWAR", "roll_number": "24F81A0532"},
        {"name": "K.KEERTHANA", "roll_number": "24F81A0554"},
        {"name": "D. HIMA VARSHA", "roll_number": "24F81A0548"},
        {"name": "B.KISHORE NAIK", "roll_number": "24F81A0557"},
        {"name": "E. ANUSHA", "roll_number": "24F81A0508"},
        {"name": "U. JHANAKI", "roll_number": "24F81A0550"}
      ]
    },
    {
      "team_name": "Team 10",
      "mentor": "Mrs. Teja",
      "students": [
        {"name": "M. VENKATESWARLU", "roll_number": "24F81A05C7"},
        {"name": "P. PRASANNA KUMAR", "roll_number": "24F81A0591"},
        {"name": "T. PRABAKAR", "roll_number": "24F81A0590"},
        {"name": "T. Teja", "roll_number": "24F81A05C0"},
        {"name": "E. PRASHANTH", "roll_number": "24F81A0592"}
      ]
    }
  ]
}

total_students = sum(len(t["students"]) for t in USER_JSON["teams"])
print(f"Total Teams in JSON: {len(USER_JSON['teams'])}")
print(f"Total Students in JSON: {total_students}")

for t in USER_JSON["teams"]:
    print(f"\n{t['team_name']} | Mentor: {t['mentor']} | Count: {len(t['students'])}")
    for s in t['students']:
        print(f"  - {s['roll_number']} : {s['name']}")
