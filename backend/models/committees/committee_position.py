import enum
import uuid
from typing import Any, Dict, List
from sqlalchemy import String, Integer, Column, ForeignKey, Enum, Boolean, inspect, text
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
    VALBEREDNINGEN = "VALBEREDNINGEN"
    STUDIENÄMNDEN = "STUDIENÄMNDEN"
    NÄRINGSLIV_OCH_KOMMUNIKATION = "NÄRINGSLIV OCH KOMMUNIKATION"
    STUDIESOCIALT = "STUDIESOCIALT"
    FANBORGEN = "FANBORGEN"


class CommitteePosition(db.Model):
    __tablename__ = "committee_position"
    committee_position_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    email = Column(String(255), unique=True)
    weight = Column(Integer, default=0)
    role = Column(
        Enum(CommitteePositionsRole),
        default=CommitteePositionsRole.MEMBER,
        nullable=False,
    )
    active = Column(Boolean, default=True)
    category = Column(Enum(CommitteePositionCategory), nullable=False)

    # Foreign key
    committee_id = Column(UUID(as_uuid=True), ForeignKey("committee.committee_id"))

    # Relationship
    author = db.relationship("Author", back_populates="committee_position")
    committee = db.relationship("Committee", back_populates="committee_positions")
    resources = db.relationship(
        "Resource",
        secondary="committee_position_resource",
        back_populates="committee_positions",
    )
    student_positions = db.relationship(
        "StudentMembership", back_populates="committee_position"
    )
    translations = db.relationship(
        "CommitteePositionTranslation", back_populates="committee_position"
    )

    def __repr__(self):
        return "<CommitteePosition %r>" % self.committee_position_id

    def to_dict(
        self,
        provided_languages: List[str] = AVAILABLE_LANGUAGES,
        is_public_route=True,
        include_committee_logo=False,
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

        del data["committee_position_id"]
        del data["committee_id"]

        data["translations"] = [
            translation.to_dict() for translation in set(translations)
        ]

        if is_public_route:
            del data["weight"]
            del data["role"]

        if include_committee_logo:
            parent_committee = Committee.query.filter_by(
                committee_id=self.committee_id
            ).first()

            if parent_committee and isinstance(parent_committee, Committee):
                data["committee_logo_url"] = parent_committee.logo_url

        return data


class CommitteePositionResource(db.Model):
    __tablename__ = "committee_position_resource"

    committee_position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee_position.committee_position_id"),
        primary_key=True,
    )
    resource_id = Column(
        UUID(as_uuid=True), ForeignKey("resource.resource_id"), primary_key=True
    )


class CommitteePositionTranslation(db.Model):
    __tablename__ = "committee_position_translation"

    committee_position_translation_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    title = Column(String(255))
    description = Column(String(255))

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
