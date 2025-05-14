import enum
import uuid
from typing import List

from sqlalchemy import inspect
from sqlmodel import Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


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

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
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

        if not data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                TagTranslation, ["tag_id"], {"tag_id": self.tag_id}, language_code
            )
            translations.append(translation)

        data["translations"] = [translation.to_dict() for translation in translations]

        del data["tag_id"]

        return data


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

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["tag_translation_id"]
        del data["tag_id"]
        del data["language_code"]

        return data
