import enum
from utility.database import db
from sqlalchemy import String, Integer, Column, ForeignKey, Enum, Boolean
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation

class CommitteePositionsRole(enum.Enum):
    ADMIN = 1
    BOARD = 2
    COMMITTEE = 3


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

    def __repr__(self):
        return '<CommitteePosition %r>' % self.committee_position_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: CommitteePositionTranslation | None = get_translation(
            CommitteePositionTranslation,
            ['committee_position_id'],
            {'committee_position_id': self.committee_position_id},
            language_code
        )

        data = {c.name: getattr(self, c.name).value if isinstance(getattr(self, c.name), enum.Enum) else getattr(self, c.name)
                for c in self.__table__.columns}
        data['translation'] = translation.to_dict() if translation else {}

        if is_public_route:
            del data['weight']
            del data['role']
            del data['active']

        return data

committee_position_resource = db.Table(
    'committee_position_resource', db.Model.metadata,
    Column('committee_position_id', Integer, ForeignKey('committee_position.committee_position_id')),
    Column('resource_id', Integer, ForeignKey('resource.resource_id'))
)

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

    def __repr__(self):
        return '<CommitteePositionTranslation %r>' % self.committee_position_translation_id

    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
