import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict, List

from sqlmodel import Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES

if TYPE_CHECKING:
    from models.content.document import Document
    from models.content.event import Event
    from models.content.media import Media
    from models.content.news import News
    from models.core.author import Author


class PublishedStatus(enum.Enum):
    """
    Represents the availability status of an item.

    Attributes:
        DRAFT: The item is not published, only accessible by the author
        PUBLISHED: The item is published, accessible by everyone
    """

    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Item(SQLModel, table=True):
    """
    Represents a generic item, meant for user-generated content e.g. news.

    Attributes:
        item_id: Primary key
        created_at: When the item was created
        last_updated: When the item was last updated
        categories: List of categories that the item belongs to
        is_pinned: Whether the item is pinned
        is_public: Whether the item is public
        published_status: The status of the item
        url: The URL of the item
        author_id: The author of the item
        type: Discriminator column for SQLAlchemy inheritance

    """

    __tablename__ = "item"

    item_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    created_at: datetime = Field(default_factory=datetime.now(tz=timezone.utc))
    last_updated: datetime

    categories: list[str] = []
    is_pinned: bool = False
    is_public: bool = False
    published_status: PublishedStatus = PublishedStatus.DRAFT

    # Foreign keys
    author_id: uuid.UUID = Field(
        foreign_key="author.author_id",
    )

    # Relationships
    author: "Author" = Relationship(
        back_populates="items",
    )
    news: "News" = Relationship(
        back_populates="item",
    )
    event: "Event" = Relationship(
        back_populates="item",
    )
    document: "Document" = Relationship(
        back_populates="item",
    )
    media: "Media" = Relationship(
        back_populates="item",
    )

    # Polymorphism
    type: str
    __mapper_args__ = {"polymorphic_identity": "item", "polymorphic_on": type}

    def __repr__(self) -> str:
        return f"<Item {self.item_id}, {self.type}>"

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ) -> Dict[str, Any] | None:
        if not self.is_public is not None and self.is_public and is_public_route:
            return None

        if is_public_route:
            if (
                self.published_status is not None
                and self.published_status is PublishedStatus.DRAFT
            ):
                return None

        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            data[column] = value

        data["author"] = (
            self.author.to_dict(
                provided_languages=provided_languages, is_public_route=is_public_route
            )
            if self.author
            else {}
        )

        del data["item_id"]
        del data["author_id"]

        return data
