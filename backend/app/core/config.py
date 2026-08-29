from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import json


import os
import tempfile

class Settings(BaseSettings):
    PROJECT_NAME: str = "GKCE DSA Monitor API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    COMPANY_NAME: str = "CipherFlux Labs"
    COMPANY_URL: str = "https://cipherflux-labs.vercel.app"

    # Database
    # Remove SQLite entirely to prevent Vercel Serverless /tmp ephemeral storage bugs
    DATABASE_URL: str = (
        os.environ.get("POSTGRES_URL") or 
        os.environ.get("DATABASE_URL") or 
        "sqlite:///./gkce_dsa.db"
    )

    # JWT Security
    JWT_SECRET_KEY: str = os.environ.get(
        "JWT_SECRET_KEY",
        "dev-only-insecure-key-replace-in-production"
    )
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]
    CORS_ORIGIN_REGEX: str = r"^https?://(localhost|127\.0\.0\.1|.*\.vercel\.app)(:\d+)?$"

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if v and v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str) and v.startswith("["):
            return json.loads(v)
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
