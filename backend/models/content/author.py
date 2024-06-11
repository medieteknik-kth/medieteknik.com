import enum
from utility.database import db
from sqlalchemy import Column, Integer, Enum
from sqlalchemy.dialects.postgresql import ARRAY
from models.core import Student
from models.committees import Committee, CommitteePosition

class AuthorType(enum.Enum):
    """
    The types of potential authors

    Attributes:
        STUDENT: The author is a student (Only the student has access to the content)
        COMMITTEE: The author is a committee (All committee members have access to the content)
        COMMITTEE_POSITION: The author is a committee position (All committee members have access to the content)
    """
    STUDENT = 'STUDENT'
    COMMITTEE = 'COMMITTEE'
    COMMITTEE_POSITION = 'COMMITTEE_POSITION'

class AuthorResource(enum.Enum):
    """
    What resource the author has access to

    Attributes:
        NEWS: The author has access to news
        EVENT: The author has access to events
        DOCUMENT: The author has access to documents
        ALBUM: The author has access to albums
    """
    NEWS = 'NEWS'
    EVENT = 'EVENT'
    DOCUMENT = 'DOCUMENT'
    ALBUM = 'ALBUM'

class Author(db.Model):
    """
    Author model.

    Entities will have author rights, 
    """
    __tablename__ = 'author'

    author_id = Column(Integer, primary_key=True, autoincrement=True)

    author_type = Column(Enum(AuthorType), nullable=False)
    entity_id = Column(Integer, nullable=False, index=True)
    resources = Column(ARRAY(Enum(AuthorResource, create_constraint=False, native_enum=False)))

    def to_dict(self):
        data = {c.name: getattr(self, c.name).value if isinstance(getattr(self, c.name), enum.Enum) else 
                list(map(lambda x: x.value if isinstance(x, enum.Enum) else x, getattr(self, c.name))) if isinstance(getattr(self, c.name), list) else
                getattr(self, c.name) for c in self.__table__.columns}
        
        del data['author_id']

        return data

    def retrieve_author(self) -> Student | Committee | CommitteePosition: 
        author_class = {
            AuthorType.STUDENT: Student,
            AuthorType.COMMITTEE: Committee,
            AuthorType.COMMITTEE_POSITION: CommitteePosition
        }.get(self.author_type)

        if author_class:
            return author_class.query.get(self.entity_id)
        else:
            raise ValueError('Author type not found')
