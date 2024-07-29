import uuid
from textwrap import dedent
from typing import List
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import (
    CheckConstraint,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import validates
from models.content.event import Event
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
        Integer, ForeignKey("student.student_id", ondelete="CASCADE"), unique=True
    )
    committee_id = Column(
        Integer, ForeignKey("committee.committee_id", ondelete="CASCADE"), unique=True
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

    def to_ics(self, events: List[Event], language: str):
        """
        Convert a list of events to an iCalendar (ics) string representation.

        Args:
            events (List[Event]): A list of Event objects to be converted.
            language (str): The language code (e.g., "en-US") used for the calendar.

        Returns:
            str: The iCalendar string representation of the events.

        This function creates an iCalendar string representation of a list of events. It starts by creating the header of the calendar, including the version, product ID, and calendar scale. Then, it iterates over each event in the list and converts it to an iCalendar event string using the `Event.to_ics()` method. If the event string is not empty, it is appended to the calendar string. Finally, the calendar string is terminated with the "END:VCALENDAR" line and returned.

        Note:
            - The `language` parameter is used to determine the language code for the calendar. The first two characters of the language code are used to generate the product ID.
            - The `dedent()` function is used to remove any common leading whitespace from the generated calendar string.
        """
        calendar = dedent(f"""\
        BEGIN:VCALENDAR
        VERSION:2.0
        PRODID:-//medieteknik//Calendar 1.0//{language[0:2].upper()}
        CALSCALE:GREGORIAN""")

        for event in events:
            event_ics = event.to_ics(language)
            if not event_ics:
                continue

            calendar += "\n"
            calendar += event_ics

        calendar += "\n"
        calendar += "END:VCALENDAR"

        calendar = dedent(calendar)

        return calendar
