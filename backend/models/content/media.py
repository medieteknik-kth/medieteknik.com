import enum
from typing import List
import uuid
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy import Column, Enum, ForeignKey, Integer, String, inspect
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item


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

    media_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    media_url = Column(String(512), nullable=False)
    media_type = Column(Enum(MediaType), default=MediaType.IMAGE, nullable=False)

    # Foreign keys
    item_id = Column(UUID(as_uuid=True), ForeignKey("item.item_id"))
    album_id = Column(UUID(as_uuid=True), ForeignKey("album.album_id"), nullable=True)

    # Relationships
    item = db.relationship("Item", back_populates="media")
    album = db.relationship("Album", back_populates="media")
    translations = db.relationship("MediaTranslation", back_populates="media")

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

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                MediaTranslation,
                ["media_id"],
                {"media_id": self.media_id},
                language_code,
            )
            translations.append(translation)

        data["translations"] = [translation.to_dict() for translation in translations]

        del data["media_id"]

        data["media_url"] = self.media_url

        return data


class MediaTranslation(db.Model):
    __tablename__ = "media_translation"

    media_translation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = Column(String(255))
    description = Column(String(2500))

    # Foreign keys
    media_id = Column(UUID(as_uuid=True), ForeignKey("media.media_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    media = db.relationship("Media", back_populates="translations")
    language = db.relationship("Language", back_populates="media_translations")

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
