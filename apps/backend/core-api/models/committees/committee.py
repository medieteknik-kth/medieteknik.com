import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.apps.rgbank.expense import ExpenseDomain
    from models.apps.rgbank.statistics import ExpenseCount, Statistics
    from models.committees.committee_category import CommitteeCategory
    from models.committees.committee_position import CommitteePosition
    from models.core.author import Author
    from models.core.calendar import Calendar
    from models.core.language import Language
    from models.core.notifications import Notifications


class Committee(SQLModel, table=True):
    __tablename__ = "committee"

    committee_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    email: str = Field(unique=True)
    group_photo_url: str | None
    logo_url: str

    total_news: int = 0
    total_events: int = 0
    total_documents: int = 0
    total_media: int = 0
    hidden: bool = False

    # Foreign key
    committee_category_id: uuid.UUID = Field(
        foreign_key="committee_category.committee_category_id",
    )

    # Relationship
    author: "Author" = Relationship(
        back_populates="committee",
    )
    committee_category: "CommitteeCategory" = Relationship(
        back_populates="committees",
    )
    translations: list["CommitteeTranslation"] = Relationship(
        back_populates="committee",
        cascade_delete=True,
        sa_relationship_kwargs={"lazy": "selectin"},
    )
    committee_positions: list["CommitteePosition"] = Relationship(
        back_populates="committee",
        cascade_delete=True,
    )
    calendar: "Calendar" = Relationship(
        back_populates="committee",
    )
    notifications: list["Notifications"] = Relationship(
        back_populates="committee",
        cascade_delete=True,
    )

    rgbank_expense_domain: "ExpenseDomain" = Relationship(
        back_populates="committee",
    )
    rgbank_statistics: list["Statistics"] = Relationship(
        back_populates="committee",
        cascade_delete=True,
    )
    rgbank_expense_count: "ExpenseCount" = Relationship(
        back_populates="committee",
    )

    def __repr__(self):
        return "<Committee %r>" % self.committee_id


class CommitteeTranslation(SQLModel, table=True):
    __tablename__ = "committee_translation"

    committee_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str = Field(max_length=125)
    description: str = Field(max_length=512)

    # Foreign keys
    committee_id: uuid.UUID = Field(
        foreign_key="committee.committee_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationship
    committee: "Committee" = Relationship(
        back_populates="translations",
    )
    language: "Language" = Relationship(
        back_populates="committee_translations",
    )

    def __repr__(self):
        return "<CommitteeTranslation %r>" % self.committee_translation_id
