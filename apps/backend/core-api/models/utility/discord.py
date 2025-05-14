import uuid

from sqlalchemy import event
from sqlmodel import Field, Relationship, SQLModel

from models.content.event import Event
from models.content.news import News


class DiscordMessages(SQLModel, table=True):
    __tablename__ = "discord_messages"

    id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    message_id: str = Field(index=True)

    # Foreign keys
    news_id: uuid.UUID | None = Field(
        foreign_key="news.news_id",
    )
    event_id: uuid.UUID | None = Field(
        foreign_key="event.event_id",
    )

    # Relationships
    news: "News" | None = Relationship(
        back_populates="discord_messages",
    )
    events: "Event" | None = Relationship(
        back_populates="discord_messages",
    )

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
