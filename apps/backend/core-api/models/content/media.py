import enum
import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import inspect
from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

if TYPE_CHECKING:
    from models.content.album import Album
    from models.content.base import Item
    from models.core.language import Language


class MediaType(enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class Media(Item):
    """
    Album model which inherits from the base Item model

    Attributes:
        album_id: Primary key
        media_urls: List of media URLs (images, videos, etc.)
    """

    media_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    media_url: str
    media_type: MediaType = MediaType.IMAGE

    # Foreign keys
    item_id: uuid.UUID = Field(foreign_key="item.item_id")
    album_id: uuid.UUID | None = Field(
        foreign_key="album.album_id",
    )

    # Relationships
    item: "Item" = Relationship(
        back_populates="media",
    )
    album: "Album" | None = Relationship(
        back_populates="media",
    )
    translations: list["MediaTranslation"] = Relationship(
        back_populates="media",
    )

    __mapper_args__ = {"polymorphic_identity": "media"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
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
            translation: MediaTranslation | None = translation_lookup.get(language_code)

            if not translation or not isinstance(translation, MediaTranslation):
                translation: MediaTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, MediaTranslation):
                translations.append(translation.to_dict())

        data["translations"] = translations

        del data["media_id"]

        data["media_url"] = self.media_url

        return data


class MediaTranslation(SQLModel, table=True):
    __tablename__ = "media_translation"

    media_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    description: str | None = None

    # Foreign keys
    media_id: uuid.UUID = Field(
        foreign_key="media.media_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationships
    media: "Media" = Relationship(
        back_populates="translations",
    )
    language: "Language" = Relationship(
        back_populates="media_translations",
    )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["media_translation_id"]
        del data["media_id"]

        return data
