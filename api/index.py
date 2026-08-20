import sys
import os

# Set VERCEL flag in environment if not already set
if "VERCEL" not in os.environ:
    os.environ["VERCEL"] = "1"

# Add backend root to sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app

# Expose app for Vercel Python runtime
__all__ = ["app"]
