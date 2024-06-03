from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation
from utility.database import db
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import ARRAY
from models.content.base import Item
from models.content.base import Item

class News(Item):
    """
    News model which inherits from the base Item model.

    Attributes:
        news_id: Primary key
    """
    news_id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign keys
    item_id = Column(Integer, ForeignKey('item.item_id'))

    # Relationships
    item = db.relationship('Item', backref='news')

    __mapper_args__ = {
        'polymorphic_identity': 'news'
    }

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: NewsTranslation | None = get_translation(
            NewsTranslation,
            ['news_id'],
            {'news_id': self.news_id},
            language_code
        )
        base_data = super().to_dict(is_public_route)
        
        del base_data['news_id']

        base_data['translation'] = translation.to_dict() if translation else {}

        return base_data

class NewsTranslation(db.Model):
    __tablename__ = 'news_translation'

    news_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    body = Column(String(100_000))
    short_description = Column(String(255))
    main_image_url = Column(String(255))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    news_id = Column(Integer, ForeignKey('news.news_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    news = db.relationship('News', backref='translation')
    language = db.relationship('Language', backref='news_translation')

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        del data['news_translation_id']
        del data['news_id']

        return data
