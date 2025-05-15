import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from utility.database import db

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
        sa_relationship_kwargs={"lazy": "selectin"},
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


class CommitteePositionTranslation(SQLModel, table=True):
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


class CommitteePositionRecruitment(SQLModel, table=True):
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
        sa_relationship_kwargs={"lazy": "joined"},
    )

    def __repr__(self):
        return (
            "<CommitteePositionRecruitment %r>" % self.committee_position_recruitment_id
        )


class CommitteePositionRecruitmentTranslation(SQLModel, table=True):
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
