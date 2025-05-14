import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict, List

from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import Field, Relationship, SQLModel

from models.core.language import Language
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE
from utility.database import db

if TYPE_CHECKING:
    from models.committees import Committee
    from models.content.event import Event
    from models.content.news import News
    from models.core.language import Language
    from models.core.student import Student


class NotificationType(enum.Enum):
    ANNOUNCEMENT = "announcement"  # System notification, will send to everyone regardless of preferences
    UPDATE = "update"
    NEWS = "news"
    EVENT = "event"


class NotificationSubscription(SQLModel, table=True):
    """Model notification subscriptions in the database."""

    __tablename__ = "notification_subscription"

    notification_id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)

    endpoint: str = Field(unique=True)
    p256dh: str
    auth: str

    # email = Column(Boolean, default=False) #TODO: Implement email notifications later, note that email is not device specific

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    # Foreign keys
    student_id: uuid.UUID = Field(foreign_key="student.student_id", unique=False)
    language_code: str = Field(
        default=DEFAULT_LANGUAGE_CODE,
        foreign_key="language.language_code",
        unique=False,
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="notification_subscriptions",
    )
    language: "Language" = Relationship(
        back_populates="notification_subscriptions",
    )

    @hybrid_property
    def push_enabled(self):
        return all([self.endpoint, self.p256dh, self.auth])

    @push_enabled.expression
    def push_enabled(cls):
        return (
            (cls.endpoint.isnot(None))
            & (cls.p256dh.isnot(None))
            & (cls.auth.isnot(None))
        )

    __table_args__ = (
        db.CheckConstraint(
            "(endpoint IS NULL AND p256dh IS NULL AND auth IS NULL) OR "
            "(endpoint IS NOT NULL AND p256dh IS NOT NULL AND auth IS NOT NULL)",
            name="push_notification_fields_constraint",
        ),
    )

    def __repr__(self):
        return f"<Notification {self.notification_id}>"

    def to_dict(self):
        return {
            "notification_id": self.notification_id,
            "endpoint": self.endpoint,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "student_id": self.student_id,
        }


class NotificationPreferences(SQLModel, table=True):
    """
    Model for student notification preferences in the database. Will affect all new notifications for the student.
    """

    __tablename__ = "notification_preferences"

    notification_preferences_id: uuid.UUID = Field(
        primary_key=True, default_factory=uuid.uuid4
    )

    iana_timezone: str | None
    site_updates: bool = True
    committees: list[Dict[str, Any]] | None = (
        None  # [ { "committee_id": "uuid", types: { "news": true, "events", false } } ]
    )

    # Foreign keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
        nullable=False,
        unique=True,
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="notification_preferences",
    )

    def __repr__(self):
        return f"<NotificationPreferences {self.notification_preferences_id}>"

    def to_dict(self):
        return {
            "notification_preferences_id": self.notification_preferences_id,
            "student_id": self.student_id,
        }


class Notifications(SQLModel, table=True):
    """
    Model for storing actual notifications in the database.
    """

    __tablename__ = "notifications"

    notification_id: uuid.UUID = Field(primary_key=True, default_factory=uuid.uuid4)

    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    notification_type: NotificationType
    notification_metadata: Dict[str, Any] | None

    # Foreign keys
    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        default=True,  # Should be system notification if null
        unique=False,
    )

    event_id: uuid.UUID | None = Field(
        foreign_key="event.event_id",
        default=None,
        unique=False,
    )

    news_id: uuid.UUID | None = Field(
        foreign_key="news.news_id",
        default=None,
        unique=False,
    )

    # Relationships
    committee: "Committee" = Relationship(
        back_populates="notifications",
    )
    event: "Event" = Relationship(
        back_populates="notifications",
    )
    news: "News" = Relationship(
        back_populates="notifications",
    )
    translations: list["NotificationsTranslation"] = Relationship(
        back_populates="notifications",
        cascade_delete=True,
    )
    sent_notifications: list["SentNotifications"] = Relationship(
        back_populates="notification",
        cascade_delete=True,
    )

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES
    ) -> Dict[str, Any]:
        data = {}

        data["notification_id"] = self.notification_id
        data["created_at"] = self.created_at
        data["notification_type"] = self.notification_type.value

        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: NotificationsTranslation | None = translation_lookup.get(
                language_code
            )

            if not translation or not isinstance(translation, NotificationsTranslation):
                translation: NotificationsTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, NotificationsTranslation):
                translations.append(translation.to_dict())

        data["translations"] = translations
        committee = self.committee
        if committee:
            data["committee"] = committee.to_dict()

        if self.notification_metadata:
            data["metadata"] = self.notification_metadata

        return data


class NotificationsTranslation(SQLModel, table=True):
    """
    Model for storing translations of notifications in the database.
    """

    __tablename__ = "notifications_translation"

    notification_translation_id: uuid.UUID = Field(
        primary_key=True, default_factory=uuid.uuid4
    )

    title: str
    body: str
    url: str | None = None

    # Foreign keys
    notification_id: uuid.UUID = Field(
        foreign_key="notifications.notification_id",
        unique=False,
    )

    language_code: str = Field(
        default=DEFAULT_LANGUAGE_CODE,
        foreign_key="language.language_code",
        unique=False,
    )

    # Relationships
    notifications: list["Notifications"] = Relationship(back_populates="translations")
    language: "Language" = Relationship(back_populates="notifications_translation")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "body": self.body,
            "url": self.url,
        }


class SentNotifications(SQLModel, table=True):
    __tablename__ = "sent_notifications"

    sent_notification_id: uuid.UUID = Field(
        primary_key=True, default_factory=uuid.uuid4
    )

    # Foreign keys
    notification_id: uuid.UUID = Field(
        foreign_key="notification_subscription.notification_id",
        unique=False,
    )

    # Relationships
    notification: "Notifications" = Relationship(
        back_populates="sent_notifications",
    )
