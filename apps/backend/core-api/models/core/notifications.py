import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict

from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import CheckConstraint, Field, Relationship, SQLModel

from models.core.language import Language
from utility.constants import DEFAULT_LANGUAGE_CODE

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
        CheckConstraint(
            "(endpoint IS NULL AND p256dh IS NULL AND auth IS NULL) OR "
            "(endpoint IS NOT NULL AND p256dh IS NOT NULL AND auth IS NOT NULL)",
            name="push_notification_fields_constraint",
        ),
    )

    def __repr__(self):
        return f"<Notification {self.notification_id}>"


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
