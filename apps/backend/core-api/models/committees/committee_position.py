import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Any, Dict, List

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db
from utility.translation import get_translation

if TYPE_CHECKING:
    from models.apps.rgbank.permissions import RGBankPermissions
    from models.committees.committee import Committee
    from models.core.author import Author
    from models.core.language import Language
    from models.core.student import StudentMembership


class CommitteePositionsRole(enum.Enum):
    COMMITTEE = "COMMITTEE"
    MEMBER = "MEMBER"


class CommitteePositionCategory(enum.Enum):
    STYRELSEN = "STYRELSEN"
    STUDIESOCIALT = "STUDIESOCIALT"
    NÄRINGSLIV_OCH_KOMMUNIKATION = "NÄRINGSLIV OCH KOMMUNIKATION"
    UTBILDNING = "UTBILDNING"
    VALBEREDNINGEN = "VALBEREDNINGEN"
    KÅRFULLMÄKTIGE = "KÅRFULLMÄKTIGE"
    REVISORER = "REVISORER"
    FANBORGEN = "FANBORGEN"


class CommitteePosition(SQLModel, table=True):
    __tablename__ = "committee_position"

    committee_position_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    email: EmailStr | None
    weight: int = 1_000
    role: CommitteePositionsRole = CommitteePositionsRole.COMMITTEE
    active: bool = True
    category: CommitteePositionCategory | None
    base: bool = False

    # Foreign key
    committee_id: uuid.UUID = Field(
        foreign_key="committee.committee_id",
    )

    # Relationship
    author: "Author" = Relationship(
        back_populates="committee_position",
    )
    committee: "Committee" = Relationship(
        back_populates="committee_positions",
    )
    student_positions: list["StudentMembership"] = Relationship(
        back_populates="committee_position",
    )
    translations: list["CommitteePositionTranslation"] = Relationship(
        back_populates="committee_position",
        cascade_delete=True,
    )
    recruitment: list["CommitteePositionRecruitment"] = Relationship(
        back_populates="committee_position",
        cascade_delete=True,
    )
    rgbank_permissions: "RGBankPermissions" = Relationship(
        back_populates="committee_position",
        cascade_delete=True,
    )

    def __repr__(self):
        return "<CommitteePosition %r>" % self.committee_position_id

    def to_dict(
        self,
        provided_languages: List[str] = AVAILABLE_LANGUAGES,
        is_public_route=True,
        include_parent=False,
    ) -> Dict[str, Any] | None:
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
                CommitteePositionTranslation,
                ["committee_position_id"],
                {"committee_position_id": self.committee_position_id},
                language_code,
            )
            translations.append(translation)

        data["translations"] = [
            translation.to_dict()
            for translation in set(translations)
            if translation is not None
        ]

        if is_public_route:
            del data["role"]

        if include_parent and self.committee_id:
            del data["committee_id"]
            parent_committee = Committee.query.filter_by(
                committee_id=self.committee_id
            ).first()

            if not parent_committee or not isinstance(parent_committee, Committee):
                return data

            data["committee"] = parent_committee.to_dict(
                provided_languages=provided_languages,
            )

        return data


class CommitteePositionTranslation(db.Model):
    __tablename__ = "committee_position_translation"

    committee_position_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    description: str | None

    # Foreign keys
    committee_position_id: uuid.UUID = Field(
        foreign_key="committee_position.committee_position_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationship
    committee_position: "CommitteePosition" = db.relationship(
        "CommitteePosition", back_populates="translations"
    )
    language: "Language" = db.relationship(
        "Language", back_populates="committee_position_translations"
    )

    def __repr__(self):
        return (
            "<CommitteePositionTranslation %r>" % self.committee_position_translation_id
        )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_position_translation_id"]
        del data["committee_position_id"]

        return data


class CommitteePositionRecruitment(db.Model):
    __tablename__ = "committee_position_recruitment"

    committee_position_recruitment_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    start_date: datetime
    end_date: datetime

    # Foreign keys
    committee_position_id: uuid.UUID = Field(
        foreign_key="committee_position.committee_position_id",
    )

    # Relationship
    committee_position: "CommitteePosition" = Relationship(
        back_populates="recruitment",
    )
    translations: list["CommitteePositionRecruitmentTranslation"] = Relationship(
        back_populates="committee_position_recruitment",
        cascade_delete=True,
    )

    def __repr__(self):
        return (
            "<CommitteePositionRecruitment %r>" % self.committee_position_recruitment_id
        )

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        translations: List[CommitteePositionRecruitmentTranslation] = []

        for language_code in provided_languages:
            translation = get_translation(
                CommitteePositionRecruitmentTranslation,
                ["committee_position_recruitment_id"],
                {
                    "committee_position_recruitment_id": self.committee_position_recruitment_id
                },
                language_code,
            )
            translations.append(translation)

        data["translations"] = [
            translation_dict
            for translation in set(translations)
            if (translation_dict := translation.to_dict()) is not None
        ]
        del data["committee_position_recruitment_id"]

        committee_position = CommitteePosition.query.get(data["committee_position_id"])
        del data["committee_position_id"]

        if not committee_position or not isinstance(
            committee_position, CommitteePosition
        ):
            return None

        data["committee_position"] = committee_position.to_dict(
            provided_languages=provided_languages,
            include_parent=True,
        )

        return data


class CommitteePositionRecruitmentTranslation(db.Model):
    __tablename__ = "committee_position_recruitment_translation"

    committee_position_recruitment_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    description: str
    link_url: str

    # Foreign keys
    committee_position_recruitment_id: uuid.UUID = Field(
        foreign_key="committee_position_recruitment.committee_position_recruitment_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationship
    committee_position_recruitment: "CommitteePositionRecruitment" = Relationship(
        back_populates="translations",
    )
    language: "Language" = Relationship(
        back_populates="committee_position_recruitment_translations",
    )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_position_recruitment_id"]
        del data["committee_position_recruitment_translation_id"]
        del data["language_code"]

        return data
