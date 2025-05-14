import enum
import uuid
from datetime import datetime, timedelta
from typing import TYPE_CHECKING, List

from sqlalchemy import (
    func,
    inspect,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

if TYPE_CHECKING:
    from models.core.calendar import Calendar
    from models.core.notifications import Notifications
    from models.utility.discord import DiscordMessages


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

    event_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    start_date: datetime
    duration: int
    location: str
    is_inherited: bool = False
    background_color: str = Field(default="#EEC912", max_length=7)

    # Foreign keys
    item_id: uuid.UUID = Field(foreign_key="item.item_id")
    calendar_id: uuid.UUID = Field(
        foreign_key="calendar.calendar_id",
    )
    parent_event_id: uuid.UUID | None = Field(
        foreign_key="event.event_id",
    )

    # Relationships
    parent_event: "Event" | None = Relationship(
        back_populates="child_events",
        sa_relationship_kwargs={"remote_side": "Event.event_id"},
    )
    child_events: List["Event"] = Relationship(
        back_populates="parent_event",
        sa_relationship_kwargs={"overlaps": "parent_event"},
    )
    repeatable_event: "RepeatableEvent" | None = Relationship(
        back_populates="event",
    )

    item: "Item" = Relationship(
        back_populates="event",
    )
    calendar: "Calendar" = Relationship(
        back_populates="events",
    )

    translations: List["EventTranslation"] = Relationship(
        back_populates="event",
    )
    notifications: "Notifications" = Relationship(
        back_populates="event",
    )
    discord_messages: "DiscordMessages" = Relationship(
        back_populates="events",
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


class EventTranslation(SQLModel, table=True):
    __tablename__ = "event_translation"

    event_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    description: str
    main_image_url: str | None
    sub_image_urls: list[str] | None = []

    # Foreign keys
    event_id: uuid.UUID = Field(
        foreign_key="event.event_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationships
    event = Relationship(
        back_populates="translations",
    )
    language = Relationship(
        back_populates="event_translations",
    )

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


class RepeatableEvent(SQLModel, table=True):
    __tablename__ = "repeatable_event"

    repeatable_event_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    frequency: Frequency = Frequency.WEEKLY  # Frequency of the repeatable event
    interval: int = 1  # Every x days, weeks, months, years
    end_date: datetime | None = None  # End of the repeatable
    max_occurrences: int | None = None  # Number of times to repeat
    repeat_forever: bool = False  # Repeat forever

    # Foreign keys
    event_id: uuid.UUID = Field(
        foreign_key="event.event_id",
        unique=True,
    )

    # Relationships
    event: "Event" = Relationship(
        back_populates="repeatable_event",
    )
