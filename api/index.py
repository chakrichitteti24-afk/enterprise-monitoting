import sys
import os

# Set VERCEL flag in environment if not already set
if "VERCEL" not in os.environ:
    os.environ["VERCEL"] = "1"

# Add backend root to sys.path across all possible deployment structures
current_file_dir = os.path.dirname(os.path.abspath(__file__))
possible_backend_dirs = [
    os.path.abspath(os.path.join(current_file_dir, "..", "backend")),
    os.path.abspath(os.path.join(current_file_dir, "backend")),
    os.path.abspath(os.path.join(os.getcwd(), "backend")),
    os.path.abspath(os.path.join(current_file_dir, "..")),
    "/var/task/backend",
    "/var/task",
]

for d in possible_backend_dirs:
    if os.path.isdir(d) and d not in sys.path:
        sys.path.insert(0, d)

try:
    from app.main import app
except Exception as e:
    import traceback
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI(title="GKCE DSA Monitor API - Startup Error Handler")
    error_trace = traceback.format_exc()
    
    @app.api_route("/{path_name:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
    async def catch_all_startup_error(path_name: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "StartupError",
                "detail": str(e),
                "traceback": error_trace.splitlines(),
                "sys_path": sys.path,
                "current_dir": current_file_dir,
                "cwd": os.getcwd(),
            }
        )

# Expose app for Vercel Python runtime
__all__ = ["app"]
