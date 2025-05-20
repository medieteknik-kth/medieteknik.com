import enum
import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, SQLModel

from utility.database import db

if TYPE_CHECKING:
    from models.core.student import Student


class Role(enum.Enum):
    ADMIN = "ADMIN"
    COMMITTEE_MEMBER = "COMMITTEE_MEMBER"
    STUDENT = "STUDENT"
    OTHER = "OTHER"


class Permissions(enum.Enum):
    # Students
    STUDENT_EDIT_PERMISSIONS = "STUDENT_EDIT_PERMISSIONS"
    STUDENT_ADD = "STUDENT_ADD"
    STUDENT_DELETE = "STUDENT_DELETE"
    STUDENT_EDIT = "STUDENT_EDIT"
    STUDENT_VIEW = "STUDENT_VIEW"

    # Committee
    COMMITTEE_EDIT_PERMISSIONS = "COMMITTEE_EDIT_PERMISSIONS"
    COMMITTEE_ADD = "COMMITTEE_ADD"
    COMMITTEE_DELETE = "COMMITTEE_DELETE"
    COMMITTEE_EDIT = "COMMITTEE_EDIT"
    COMMITTEE_ADD_MEMBER = "COMMITTEE_ADD_MEMBER"
    COMMITTEE_REMOVE_MEMBER = "COMMITTEE_REMOVE_MEMBER"
    COMMITTEE_EDIT_MEMBER = "COMMITTEE_EDIT_MEMBER"

    # Committee positions
    COMMITTEE_POSITION_EDIT_PERMISSIONS = "COMMITTEE_POSITION_EDIT_PERMISSIONS"
    COMMITTEE_POSITION_ADD = "COMMITTEE_POSITION_ADD"
    COMMITTEE_POSITION_DELETE = "COMMITTEE_POSITION_DELETE"
    COMMITTEE_POSITION_EDIT = "COMMITTEE_POSITION_EDIT"

    # News, Events, Documents, Albums
    ITEMS_EDIT = "ITEMS_EDIT"
    ITEMS_VIEW = "ITEMS_VIEW"
    ITEMS_DELETE = "ITEMS_DELETE"

    # Calendar
    CALENDAR_PRIVATE = "CALENDAR_PRIVATE"  # Possibility of having a private calendar
    CALENDAR_CREATE = "CALENDAR_CREATE"
    CALENDAR_DELETE = "CALENDAR_DELETE"
    CALENDAR_EDIT = "CALENDAR_EDIT"


class StudentPermission(SQLModel, table=True):
    __tablename__ = "student_permission"

    permission_id: int | None = Field(
        primary_key=True,
        default=None,
    )

    role: Role
    permissions: list[Permissions]

    # Foreign keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
        nullable=False,
        unique=True,
    )

    # Relationships
    student: "Student" = db.relationship(
        back_populates="permissions",
    )
