from typing import List
import uuid
from sqlalchemy.dialects.postgresql import TIMESTAMP
from sqlalchemy import (
    UUID,
    Column,
    ForeignKey,
    Integer,
    String,
    func,
    inspect,
    text,
)
from models.content.media import Media
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db
from utility.translation import get_translation


class Album(db.Model):
    __tablename__ = "album"

    album_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    total_photos = Column(Integer, default=0)
    total_videos = Column(Integer, default=0)
    preview_media_id = Column(UUID(as_uuid=True))
    updated_at = Column(TIMESTAMP, default=func.now(), server_default=text("now()"))

    # Relationships
    translations = db.relationship("AlbumTranslation", back_populates="album")
    media = db.relationship("Media", back_populates="album", passive_deletes=True)

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        data = {}
        translations: List[AlbumTranslation] = []

        for language_code in provided_languages:
            translation = get_translation(
                AlbumTranslation,
                ["album_id"],
                {"album_id": self.album_id},
                language_code,
            )
            translations.append(translation)

        data["translations"] = [translation.to_dict() for translation in translations]
        data["album_id"] = self.album_id
        data["total_photos"] = self.total_photos
        data["total_videos"] = self.total_videos
        data["updated_at"] = self.updated_at

        if self.preview_media_id:
            media: Media | None = Media.query.filter_by(
                media_id=self.preview_media_id
            ).first()

            if not media:
                data["preview_media"] = None

            data["preview_media"] = media.to_dict(provided_languages=provided_languages)

        return data


class AlbumTranslation(db.Model):
    __tablename__ = "album_translation"

    album_translation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = Column(String(255))
    description = Column(String(512))

    # Foreign keys
    album_id = Column(UUID(as_uuid=True), ForeignKey("album.album_id"))
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
