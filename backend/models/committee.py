import enum
from utility import database
from sqlalchemy import String, Integer, Column, ForeignKey, Enum, Boolean
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation

db = database.db

class CommitteePositionsRole(enum.Enum):
    ADMIN = 1
    BOARD = 2
    COMMITTEE = 3

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
        return {
            'committee_category_id': self.committee_category_id,
            'title': translation.title if translation else 'Error: No translation found',
        }

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

    def __init__(self, committee_category_id, email, logo_url):
        self.committee_category_id = committee_category_id
        self.email = email
        self.logo_url = logo_url

    def __repr__(self):
        return '<Committee %r>' % self.committee_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE):
        translation: CommitteeTranslation | None = get_translation(
            CommitteeTranslation,
            ['committee_id'],
            {'committee_id': self.committee_id},
            language_code
        )

        return {
            'committee_id': self.committee_id,
            'committee_category_id': self.committee_category_id,
            'email': self.email,
            'logo_url': self.logo_url,
            'title': translation.title if translation else 'Error: No translation found',
            'description': translation.description if translation else 'Error: No translation found',
        }

class CommitteePosition(db.Model):
    __tablename__ = 'committee_position'
    committee_position_id = Column(
        Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True, nullable=False)
    weight = Column(Integer, default=0)
    role = Column(Enum(CommitteePositionsRole),
                  default=CommitteePositionsRole.COMMITTEE)
    active = Column(Boolean, default=True)

    # Foreign key
    committee_id = Column(
        Integer, ForeignKey('committee.committee_id'))

    # Relationship
    committee = db.relationship('Committee', backref='committee_positions')

    def __init__(self, committee_id, email, weight, role, active):
        self.committee_id = committee_id
        self.email = email
        self.weight = weight
        self.role: CommitteePositionsRole = role
        self.active = active

    def __repr__(self):
        return '<CommitteePosition %r>' % self.committee_position_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: CommitteePositionTranslation | None = get_translation(
            CommitteePositionTranslation,
            ['committee_position_id'],
            {'committee_position_id': self.committee_position_id},
            language_code
        )

        if is_public_route:
            return {
                'committee_position_id': self.committee_position_id,
                'email': self.email,
                'title': translation.title if translation else 'Error: No translation found',
                'description': translation.description if translation else 'Error: No translation found',
            }

        return {
            'committee_position_id': self.committee_position_id,
            'email': self.email,
            'weight': self.weight,
            'role': self.role.value if self.role else None,
            'active': self.active,
            'title': translation.title if translation else 'Error: No translation found',
            'description': translation.description if translation else 'Error: No translation found',
        }

# Translations
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

    def __init__(self, committee_category_id, title, language_code):
        self.committee_category_id = committee_category_id
        self.title = title
        self.language_code = language_code

    def __repr__(self):
        return '<CommitteeCategoryTranslation %r>' % self.committee_category_translation_id

    def to_dict(self):
        return {
            'committee_category_translation_id': self.committee_category_translation_id,
            'name': self.name,
            'committee_category_id': self.committee_category_id,
            'language_code': self.language_code
        }

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

    def __init__(self, committee_id, title, description, language_code):
        self.committee_id = committee_id
        self.title = title
        self.description = description
        self.language_code = language_code

    def __repr__(self):
        return '<CommitteeTranslation %r>' % self.committee_translation_id

    def to_dict(self):
        return {
            'committee_translation_id': self.committee_translation_id,
            'title': self.title,
            'description': self.description,
            'committee_id': self.committee_id,
            'language_code': self.language_code
        }

class CommitteePositionTranslation(db.Model):
    __tablename__ = 'committee_position_translation'

    committee_position_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(255))

    # Foreign keys
    committee_position_id = Column(Integer, ForeignKey(
        'committee_position.committee_position_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationship
    committee_position = db.relationship(
        'CommitteePosition', backref='committee_position_translations')
    language = db.relationship(
        'Language', backref='committee_position_translations')

    def __init__(self, committee_position_id, title, description, language_code):
        self.committee_position_id = committee_position_id
        self.title = title
        self.description = description
        self.language_code = language_code

    def __repr__(self):
        return '<CommitteePositionTranslation %r>' % self.committee_position_translation_id

    def to_dict(self):
        return {
            'committee_position_translation_id': self.committee_position_translation_id,
            'title': self.title,
            'description': self.description,
            'committee_position_id': self.committee_position_id,
            'language_code': self.language_code
        }
