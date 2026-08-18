# GKCE DSA Student Monitoring Platform — Production Backend

A high-performance, production-ready REST API backend built with **FastAPI**, **SQLAlchemy 2.0**, **PostgreSQL**, **Alembic**, **Pydantic v2**, and **JWT Authentication** with strict 3-tier Role-Based Access Control (RBAC).

---

## 🏛️ System Overview & Authorization Hierarchy

The platform monitors **100 students** learning Data Structures & Algorithms across **20 teams** (exactly 5 students per team) with **20 faculty mentors** and **1 Dean / Privileged Administrator**:

```
                         ┌───────────────────────────┐
                         │       Dean (Full)         │
                         │  - All 20 Teams           │
                         │  - All 100 Students       │
                         │  - Institutional Reports  │
                         └─────────────┬─────────────┘
                                       │
                        ┌──────────────┴──────────────┐
                        │                             │
          ┌─────────────▼─────────────┐ ┌─────────────▼─────────────┐
          │     Mentor (Team 01)      │ │     Mentor (Team 20)      │
          │  - Team 01 (5 Students)   │ │  - Team 20 (5 Students)   │
          │  - Cannot view Team 02-20 │ │  - Cannot view Team 01-19 │
          └─────────────┬─────────────┘ └─────────────┬─────────────┘
                        │                             │
          ┌─────────────▼─────────────┐ ┌─────────────▼─────────────┐
          │    Student 1 (Own Data)   │ │   Student 100 (Own Data)  │
          │  - Cannot view other st.  │ │  - Cannot view other st.  │
          └───────────────────────────┘ └───────────────────────────┘
```

---

## 📁 Architecture & Clean Structure

```
backend/
├── app/
│   ├── main.py                     # FastAPI application factory & CORS
│   ├── core/
│   │   ├── config.py               # Pydantic v2 Settings (.env configuration)
│   │   ├── security.py             # Native Bcrypt hashing & PyJWT token management
│   │   ├── exceptions.py           # Standard HTTP exceptions (401, 403, 404, 409)
│   │   └── dependencies.py         # JWT validation & RBAC ownership guards
│   ├── database/
│   │   ├── base.py                 # DeclarativeBase & TimestampMixin
│   │   └── session.py              # SQLAlchemy engine & SessionLocal dependency
│   ├── models/                     # SQLAlchemy 2.0 ORM Models
│   │   ├── user.py, team.py, mentor.py, student.py
│   │   ├── problem.py, submission.py, progress.py, activity.py, note.py
│   ├── schemas/                    # Pydantic v2 validation models
│   ├── repositories/               # Data access & aggregate query layer
│   ├── services/                   # Core business logic & analytics engine
│   └── routers/                    # FastAPI REST route controllers
│       ├── auth.py, student.py, mentor.py, dean.py, problems.py, submissions.py
├── alembic/                        # Database migration scripts
├── scripts/
│   └── seed_data.py                # 1 Dean, 20 Teams, 20 Mentors, 100 Students seeder
├── tests/                          # Pytest suite (21 passing tests)
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── requirements.txt
```

---

## 🚀 Quick Start (Local Setup)

### 1. Prerequisites
- Python 3.10+ / Python 3.12+
- PostgreSQL (or SQLite for local zero-config development)

### 2. Installation
```bash
cd backend
python -m pip install -r requirements.txt
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```ini
DATABASE_URL=sqlite:///./gkce_dsa.db
# For PostgreSQL:
# DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/gkce_dsa_db

JWT_SECRET_KEY=gkce-dsa-super-secret-jwt-key-2026-production-ready-32bytes-min
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
ENVIRONMENT=development
```

### 4. Database Migration & Canonical Seeding
```bash
# Run database migrations
alembic upgrade head

# Seed 100 students, 20 teams, 20 mentors, 1 Dean, 34 DSA problems, submissions
python -m scripts.seed_data
```

### 5. Start API Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Interactive Swagger UI: **`http://localhost:8000/docs`**
- Alternative ReDoc: **`http://localhost:8000/redoc`**

---

## 🔐 Demo Credentials (Development Only)

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Dean** | `dean.academics@gkce.edu.in` | `Dean@GKCE2026` | Full access to all 20 teams, 100 students, analytics & reports |
| **Mentor** | `mentor.07@gkce.edu.in` | `Mentor@GKCE2026` | Restricted strictly to **Team 07** (5 students) |
| **Student** | `student.031@gkce.edu.in` | `Student@GKCE2026` | Restricted strictly to own student record (**22CSE031**) |

---

## 🧪 Running Automated Tests

Run the full RBAC isolation, authentication, and submission test suite:
```bash
pytest tests/ -v
```
All **21 test cases** verify that:
- Students accessing other students receive `403 Forbidden`
- Students accessing mentor/dean endpoints receive `403 Forbidden`
- Mentors accessing other teams or outside students receive `403 Forbidden`
- Dean has full privileged access across all 20 teams and 100 students
- Problem submissions automatically recalculate progress percentages and streak counters

---

## 🐳 Docker Deployment

To launch the complete PostgreSQL 16 database and FastAPI server with Docker Compose:
```bash
docker-compose up --build -d
```

---

## 🔌 Next.js / React Frontend Integration Guide

### 1. TypeScript API Client (`src/lib/api.ts`)

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}
```

### 2. Login & Token Storage Example

```typescript
export async function loginUser(email: string, password: string) {
  const data = await apiFetch<{
    access_token: string;
    token_type: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: 'STUDENT' | 'MENTOR' | 'DEAN';
      team_id?: number;
      team_number?: string;
      roll_number?: string;
    };
  }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('access_token', data.access_token);
  return data.user;
}
```

### 3. Role-Based Fetch Examples

#### Student Dashboard:
```typescript
// Fetch logged-in student dossier & topic breakdown
const studentDossier = await apiFetch('/student/me');
const progressStats = await apiFetch('/student/progress');
```

#### Mentor Dashboard (5 Students):
```typescript
// Fetch mentor's assigned cohort & students
const teamDetail = await apiFetch('/mentor/team');
const fiveStudents = await apiFetch('/mentor/team/students');
```

#### Dean Dashboard (Macro Institutional Overview):
```typescript
// Fetch Dean KPIs, 20 teams grid, and paginated student directory
const overviewKpis = await apiFetch('/dean/dashboard');
const twentyTeams = await apiFetch('/dean/teams');
const paginatedStudents = await apiFetch('/dean/students?page=1&limit=20');
```
