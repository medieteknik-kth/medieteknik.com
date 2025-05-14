import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from sqlmodel import CheckConstraint, Field, Relationship, SQLModel, func

from utility.database import db

if TYPE_CHECKING:
    from models.committees import Committee
    from models.content.event import Event
    from models.core.student import Student


class Calendar(SQLModel, table=True):
    __tablename__ = "calendar"

    calendar_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    name: str
    created_at: datetime = Field(default_factory=datetime.now(tz=timezone.utc))
    updated_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
        sa_column_kwargs={"onupdate": func.now()},
    )

    # Foreign keys
    parent_calendar_id: uuid.UUID | None = Field(
        foreign_key="calendar.calendar_id",
    )

    student_id: uuid.UUID | None = Field(
        foreign_key="student.student_id",
        unique=True,
    )

    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        unique=True,
    )

    # Relationships
    parent_calendar: "Calendar" = Relationship(
        back_populates="child_calendars",
        cascade_delete=True,
        sa_relationship_kwargs={"remote_side": "Calendar.calendar_id"},
    )

    child_calendars: list["Calendar"] = Relationship(
        back_populates="parent_calendar",
        sa_relationship_kwargs={
            "primaryjoin": "Calendar.parent_calendar_id == Calendar.calendar_id"
        },
    )
    events: list["Event"] = Relationship(
        back_populates="calendar",
    )
    student: "Student" = Relationship(back_populates="calendar")

    committee: "Committee" = Relationship(back_populates="calendar")

    events = db.relationship("Event", back_populates="calendar")
    student = db.relationship("Student", back_populates="calendar")
    committee = db.relationship("Committee", back_populates="calendar")

    __table_args__ = (
        CheckConstraint(
            "calendar_id != parent_calendar_id", name="check_not_self_parent"
        ),
    )

    @hybrid_property
    def is_root(self):
        """
        Returns a boolean indicating whether the current instance is a root calendar.

        This property checks if the `parent_calendar_id` attribute is `None`, indicating that the current instance is a root calendar. It is a hybrid property, meaning it can be used as a regular attribute or a property.

        Returns:
            bool: `True` if the current instance is a root calendar, `False` otherwise.
        """
        return self.parent_calendar_id is None

    @is_root.expression
    def is_root(cls):
        """
        Returns a SQL expression representing the `is_root` property.

        This expression checks if the `parent_calendar_id` attribute is `None`, indicating that the current instance is a root calendar.

        Returns:
            sqlalchemy.sql.elements.BinaryExpression: A SQL expression representing the `is_root` property.
        """
        return cls.parent_calendar_id.is_(None)

    @validates("student", "committee")
    def validate_owner(self, key, value):
        """
        Validates the owner of a calendar.

        Args:
            key (str): The key of the owner to validate. Can be either "student" or "committee".
            value (Any): The value of the owner to validate.

        Raises:
            ValueError: If the calendar is already associated with both a student and a committee, and the key is "student" or "committee".

        Returns:
            Any: The validated value.
        """
        if key == "student" and self.committee_id is not None:
            raise ValueError(
                "Calendar can't be associated with both a student and a committee"
            )
        if key == "committee" and self.student_id is not None:
            raise ValueError(
                "Calendar can't be associated with both a student and a committee"
            )
        return value

    def to_dict(self):
        """
        Returns a dictionary representation of the `Calendar` object.

        Returns:
            dict: A dictionary containing the `name` and `is_root` attributes of the `Calendar` object.
        """
        return {"name": self.name, "is_root": self.is_root()}
