import enum
import uuid
from typing import TYPE_CHECKING, Any, Dict, List

from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import CheckConstraint, Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES

if TYPE_CHECKING:
    from models.committees import Committee, CommitteePosition
    from models.content.base import Item
    from models.core.student import Student


class AuthorType(enum.Enum):
    """
    What type of author is this

    Attributes:
        STUDENT: The author is a student
        COMMITTEE: The author is a committee
        COMMITTEE_POSITION: The author is a committee position
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


class Author(SQLModel, table=True):
    """
    Author model.

    Attributes:
        author_id: Primary key
        resources: List of resources the author has access to
        student_id: Foreign key to student table
        committee_id: Foreign key to committee table
        committee_position_id: Foreign key to committee_position table
        author_type: Hybrid property that returns what type of author is this

    Relationships:
        student: Student
        committee: Committee
        committee_position: CommitteePosition

    Constraints:
        at_most_one_author: Only one of student_id, committee_id, committee_position_id can be set.

    Methods:
        to_dict(provided_languages: List[str] = AVAILABLE_LANGUAGES): Converts the model to a dictionary
    """

    __tablename__ = "author"

    author_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    resources: list[AuthorResource]

    # Foreign keys
    student_id: uuid.UUID | None = Field(
        foreign_key="student.student_id",
        default=None,
        nullable=True,
        unique=True,
    )

    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        default=None,
        nullable=True,
        unique=True,
    )

    committee_position_id: uuid.UUID | None = Field(
        foreign_key="committee_position.committee_position_id",
        default=None,
        nullable=True,
        unique=True,
    )

    __table_args__ = (
        CheckConstraint(
            sqltext="num_nonnulls(student_id, committee_id, committee_position_id) = 1",
            name="at_most_one_author",
        ),
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="author",
    )
    committee: "Committee" = Relationship(
        back_populates="author",
    )

    committee_position: "CommitteePosition" = Relationship(
        back_populates="author",
    )

    items: list["Item"] = Relationship(
        back_populates="author",
    )

    @hybrid_property
    def author_type(self) -> AuthorType | None:
        if self.student_id:
            return AuthorType.STUDENT
        if self.committee_id:
            return AuthorType.COMMITTEE
        if self.committee_position_id:
            return AuthorType.COMMITTEE_POSITION
        return None

    @author_type.expression
    def author_type(cls):
        return case(
            (cls.student_id.isnot(None), AuthorType.STUDENT.value),
            (cls.committee_id.isnot(None), AuthorType.COMMITTEE.value),
            (
                cls.committee_position_id.isnot(None),
                AuthorType.COMMITTEE_POSITION.value,
            ),
            else_=None,
        )

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ) -> Dict[str, Any] | None:
        """
        Returns a dictionary representation of the model.

        Returns:
            Dict[str, Any] | None: A dictionary containing the model's attributes.
        """

        author_data = {}
        if self.author_type == AuthorType.STUDENT and self.student:
            author_data = self.student.to_dict(is_public_route=is_public_route)
        elif self.author_type == AuthorType.COMMITTEE and self.committee:
            author_data = self.committee.to_dict(provided_languages=provided_languages)
        elif (
            self.author_type == AuthorType.COMMITTEE_POSITION
            and self.committee_position
        ):
            author_data = self.committee_position.to_dict(
                provided_languages=provided_languages,
                is_public_route=is_public_route,
                include_parent=True,
            )

        author_data["author_type"] = (
            self.author_type.value if self.author_type else None
        )

        return author_data
