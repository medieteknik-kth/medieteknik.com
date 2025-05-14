import enum
import uuid
from typing import List

from sqlmodel import Field, Relationship, SQLModel


class TagCategory(enum.Enum):
    NEWS = "NEWS"
    EVENTS = "EVENTS"
    DOCUMENTS = "DOCUMENTS"


class Tag(SQLModel, table=True):
    __tablename__ = "tag"

    tag_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    color: str = Field(
        max_length=7,
        default="#EEC912",
    )
    category: TagCategory = TagCategory.NEWS

    # Relationships
    translations: List["TagTranslation"] = Relationship(
        back_populates="tag",
        cascade_delete=True,
    )


class TagTranslation(SQLModel, table=True):
    __tablename__ = "tag_translation"

    tag_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str = Field(max_length=255)

    # Foreign keys
    tag_id: uuid.UUID = Field(
        foreign_key="tag.tag_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationships
    tag = Relationship(
        back_populates="translations",
    )
    language = Relationship(
        back_populates="tag_translations",
    )
