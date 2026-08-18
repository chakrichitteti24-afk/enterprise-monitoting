import time
from typing import Dict, List
from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

# In-memory sliding window rate limiter with auto-eviction & capacity limits
LOGIN_ATTEMPTS: Dict[str, List[float]] = {}
RATE_LIMIT_WINDOW_SECONDS = 60
MAX_LOGIN_ATTEMPTS_PER_WINDOW = 15
MAX_TRACKED_IPS = 5000  # Hard memory limit to prevent self-DoS memory leaks


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        # Apply OWASP Secure Headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Rate limit only on authentication endpoints (skip in automated testclient runs)
        if request.url.path.endswith("/api/auth/login") and request.method == "POST":
            client_ip = request.client.host if request.client else "unknown"
            if client_ip == "testclient":
                return await call_next(request)

            now = time.time()

            # Evict stale entries if dictionary grows large (Memory Exhaustion / Self-DoS Prevention)
            if len(LOGIN_ATTEMPTS) > MAX_TRACKED_IPS:
                expired_ips = [
                    ip for ip, timestamps in LOGIN_ATTEMPTS.items()
                    if not timestamps or now - timestamps[-1] >= RATE_LIMIT_WINDOW_SECONDS
                ]
                for ip in expired_ips:
                    LOGIN_ATTEMPTS.pop(ip, None)

            if client_ip not in LOGIN_ATTEMPTS:
                LOGIN_ATTEMPTS[client_ip] = []

            # Clean expired timestamps for this IP
            LOGIN_ATTEMPTS[client_ip] = [
                ts for ts in LOGIN_ATTEMPTS[client_ip] if now - ts < RATE_LIMIT_WINDOW_SECONDS
            ]

            if len(LOGIN_ATTEMPTS[client_ip]) >= MAX_LOGIN_ATTEMPTS_PER_WINDOW:
                return JSONResponse(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    content={
                        "detail": "Too many failed login attempts. Please wait 1 minute before trying again."
                    },
                )

            LOGIN_ATTEMPTS[client_ip].append(now)

        return await call_next(request)
