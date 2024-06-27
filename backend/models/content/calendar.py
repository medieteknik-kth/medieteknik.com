from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
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

    # Relationships
    parent_calendar = db.relationship(
        "Calendar", remote_side=[calendar_id], foreign_keys=[parent_calendar_id]
    )
    child_calendars = db.relationship("Calendar", foreign_keys=[parent_calendar_id])
    events = db.relationship("Event", back_populates="calendar")

    def to_dict(self):
        return {"name": self.name, "is_main": self.is_main}
