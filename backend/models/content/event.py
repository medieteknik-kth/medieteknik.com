import enum
from textwrap import dedent
from typing import List
from sqlalchemy import (
    Boolean,
    Column,
    ForeignKey,
    Integer,
    DateTime,
    String,
    Enum,
    inspect,
)
from sqlalchemy.dialects.postgresql import ARRAY
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item


class EventStatus(enum.Enum):
    UPCOMING = "UPCOMING"
    ONGOING = "ONGOING"
    PAST = "PAST"


class Event(Item):
    """
    Event model which inherits from the base Item model.

    Attributes:
        event_id: Primary key
        start_date: The start date of the event
        end_date: The end date of the event
        status: The status of the event
        location: The location of the event
    """

    event_id = Column(Integer, primary_key=True, autoincrement=True)

    start_date = Column(DateTime)
    end_date = Column(DateTime)
    status = Column(Enum(EventStatus), default=EventStatus.UPCOMING, nullable=False)
    location = Column(String(255))
    is_inherited = Column(Boolean, default=False, nullable=False)
    background_color = Column(String(7))

    # Foreign keys
    item_id = Column(Integer, ForeignKey("item.item_id"))
    calendar_id = Column(Integer, ForeignKey("calendar.calendar_id"))
    parent_event_id = Column(
        Integer, ForeignKey("event.event_id", ondelete="CASCADE", onupdate="CASCADE")
    )

    # Relationships
    parent_event = db.relationship(
        "Event", remote_side=[event_id], foreign_keys=[parent_event_id]
    )
    child_events = db.relationship("Event", foreign_keys=[parent_event_id])
    item = db.relationship("Item", back_populates="event")
    calendar = db.relationship("Calendar", back_populates="events")
    repeatable_event = db.relationship(
        "RepeatableEvents", back_populates="event", uselist=False
    )

    translations = db.relationship("EventTranslation", back_populates="event")

    __mapper_args__ = {"polymorphic_identity": "event"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        data = super().to_dict(provided_languages, is_public_route)

        if data is None:
            return None

        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            data[column] = value

        if not data:
            return None

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                EventTranslation,
                ["event_id"],
                {"event_id": self.event_id},
                language_code,
            )
            translations.append(translation)

        data["translations"] = [translation.to_dict() for translation in translations]

        if not isinstance(translation, EventTranslation):
            return None

        del data["event_id"]
        del data["calendar_id"]
        del data["parent_event_id"]
        del data["type"]
        del data["published_status"]

        return data

    def to_ics(self, language: str):
        translation = get_translation(
            EventTranslation, ["event_id"], {"event_id": self.event_id}, language
        )

        if not isinstance(translation, EventTranslation):
            return None

        return dedent(f"""
            BEGIN:VEVENT
            UID:{str(self.event_id) + '@medieteknik.com'}
            DTSTAMP:{self.created_at.strftime("%Y%m%dT%H%M%S" + "Z")}
            SUMMARY:{translation.title}
            DESCRIPTION:{translation.description}
            LOCATION:{self.location}
            DTSTART:{self.start_date.strftime("%Y%m%dT%H%M%S" + "Z")}
            DTEND:{self.end_date.strftime("%Y%m%dT%H%M%S") + "Z"}
            END:VEVENT
            """)


class EventTranslation(db.Model):
    __tablename__ = "event_translation"

    event_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(500))
    main_image_url = Column(String(255))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    event_id = Column(Integer, ForeignKey("event.event_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    event = db.relationship("Event", back_populates="translations")
    language = db.relationship("Language", back_populates="event_translations")

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["event_translation_id"]
        del data["event_id"]

        return data


class RepeatableEvents(db.Model):
    __tablename__ = "repeatable_events"

    repeatable_event_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    reapeting_interval = Column(String(255))

    # Foreign keys
    event_id = Column(Integer, ForeignKey("event.event_id"), unique=True)

    # Relationships
    event = db.relationship("Event", back_populates="repeatable_event")
