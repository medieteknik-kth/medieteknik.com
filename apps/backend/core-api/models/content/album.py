import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, List

from sqlalchemy import (
    inspect,
)
from sqlmodel import Field, Relationship, SQLModel

from models.content.media import Media
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

if TYPE_CHECKING:
    from models.core.language import Language


class Album(SQLModel, table=True):
    __tablename__ = "album"

    album_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    total_images: int = 0
    total_videos: int = 0
    preview_media_id: uuid.UUID
    updated_at: datetime = Field(default_factory=datetime.now(tz=timezone.utc))

    # Relationships
    translations: list["AlbumTranslation"] = Relationship(
        back_populates="album",
        cascade_delete=True,
    )
    media: list["Media"] = Relationship(
        back_populates="album",
    )

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        data = {}
        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: AlbumTranslation | None = translation_lookup.get(language_code)

            if not translation or not isinstance(translation, AlbumTranslation):
                translation: AlbumTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, AlbumTranslation):
                translations.append(translation.to_dict())

        data["translations"] = translations
        data["album_id"] = self.album_id
        data["total_images"] = self.total_images
        data["total_videos"] = self.total_videos
        data["updated_at"] = self.updated_at

        if self.preview_media_id:
            media: Media | None = Media.query.filter_by(
                media_id=self.preview_media_id
            ).first()

            if not media:
                data["preview_media"] = None
            else:
                data["preview_media"] = media.to_dict(
                    provided_languages=provided_languages
                )

        return data


class AlbumTranslation(SQLModel, table=True):
    __tablename__ = "album_translation"

    album_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    description: str

    # Foreign keys
    album_id: uuid.UUID = Field(
        foreign_key="album.album_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
        default=DEFAULT_LANGUAGE_CODE,
    )

    # Relationships
    album: "Album" = Relationship(
        back_populates="translations",
    )
    language: "Language" = Relationship(
        back_populates="album_translations",
    )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["album_translation_id"]
        del data["album_id"]

        return data
