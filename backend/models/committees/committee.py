from utility.database import db
from sqlalchemy import String, Integer, Column, ForeignKey
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation

class Committee(db.Model):
    __tablename__ = 'committee'
    committee_id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True)
    logo_url = Column(String(255))

    # Foreign key
    committee_category_id = Column(Integer, ForeignKey(
        'committee_category.committee_category_id'))

    # Relationship
    committee_category = db.relationship(
        'CommitteeCategory', backref='committees')

    def __repr__(self):
        return '<Committee %r>' % self.committee_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE):
        translation: CommitteeTranslation | None = get_translation(
            CommitteeTranslation,
            ['committee_id'],
            {'committee_id': self.committee_id},
            language_code
        )

        data = {c.name: getattr(self, c.name) for c in self.__table__.columns}

        data['translation'] = translation.to_dict() if translation else {}

        return data

class CommitteeTranslation(db.Model):
    __tablename__ = 'committee_translation'

    committee_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(255))

    # Foreign keys
    committee_id = Column(Integer, ForeignKey('committee.committee_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationship
    committee = db.relationship('Committee', backref='committee_translations')
    language = db.relationship('Language', backref='committee_translations')

    def __repr__(self):
        return '<CommitteeTranslation %r>' % self.committee_translation_id

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
