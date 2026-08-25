# enterprise-monitoring — GKCE DSA Student Monitoring Platform

> **Gokula Krishna College of Engineering (GKCE)** — Enterprise DSA Student Evaluation & Monitoring Platform.
> Built with Next.js/React + TypeScript, Tailwind CSS, Framer Motion, and a production-grade FastAPI + SQLAlchemy 2.0 + PostgreSQL backend.

---

## 🏛️ Platform Architecture Overview

The platform monitors **100 Computer Science students** across **20 teams** with strict **3-Tier Role-Based Access Control (RBAC)**:

- 🎓 **Students (100 Students, 5 per Team)**: Access strictly their own dossier, problem submissions, streak metrics, and curriculum practice.
- 🧑‍🏫 **Faculty Mentors (20 Mentors, 1:1 per Team)**: Isolated access strictly to their assigned 5 students with qualitative feedback logs.
- 🛡️ **Dean / Academic Admin**: Privileged macro oversight across all 20 teams, 100 students, aggregate analytics, and accreditation reports.

```
GKCE Institutional Hierarchy:
├── 1 Privileged Dean / Academic Admin (Full Macro Oversight)
└── 20 Mentored Teams (Team 01 to Team 20)
    ├── 1 Assigned Faculty Mentor (1:1 per Team)
    └── 5 Assigned Students (100 Total Students: 22CSE001 to 22CSE100)
```

---

## ✨ Features & Capabilities

- **Bento Grid UI System**: Minimalist, high-density modular cards with frosted glassmorphism (`backdrop-blur-2xl`) and squircle geometry.
- **Liquid Physics & Spring Animations**: Butter-smooth 60fps/120fps module transitions and floating liquid dock inspired by ColorOS and OxygenOS.
- **Universal Multi-Device Support**: Optimized for smartphones (iPhone safe-area notch compliance), tablets, and high-resolution desktop screens.
- **Strict Server-Side RBAC**: Zero client-side privilege leaks; backend rejects unauthorized access with `403 Forbidden`.
- **Stateless JWT Authentication**: Signed `HS256` Bearer tokens with anti-enumeration protection and sliding-window rate limiting.
- **Automated Test Bench**: Live code evaluation with automatic progress, streak, and difficulty recalculation.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 + TypeScript (Vite bundler)
- **Styling**: Tailwind CSS v4 + Glassmorphism Design System
- **Animation**: Framer Motion (Spring Physics & Liquid Layout Animations)
- **Icons**: Lucide React
- **Typography**: Inter (UI) + JetBrains Mono (Roll Nos & Code Metrics)

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **ORM & Database**: SQLAlchemy 2.0 + PostgreSQL / SQLite (Development)
- **Migrations**: Alembic
- **Validation**: Pydantic v2
- **Authentication**: Stateless JWT + Argon2 / Bcrypt password hashing
- **Testing**: Pytest (`27/27` automated unit & RBAC tests passing)
- **Containerization**: Docker & Docker Compose

---

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/chakrichitteti24-afk/enterprise-monitoting.git
cd enterprise-monitoting
```

### 2. Run Backend (FastAPI)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run migrations & seed data (121 users, 20 teams, 34 DSA problems)
python scripts/seed_data.py

# Start development server
uvicorn app.main:app --reload --port 8000
```
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

### 3. Run Frontend (React + Vite)
```bash
# In the root directory:
npm install
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Tests

### Backend Automated Test Suite
```bash
cd backend
python -m pytest tests/ -v
```

### Frontend Production Build
```bash
npm run build
```

---

## 🐳 Docker Deployment
```bash
cd backend
docker-compose up -d --build
```

---

## 🏢 Platform Engineering & Technology Partner

- **Engineered by:** **[CipherFlux Labs](https://cipherflux-labs.vercel.app)**
- **Website / Portfolio:** [cipherflux-labs.vercel.app](https://cipherflux-labs.vercel.app)

---

## 📄 License
Academic and institutional evaluation license for Gokula Krishna College of Engineering (GKCE).
Developed and maintained in collaboration with [CipherFlux Labs](https://cipherflux-labs.vercel.app).
