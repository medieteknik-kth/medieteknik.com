import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    String,
    func,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from utility.database import db


class Calendar(db.Model):
    __tablename__ = "calendar"

    calendar_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now(), server_default=func.now())
    updated_at = Column(
        DateTime,
        default=func.now(),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Foreign keys
    parent_calendar_id = Column(
        UUID(as_uuid=True),
        ForeignKey("calendar.calendar_id", ondelete="CASCADE", onupdate="CASCADE"),
    )
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id", ondelete="CASCADE"),
        unique=True,
    )
    committee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee.committee_id", ondelete="CASCADE"),
        unique=True,
    )

    # Relationships
    parent_calendar = db.relationship(
        "Calendar",
        remote_side=[calendar_id],
        back_populates="child_calendars",
        foreign_keys=[parent_calendar_id],
    )
    child_calendars = db.relationship(
        "Calendar",
        back_populates="parent_calendar",
        foreign_keys=[parent_calendar_id],
        overlaps="parent_calendar",
        cascade="all, delete-orphan",
    )
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
