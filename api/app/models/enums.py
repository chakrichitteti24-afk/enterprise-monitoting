import enum


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"
    DEAN = "DEAN"


class StudentStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    NEEDS_ATTENTION = "NEEDS_ATTENTION"
    INACTIVE = "INACTIVE"


class DSALevel(str, enum.Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    MASTERY = "MASTERY"


class ProblemDifficulty(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"


class DSATopic(str, enum.Enum):
    ARRAYS = "ARRAYS"
    STRINGS = "STRINGS"
    LINKED_LISTS = "LINKED_LISTS"
    STACK = "STACK"
    QUEUE = "QUEUE"
    TREES = "TREES"
    GRAPHS = "GRAPHS"
    DYNAMIC_PROGRAMMING = "DYNAMIC_PROGRAMMING"


class SubmissionStatus(str, enum.Enum):
    SOLVED = "SOLVED"
    ACCEPTED = "SOLVED"
    ATTEMPTED = "ATTEMPTED"
    FAILED = "FAILED"
