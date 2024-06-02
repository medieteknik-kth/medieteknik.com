from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, ForeignKey, Integer, String

class Document(Item):
    """
    Document model which inherits from the base Item model.

    Attributes:
        document_id: Primary key
    """
    document_id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign keys
    item_id = Column(Integer, ForeignKey('item.item_id'))

    # Relationships
    item = db.relationship('Item', backref='document')

    __mapper_args__ = {
        'polymorphic_identity': 'document'
    }

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: DocumentTranslation | None = get_translation(
            DocumentTranslation,
            ['document_id'],
            {'document_id': self.document_id},
            language_code
        )
        base_data = super().to_dict(is_public_route)
        base_data['translation'] = translation if translation else {}

        return base_data


class DocumentTranslation(db.Model):
    __tablename__ = 'document_translation'

    document_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    categories = Column(ARRAY(String))

    # Foreign keys
    document_id = Column(Integer, ForeignKey('document.document_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    document = db.relationship('Document', backref='translation')
    language = db.relationship('Language', backref='document_translation')

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
