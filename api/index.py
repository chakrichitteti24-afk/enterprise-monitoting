import sys
import os

# Set VERCEL flag in environment if not already set
if "VERCEL" not in os.environ:
    os.environ["VERCEL"] = "1"

# Add directories to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.abspath(os.path.join(current_dir, ".."))
backend_dir = os.path.abspath(os.path.join(parent_dir, "backend"))

for p in [current_dir, parent_dir, backend_dir, "/var/task/api", "/var/task/backend", "/var/task"]:
    if os.path.isdir(p) and p not in sys.path:
        sys.path.insert(0, p)

from app.main import app

# Expose app for Vercel Python runtime
__all__ = ["app"]
