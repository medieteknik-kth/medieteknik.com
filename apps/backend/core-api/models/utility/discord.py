import uuid
from sqlalchemy import UUID, Column, String, text, ForeignKey, event
from models.content.event import Event
from models.content.news import News
from utility.database import db


class DiscordMessages(db.Model):
    __tablename__ = "discord_messages"

    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    message_id = Column(
        String,
        nullable=False,
        index=True,
    )

    # Foreign keys
    news_id = Column(
        UUID(as_uuid=True),
        ForeignKey("news.news_id"),
        nullable=True,
    )

    event_id = Column(
        UUID(as_uuid=True),
        ForeignKey("event.event_id"),
        nullable=True,
    )

    # Relationships
    news = db.relationship("News", back_populates="discord_messages")
    events = db.relationship("Event", back_populates="discord_messages")

    @event.listens_for(News, "before_delete")
    def before_delete_news(mapper, connection, target):
        from services.utility.discord import delete_discord_message

        for message in target.discord_messages:
            delete_discord_message(message_id=message.message_id)

    @event.listens_for(Event, "before_delete")
    def before_delete_event(mapper, connection, target):
        from services.utility.discord import delete_discord_message

        for message in target.discord_messages:
            delete_discord_message(message_id=message.message_id)
