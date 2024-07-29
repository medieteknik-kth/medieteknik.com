import enum
import uuid
from typing import Any, Dict, List
from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    String,
    Enum,
    ForeignKey,
    Boolean,
    func,
)
from sqlalchemy.inspection import inspect
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db
from datetime import datetime, timezone
from .author import Author


class PublishedStatus(enum.Enum):
    """
    Represents the availability status of an item.

    Attributes:
        DRAFT: The item is not published, only accessible by the author
        PUBLISHED: The item is published, accessible by everyone
    """

    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"


class Item(db.Model):
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

    item_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    created_at = Column(DateTime, default=func.now(), server_default=func.now())
    last_updated = Column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )
    categories = Column(ARRAY(String), default=[])
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=False, nullable=False)
    published_status = Column(
        Enum(PublishedStatus), default=PublishedStatus.DRAFT, nullable=False
    )
    url = Column(String(length=512), nullable=True, index=True)

    # Foreign keys
    author_id = Column(UUID(as_uuid=True), ForeignKey("author.author_id"))

    # Relationships
    author = db.relationship("Author", back_populates="items")
    news = db.relationship("News", back_populates="item")
    event = db.relationship("Event", back_populates="item")
    document = db.relationship("Document", back_populates="item")
    album = db.relationship("Album", back_populates="item")

    # Polymorphism
    type = Column(String(50))
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

        author_data = Author.query.filter_by(author_id=self.author_id).first()

        if author_data and isinstance(author_data, Author):
            corrected_author_dict = author_data.retrieve_author().to_dict()

            if not corrected_author_dict:
                return None

            corrected_author_dict["author_type"] = author_data.author_type.value
            data["author"] = corrected_author_dict
        else:
            data["author"] = {}

        del data["item_id"]
        del data["author_id"]

        return data
