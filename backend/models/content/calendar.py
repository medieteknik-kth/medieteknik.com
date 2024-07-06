from textwrap import dedent
from typing import List
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from models.content.event import Event
from utility.database import db


class Calendar(db.Model):
    __tablename__ = "calendar"

    calendar_id = Column(Integer, primary_key=True, autoincrement=True)

    name = Column(String(100), nullable=False)
    is_main = Column(Boolean, default=False, nullable=False)

    # Foreign keys
    parent_calendar_id = Column(
        Integer,
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
        "Calendar", remote_side=[calendar_id], foreign_keys=[parent_calendar_id]
    )
    child_calendars = db.relationship("Calendar", foreign_keys=[parent_calendar_id])
    events = db.relationship("Event", back_populates="calendar")
    student = db.relationship("Student", back_populates="calendar")
    committee = db.relationship("Committee", back_populates="calendar")

    def to_dict(self):
        return {"name": self.name, "is_main": self.is_main}

    def to_ics(self, events: List[Event], language: str):
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
