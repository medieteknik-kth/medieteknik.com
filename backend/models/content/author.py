import enum
from typing import Any, Dict, List
from sqlalchemy import Column, Integer, Enum, inspect
from sqlalchemy.dialects.postgresql import ARRAY
from utility.database import db
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

    STUDENT = "STUDENT"
    COMMITTEE = "COMMITTEE"
    COMMITTEE_POSITION = "COMMITTEE_POSITION"


class AuthorResource(enum.Enum):
    """
    What resource the author has access to

    Attributes:
        NEWS: The author has access to news
        EVENT: The author has access to events
        DOCUMENT: The author has access to documents
        ALBUM: The author has access to albums
    """

    NEWS = "NEWS"
    EVENT = "EVENT"
    DOCUMENT = "DOCUMENT"
    ALBUM = "ALBUM"


class Author(db.Model):
    """
    Author model.

    Entities will have author rights,
    """

    __tablename__ = "author"

    author_id = Column(Integer, primary_key=True, autoincrement=True)

    author_type = Column(Enum(AuthorType), nullable=False)
    entity_id = Column(Integer, nullable=False, index=True)
    resources = Column(
        ARRAY(Enum(AuthorResource, create_constraint=False, native_enum=False))
    )

    def to_dict(self) -> Dict[str, Any] | None:
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}

        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            elif isinstance(value, List):
                value = [v.value if isinstance(v, enum.Enum) else v for v in value]

            data[column] = value

        if not data:
            return {}

        del data["author_id"]

        return data

    def retrieve_author(self) -> Student | Committee | CommitteePosition:
        if not self.author_type not in [
            AuthorType.STUDENT.value,
            AuthorType.COMMITTEE.value,
            AuthorType.COMMITTEE_POSITION.value,
        ]:
            raise ValueError("Author type is not set")
        corrected_author = None
        if self.author_type is AuthorType.STUDENT:
            corrected_author = Student.query.get(self.entity_id)
            if not corrected_author:
                raise ValueError("Invalid student id")

        elif self.author_type is AuthorType.COMMITTEE:
            corrected_author = Committee.query.get(self.entity_id)

            if not corrected_author:
                raise ValueError("Invalid committee id")
        elif self.author_type is AuthorType.COMMITTEE_POSITION:
            corrected_author = CommitteePosition.query.get(self.entity_id)

            if not corrected_author:
                raise ValueError("Invalid committee position id")

        if not corrected_author:
            raise ValueError("Invalid author type")

        return corrected_author
