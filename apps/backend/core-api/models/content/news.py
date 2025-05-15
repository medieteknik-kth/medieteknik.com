import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item

if TYPE_CHECKING:
    from models.core.language import Language
    from models.core.notifications import Notifications
    from models.utility.discord import DiscordMessages


class News(Item):
    """
    News model which inherits from the base Item model.

    Attributes:
        news_id: Primary key
    """

    news_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    url: str | None = Field(
        default=None,
        max_length=512,
        index=True,
    )

    # Foreign keys
    item_id: uuid.UUID = Field(
        foreign_key="item.item_id",
    )

    # Relationships
    item: "Item" = Relationship(back_populates="news")
    translations: list["NewsTranslation"] = Relationship(
        back_populates="news", sa_relationship_kwargs={"lazy": "selectin"}
    )

    notifications: "Notifications" = Relationship(
        back_populates="news",
    )

    discord_messages: "DiscordMessages" = Relationship(
        back_populates="news",
    )

    __mapper_args__ = {"polymorphic_identity": "news"}


class NewsTranslation(SQLModel, table=True):
    __tablename__ = "news_translation"

    news_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    body: str
    short_description: str = Field(
        max_length=255,
    )
    main_image_url: str | None
    sub_image_urls: list[str] | None

    # Foreign keys
    news_id: uuid.UUID = Field(
        foreign_key="news.news_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationships
    news: "News" = Relationship(back_populates="translations")
    language: "Language" = Relationship(back_populates="news_translations")
