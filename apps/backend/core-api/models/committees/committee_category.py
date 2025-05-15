import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

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
        back_populates="committee_category", sa_relationship_kwargs={"lazy": "selectin"}
    )
    committees: list["Committee"] = Relationship(
        back_populates="committee_category",
    )

    def __repr__(self):
        return "<CommitteeCategory %r>" % self.committee_category_id


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
