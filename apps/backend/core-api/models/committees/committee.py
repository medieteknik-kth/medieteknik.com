import uuid
from typing import TYPE_CHECKING, Any, Dict, List

from sqlmodel import Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

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

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES
    ) -> Dict[str, Any] | None:
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return None

        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: CommitteeTranslation | None = translation_lookup.get(
                language_code
            )

            if not translation or not isinstance(translation, CommitteeTranslation):
                translation: CommitteeTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, CommitteeTranslation):
                translations.append(translation.to_dict())

        del data["committee_category_id"]

        data["translations"] = translations

        return data


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

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_translation_id"]
        del data["committee_id"]

        return data
