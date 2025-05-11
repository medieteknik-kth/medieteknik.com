import enum
import uuid
from typing import Any, Dict, List
from sqlalchemy import (
    TIMESTAMP,
    Boolean,
    Column,
    Enum,
    ForeignKey,
    String,
    func,
    text,
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE
from utility.database import db
from sqlalchemy.ext.hybrid import hybrid_property


class NotificationType(enum.Enum):
    ANNOUNCEMENT = "announcement"  # System notification, will send to everyone regardless of preferences
    UPDATE = "update"
    NEWS = "news"
    EVENT = "event"


class NotificationSubscription(db.Model):
    """Model notification subscriptions in the database."""

    __tablename__ = "notification_subscription"

    notification_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    endpoint = Column(String(), unique=True)
    p256dh = Column(String())
    auth = Column(String())

    # email = Column(Boolean, default=False) #TODO: Implement email notifications later, note that email is not device specific

    # Timestamps
    created_at = Column(TIMESTAMP, default=func.now(), server_default=text("now()"))

    # Foreign keys
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False,
        unique=False,
    )
    language_code = Column(
        String(20),
        ForeignKey("language.language_code"),
        nullable=False,
        unique=False,
    )

    # Relationships
    student = db.relationship("Student", back_populates="notification_subscriptions")
    language = db.relationship("Language", back_populates="notification_subscriptions")

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


class NotificationPreferences(db.Model):
    """
    Model for student notification preferences in the database. Will affect all new notifications for the student.
    """

    __tablename__ = "notification_preferences"

    notification_preferences_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    iana_timezone = Column(String(255), nullable=True)
    site_updates = Column(Boolean, default=True)
    committees = Column(
        JSONB, nullable=True
    )  # [ { "committee_id": "uuid", types: { "news": true, "events", false } } ]

    # Foreign keys
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False,
        unique=True,
    )

    # Relationships
    student = db.relationship("Student", back_populates="notification_preferences")

    def __repr__(self):
        return f"<NotificationPreferences {self.notification_preferences_id}>"

    def to_dict(self):
        return {
            "notification_preferences_id": self.notification_preferences_id,
            "student_id": self.student_id,
        }


class Notifications(db.Model):
    """
    Model for storing actual notifications in the database.
    """

    __tablename__ = "notifications"

    notification_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    created_at = Column(TIMESTAMP, default=func.now(), server_default=text("now()"))
    notification_type = Column(Enum(NotificationType), nullable=False)
    notification_metadata = Column(
        JSONB, nullable=True
    )  # Events start time, news source, etc.

    # Foreign keys
    committee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee.committee_id"),
        nullable=True,  # Should be system notification if null
        unique=False,
    )

    event_id = Column(
        UUID(as_uuid=True),
        ForeignKey("event.event_id"),
        nullable=True,
        unique=False,
    )

    news_id = Column(
        UUID(as_uuid=True),
        ForeignKey("news.news_id"),
        nullable=True,
        unique=False,
    )

    # Relationships
    committee = db.relationship("Committee", back_populates="notifications")
    event = db.relationship("Event", back_populates="notifications")
    news = db.relationship("News", back_populates="notifications")
    translations = db.relationship(
        "NotificationsTranslation",
        back_populates="notifications",
        lazy="joined",
        cascade="all, delete-orphan",
    )
    sent_notifications = db.relationship(
        "SentNotifications",
        back_populates="notification",
        lazy="joined",
        cascade="all, delete-orphan",
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


class NotificationsTranslation(db.Model):
    """
    Model for storing translations of notifications in the database.
    """

    __tablename__ = "notifications_translation"

    notification_translation_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    title = Column(String(100), nullable=False)
    body = Column(String(255), nullable=False)
    url = Column(String(255))

    # Foreign keys
    notification_id = Column(
        UUID(as_uuid=True),
        ForeignKey("notifications.notification_id"),
        nullable=False,
        unique=False,
    )
    language_code = Column(
        String(20),
        ForeignKey("language.language_code"),
        nullable=False,
        unique=False,
    )

    # Relationships
    notifications = db.relationship("Notifications", back_populates="translations")
    language = db.relationship("Language", back_populates="notifications_translation")

    def to_dict(self) -> Dict[str, Any]:
        return {
            "title": self.title,
            "body": self.body,
            "url": self.url,
        }


class SentNotifications(db.Model):
    __tablename__ = "sent_notifications"

    sent_notification_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    notification_id = Column(
        UUID(as_uuid=True),
        ForeignKey("notifications.notification_id"),
        nullable=False,
        unique=False,
    )

    # Relationships
    notification = db.relationship(
        "Notifications",
        back_populates="sent_notifications",
        lazy="joined",
    )
