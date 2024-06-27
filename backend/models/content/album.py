from typing import List
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, ForeignKey, Integer, String, inspect
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item


class Album(Item):
    """
    Album model which inherits from the base Item model

    Attributes:
        album_id: Primary key
        media_urls: List of media URLs (images, videos, etc.)
    """

    album_id = Column(Integer, primary_key=True, autoincrement=True)

    media_urls = Column(ARRAY(String))

    # Foreign keys
    item_id = Column(Integer, ForeignKey("item.item_id"))

    # Relationships
    item = db.relationship("Item", back_populates="album")
    translations = db.relationship("AlbumTranslation", back_populates="album")

    __mapper_args__ = {"polymorphic_identity": "album"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        base_data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

        if not base_data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                AlbumTranslation,
                ["album_id"],
                {"album_id": self.album_id},
                language_code,
            )
            translations.append(translation)

        del base_data["album_id"]

        base_data["media_urls"] = self.media_urls
        base_data["translations"] = [
            translation.to_dict() for translation in translations
        ]

        return base_data


class AlbumTranslation(db.Model):
    __tablename__ = "album_translation"

    album_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(2500))

    # Foreign keys
    album_id = Column(Integer, ForeignKey("album.album_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    album = db.relationship("Album", back_populates="translations")
    language = db.relationship("Language", back_populates="album_translations")

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
