import uuid
from typing import TYPE_CHECKING, List

from sqlmodel import Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation

if TYPE_CHECKING:
    from models.committees.committee import Committee
    from models.core.language import Language


class CommitteeCategory(SQLModel, table=True):
    __tablename__ = "committee_category"

    committee_category_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    email: str | None = Field(
        unique=True,
    )

    # Relationships
    translations: list["CommitteeCategoryTranslation"] = Relationship(
        back_populates="committee_category",
    )
    committees: list["Committee"] = Relationship(
        back_populates="committee_category",
    )

    def __repr__(self):
        return "<CommitteeCategory %r>" % self.committee_category_id

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                CommitteeCategoryTranslation,
                ["committee_category_id"],
                {"committee_category_id": self.committee_category_id},
                language_code,
            )
            translations.append(translation)

        del data["committee_category_id"]

        data["translations"] = [
            translation.to_dict() for translation in set(translations)
        ]

        return data


class CommitteeCategoryTranslation(SQLModel, table=True):
    __tablename__ = "committee_category_translation"

    committee_category_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str

    # Foreign key
    committee_category_id: uuid.UUID = Field(
        foreign_key="committee_category.committee_category_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationship
    committee_category: "CommitteeCategory" = Relationship(
        back_populates="translations",
    )
    language: "Language" = Relationship(
        back_populates="committee_category_translations",
    )

    def __repr__(self):
        return (
            "<CommitteeCategoryTranslation %r>" % self.committee_category_translation_id
        )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_category_translation_id"]
        del data["committee_category_id"]

        return data
