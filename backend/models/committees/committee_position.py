import enum
from typing import Any, Dict, List
from sqlalchemy import String, Integer, Column, ForeignKey, Enum, Boolean, inspect
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


class CommitteePositionsRole(enum.Enum):
    ADMIN = 1
    BOARD = 2
    COMMITTEE = 3


class CommitteePosition(db.Model):
    __tablename__ = "committee_position"
    committee_position_id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True)
    weight = Column(Integer, default=0)
    role = Column(
        Enum(CommitteePositionsRole), default=CommitteePositionsRole.COMMITTEE
    )
    active = Column(Boolean, default=True)

    # Foreign key
    committee_id = Column(Integer, ForeignKey("committee.committee_id"))

    # Relationship
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
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
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

        return data


class CommitteePositionResource(db.Model):
    __tablename__ = "committee_position_resource"

    committee_position_id = Column(
        Integer,
        ForeignKey("committee_position.committee_position_id"),
        primary_key=True,
    )
    resource_id = Column(Integer, ForeignKey("resource.resource_id"), primary_key=True)


class CommitteePositionTranslation(db.Model):
    __tablename__ = "committee_position_translation"

    committee_position_translation_id = Column(
        Integer, primary_key=True, autoincrement=True
    )

    title = Column(String(255))
    description = Column(String(255))

    # Foreign keys
    committee_position_id = Column(
        Integer, ForeignKey("committee_position.committee_position_id")
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
