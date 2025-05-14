import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import inspect
from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

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
    translations: list["NewsTranslation"] = Relationship(back_populates="news")

    notifications: "Notifications" = Relationship(
        back_populates="news",
    )

    discord_messages: "DiscordMessages" = Relationship(
        back_populates="news",
    )

    __mapper_args__ = {"polymorphic_identity": "news"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        base_data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

        if not base_data:
            return None

        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: NewsTranslation | None = translation_lookup.get(language_code)

            if not translation or not isinstance(translation, NewsTranslation):
                translation: NewsTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, NewsTranslation):
                translations.append(translation.to_dict())

        if is_public_route:
            del base_data["news_id"]

        base_data["translations"] = translations

        return base_data


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

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["news_translation_id"]
        del data["news_id"]

        return data
