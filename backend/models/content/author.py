import enum
from typing import Any, Dict, List
import uuid
from sqlalchemy import Column, Integer, Enum, UniqueConstraint, func, inspect, text
from sqlalchemy.dialects.postgresql import ARRAY, UUID
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

    author_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    author_type = Column(Enum(AuthorType), nullable=False)
    entity_id = Column(Integer, nullable=False, index=True)
    resources = Column(
        ARRAY(Enum(AuthorResource, create_constraint=False, native_enum=False))
    )

    __table_args__ = (
        UniqueConstraint("author_type", "entity_id", name="uq_author_type_entity"),
    )

    # Relationships
    items = db.relationship("Item", back_populates="author")

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
        if self.author_type not in AuthorType:
            raise ValueError("Author type is not set")

        author_map = {
            AuthorType.STUDENT: Student,
            AuthorType.COMMITTEE: Committee,
            AuthorType.COMMITTEE_POSITION: CommitteePosition,
        }

        author_class = author_map.get(AuthorType(self.author_type))

        if not author_class:
            raise ValueError(f"Unsupported author type: {self.author_type}")

        author = author_class.query.get(self.entity_id)
        if not author:
            raise ValueError(f"Invalid {self.author_type.value.lower()} id")

        return author
