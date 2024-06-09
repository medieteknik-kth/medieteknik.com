import enum
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation
from utility.database import db
from sqlalchemy import Column, Enum, ForeignKey, Integer, String

class TagCategory(enum.Enum):
    NEWS = 'NEWS'
    EVENTS = 'EVENTS'
    DOCUMENTS = 'DOCUMENTS'


class Tag(db.Model):
    __tablename__ = 'tags'

    tag_id = Column(Integer, primary_key=True)

    color = Column(String(7))
    category = Column(Enum(TagCategory), nullable=False, default=TagCategory.NEWS)

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE):
        translation: TagTranslation | None = get_translation(
            TagTranslation,
            ['tag_id'],
            {'tag_id': self.tag_id},
            language_code
        )
        data = {c.name: getattr(self, c.name).value if isinstance(getattr(self, c.name), enum.Enum) else getattr(self, c.name)
                for c in self.__table__.columns}

        del data['tag_id']
        data['translation'] = translation.to_dict() if translation else {}

        return data


class TagTranslation(db.Model):
    __tablename__ = 'tag_translation'

    tag_translation_id = Column(Integer, primary_key=True)

    title = Column(String(255))

    # Foreign keys
    tag_id = Column(Integer, ForeignKey('tags.tag_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    tag = db.relationship('Tag', backref='translation')
    language = db.relationship('Language', backref='tag_translation')

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        del data['tag_translation_id']
        del data['tag_id']
        del data['language_code']

        return data
