from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base, TimestampMixin
from app.models.enums import UserRole

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.mentor import Mentor


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, name="user_role_enum"),
        nullable=False,
        index=True,
        default=UserRole.STUDENT,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # 1-to-1 relationships
    student_profile: Mapped[Optional["Student"]] = relationship(
        "Student", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    mentor_profile: Mapped[Optional["Mentor"]] = relationship(
        "Mentor", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
