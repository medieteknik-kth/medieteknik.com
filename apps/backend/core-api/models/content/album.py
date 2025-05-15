import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from models.content.media import Media
from utility.constants import DEFAULT_LANGUAGE_CODE

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
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    media: list["Media"] = Relationship(
        back_populates="album",
    )


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
