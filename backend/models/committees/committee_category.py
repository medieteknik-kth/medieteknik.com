from utility.database import db
from sqlalchemy import String, Integer, Column, ForeignKey
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation

class CommitteeCategory(db.Model):
    __tablename__ = 'committee_category'
    committee_category_id = Column(
        Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True, nullable=True)

    def __repr__(self):
        return '<CommitteeCategory %r>' % self.committee_category_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE):
        translation: CommitteeCategoryTranslation | None = get_translation(
            CommitteeCategoryTranslation,
            ['committee_category_id'],
            {'committee_category_id': self.committee_category_id},
            language_code
        )

        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        data['translation'] = translation.to_dict() if translation else {}

        return data

class CommitteeCategoryTranslation(db.Model):
    __tablename__ = 'committee_category_translation'
    committee_category_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))

    # Foreign key
    committee_category_id = Column(Integer, ForeignKey(
        'committee_category.committee_category_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationship
    committee_category = db.relationship(
        'CommitteeCategory', backref='committee_category_translations')
    language = db.relationship(
        'Language', backref='committee_category_translations')

    def __repr__(self):
        return '<CommitteeCategoryTranslation %r>' % self.committee_category_translation_id

    def to_dict(self):
        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        del data['committee_category_translation_id']
        del data['committee_category_id']
        del data['language_code']

        return data
