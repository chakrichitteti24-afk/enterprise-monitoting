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

from app.main import app

# Expose app for Vercel Python runtime
__all__ = ["app"]
