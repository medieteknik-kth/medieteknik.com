import enum
import uuid
from typing import Any, Dict, List
from sqlalchemy import (
    DateTime,
    String,
    Integer,
    Column,
    ForeignKey,
    Enum,
    Boolean,
    inspect,
    text,
)
from sqlalchemy.dialects.postgresql import UUID
from models.committees.committee import Committee
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


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


class CommitteePosition(db.Model):
    __tablename__ = "committee_position"

    committee_position_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    email = Column(String(255))
    weight = Column(Integer, default=1_000)
    role = Column(
        Enum(CommitteePositionsRole),
        default=CommitteePositionsRole.COMMITTEE,
        nullable=False,
    )
    active = Column(Boolean, default=True)
    category = Column(Enum(CommitteePositionCategory), nullable=True)
    base = Column(Boolean, default=False)

    # Foreign key
    committee_id = Column(UUID(as_uuid=True), ForeignKey("committee.committee_id"))

    # Relationship
    author = db.relationship("Author", back_populates="committee_position")
    committee = db.relationship("Committee", back_populates="committee_positions")
    student_positions = db.relationship(
        "StudentMembership", back_populates="committee_position"
    )
    translations = db.relationship(
        "CommitteePositionTranslation", back_populates="committee_position"
    )
    recruitment = db.relationship(
        "CommitteePositionRecruitment", back_populates="committee_position"
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

    committee_position_translation_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    title = Column(String(255))
    description = Column(String(500))

    # Foreign keys
    committee_position_id = Column(
        UUID(as_uuid=True), ForeignKey("committee_position.committee_position_id")
    )
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee_position = db.relationship(
        "CommitteePosition", back_populates="translations"
    )
    language = db.relationship(
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

    committee_position_recruitment_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    start_date = Column(DateTime)
    end_date = Column(DateTime)

    # Foreign keys
    committee_position_id = Column(
        UUID(as_uuid=True), ForeignKey("committee_position.committee_position_id")
    )

    # Relationship
    committee_position = db.relationship(
        "CommitteePosition", back_populates="recruitment"
    )
    translations = db.relationship(
        "CommitteePositionRecruitmentTranslation",
        back_populates="committee_position_recruitment",
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

    committee_position_recruitment_translation_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    description = Column(String(length=255))
    link_url = Column(String(512))

    # Foreign keys
    committee_position_recruitment_id = Column(
        UUID(as_uuid=True),
        ForeignKey(
            "committee_position_recruitment.committee_position_recruitment_id",
            ondelete="CASCADE",
        ),
    )
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee_position_recruitment = db.relationship(
        "CommitteePositionRecruitment", back_populates="translations"
    )
    language = db.relationship(
        "Language", back_populates="committee_position_recruitment_translations"
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
