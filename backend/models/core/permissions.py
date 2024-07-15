import enum
from typing import Any, Dict, List

from sqlalchemy import Column, Enum, ForeignKey, Integer, inspect
from sqlalchemy.dialects.postgresql import ARRAY
from utility.database import db


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


class StudentPermission(db.Model):
    __tablename__ = "student_permission"

    permission_id = Column(Integer, primary_key=True, autoincrement=True)

    role = Column(Enum(Role), nullable=False)
    permissions = Column(
        ARRAY(Enum(Permissions, create_constraint=False, native_enum=False)),
        nullable=False,
    )

    # Foreign keys
    student_id = Column(
        Integer, ForeignKey("student.student_id"), nullable=False, unique=True
    )

    # Relationships
    student = db.relationship("Student", back_populates="permissions")

    def to_dict(self) -> Dict[str, Any] | None:
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}

        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            elif isinstance(value, List):
                value = [v.value if isinstance(v, enum.Enum) else v for v in value]

            data[column] = value

        if not data:
            return {}

        del data["permission_id"]

        return data
