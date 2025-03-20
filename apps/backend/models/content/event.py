import enum
import uuid
from datetime import timedelta
from typing import List
from sqlalchemy import (
    Boolean,
    Column,
    Enum,
    ForeignKey,
    Integer,
    String,
    func,
    inspect,
)
from sqlalchemy.dialects.postgresql import ARRAY, TIMESTAMP, UUID
from sqlalchemy.ext.hybrid import hybrid_property
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE
from utility.database import db
from models.content.base import Item


class Frequency(enum.Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


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

    event_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    start_date = Column(TIMESTAMP, nullable=False)
    duration = Column(Integer, nullable=False)  # Duration in minutes
    location = Column(String(255))
    is_inherited = Column(Boolean, default=False, nullable=False)
    background_color = Column(String(7))

    # Foreign keys
    item_id = Column(UUID(as_uuid=True), ForeignKey("item.item_id", ondelete="CASCADE"))
    calendar_id = Column(
        UUID(as_uuid=True), ForeignKey("calendar.calendar_id", ondelete="CASCADE")
    )
    parent_event_id = Column(
        UUID(as_uuid=True),
        ForeignKey("event.event_id", ondelete="CASCADE", onupdate="CASCADE"),
    )

    # Relationships
    parent_event = db.relationship(
        "Event",
        remote_side=[event_id],
        back_populates="child_events",
        foreign_keys=[parent_event_id],
    )
    child_events = db.relationship(
        "Event",
        back_populates="parent_event",
        foreign_keys=[parent_event_id],
        overlaps="parent_event",
    )
    item = db.relationship("Item", back_populates="event", passive_deletes=True)
    calendar = db.relationship("Calendar", back_populates="events")
    repeatable_event = db.relationship(
        "RepeatableEvent", back_populates="event", uselist=False
    )

    translations = db.relationship(
        "EventTranslation", back_populates="event", lazy="joined"
    )

    notifications = db.relationship(
        "Notifications", back_populates="event", cascade="all, delete-orphan"
    )

    discord_messages = db.relationship(
        "DiscordMessages", back_populates="events", cascade="all, delete-orphan"
    )

    __mapper_args__ = {"polymorphic_identity": "event"}

    @hybrid_property
    def end_date(self):
        if self.start_date is None or self.duration is None:
            return None
        return self.start_date + timedelta(minutes=self.duration)

    @end_date.expression
    def end_date(cls):
        return cls.start_date + func.make_interval(mins=cls.duration)

    def to_dict(
        self,
        provided_languages: List[str] = AVAILABLE_LANGUAGES,
        is_public_route=True,
        custom_start_date: str = None,
    ):
        data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

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

        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: EventTranslation | None = translation_lookup.get(language_code)

            if not translation or not isinstance(translation, EventTranslation):
                translation: EventTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, EventTranslation):
                translations.append(translation.to_dict())

        data["translations"] = translations

        if not isinstance(translation, EventTranslation):
            return None

        del data["calendar_id"]
        del data["parent_event_id"]
        del data["type"]
        del data["published_status"]
        if custom_start_date:
            data["start_date"] = custom_start_date

        return data


class EventTranslation(db.Model):
    __tablename__ = "event_translation"

    event_translation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = Column(String(255))
    description = Column(String(1024))
    main_image_url = Column(String(length=2096))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    event_id = Column(
        UUID(as_uuid=True), ForeignKey("event.event_id", ondelete="CASCADE")
    )
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


class RepeatableEvent(db.Model):
    __tablename__ = "repeatable_event"

    repeatable_event_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    # Metadata
    frequency = Column(
        Enum(Frequency), default=Frequency.WEEKLY, nullable=False
    )  # Daily, Weekly, Monthly, Yearly
    interval = Column(Integer, default=1)  # Every x days, weeks, months, years
    end_date = Column(TIMESTAMP)  # End of the repeatable
    max_occurrences = Column(Integer)  # Number of times to repeat
    repeat_forever = Column(Boolean, default=False)  # Repeat forever

    # Foreign keys
    event_id = Column(UUID(as_uuid=True), ForeignKey("event.event_id"), unique=True)

    # Relationships
    event = db.relationship("Event", back_populates="repeatable_event")
