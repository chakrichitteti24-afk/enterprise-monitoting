from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.database.base import Base
from app.database.session import engine
from app.routers import auth, student, mentor, dean, problems, submissions

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
# Gokula Krishna College of Engineering (GKCE) — DSA Student Monitoring Platform API

Production-ready backend with strict 3-tier Role-Based Access Control (RBAC):
- **Dean / Academic Admin**: Full macro oversight over all 20 teams, 100 students, 20 mentors, analytics, and reports.
- **Faculty Mentors**: Isolated access restricted strictly to their assigned team of 5 students.
- **Students**: Private access restricted strictly to own progress, curriculum challenges, submissions, and streak metrics.

### Security Highlights:
- **JWT Authentication** (Bearer Token)
- **Bcrypt / Argon2** password hashing
- **Strict Server-Side Ownership Guards** (403 Forbidden on unauthorized cross-access)
- **Automatic Progress & Streak Synchronization** upon problem submission
    """,
    openapi_tags=[
        {"name": "Authentication", "description": "Login, token validation, and session endpoints"},
        {"name": "Students", "description": "Student self-monitoring, progress, and activity timelines"},
        {"name": "Mentors", "description": "Mentor cohort management for exactly 5 assigned students"},
        {"name": "Dean & Institutional Oversight", "description": "Macro analytics across all 20 teams and 100 students"},
        {"name": "DSA Problems Bank", "description": "Curriculum coding challenges across 8 foundational topics"},
        {"name": "Submissions & Automated Test Bench", "description": "Code submission evaluation and progress syncing"},
    ],
    docs_url="/docs",
    redoc_url="/redoc",
)

from app.core.middleware import SecurityHeadersMiddleware, RateLimitMiddleware

# Security & Rate Limiting Middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handlers for Clean JSON Responses
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # In development, return informative error; in production, keep clean
    if settings.ENVIRONMENT == "development":
        import traceback
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": f"Internal Server Error: {str(exc)}",
                "traceback": traceback.format_exc().splitlines()[-3:],
            },
        )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact GKCE system administrator."},
    )

# Include API Routers under /api
api_prefix = settings.API_V1_STR
app.include_router(auth.router, prefix=api_prefix)
app.include_router(student.router, prefix=api_prefix)
app.include_router(mentor.router, prefix=api_prefix)
app.include_router(dean.router, prefix=api_prefix)
app.include_router(problems.router, prefix=api_prefix)
app.include_router(submissions.router, prefix=api_prefix)


@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
    }


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to GKCE DSA Student Monitoring Platform API",
        "docs_url": "/docs",
        "health_check": "/api/health",
    }
