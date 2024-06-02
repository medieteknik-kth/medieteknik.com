from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, ForeignKey, Integer, String

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
    item_id = Column(Integer, ForeignKey('item.item_id'))

    # Relationships
    item = db.relationship('Item', backref='album')

    __mapper_args__ = {
        'polymorphic_identity': 'album'
    }

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: AlbumTranslation | None = get_translation(
            AlbumTranslation,
            ['album_id'],
            {'album_id': self.album_id},
            language_code
        )
        base_data = super().to_dict(is_public_route)
        base_data['media_urls'] = self.media_urls

        base_data['translation'] = translation if translation else {}

        return base_data

class AlbumTranslation(db.Model):
    __tablename__ = 'album_translation'

    album_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(2500))

    # Foreign keys
    album_id = Column(Integer, ForeignKey('album.album_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    album = db.relationship('Album', backref='translation')
    language = db.relationship('Language', backref='album_translation')

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
