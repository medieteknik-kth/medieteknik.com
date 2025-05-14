import enum
import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item

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
