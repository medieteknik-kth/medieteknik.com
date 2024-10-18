import uuid
from typing import Any, Dict, List
from sqlalchemy import Boolean, String, Integer, Column, ForeignKey, inspect, text
from sqlalchemy.dialects.postgresql import UUID
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


class Committee(db.Model):
    __tablename__ = "committee"
    committee_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    email = Column(String(255), unique=True)
    group_photo_url = Column(String(length=2096))
    logo_url = Column(String(2096), nullable=False)
    total_news = Column(Integer, nullable=False, default=0)
    total_events = Column(Integer, nullable=False, default=0)
    total_documents = Column(Integer, nullable=False, default=0)
    total_media = Column(Integer, nullable=False, default=0)
    hidden = Column(Boolean, nullable=False, default=False)

    # Foreign key
    committee_category_id = Column(
        UUID(as_uuid=True), ForeignKey("committee_category.committee_category_id")
    )

    # Relationship
    author = db.relationship("Author", back_populates="committee")
    committee_category = db.relationship(
        "CommitteeCategory", back_populates="committees"
    )
    translations = db.relationship("CommitteeTranslation", back_populates="committee")
    committee_positions = db.relationship(
        "CommitteePosition", back_populates="committee"
    )
    calendar = db.relationship("Calendar", back_populates="committee", uselist=False)

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

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                CommitteeTranslation,
                ["committee_id"],
                {"committee_id": self.committee_id},
                language_code,
            )
            translations.append(translation)

        del data["committee_category_id"]

        data["translations"] = [
            translation.to_dict() for translation in set(translations)
        ]

        return data


class CommitteeTranslation(db.Model):
    __tablename__ = "committee_translation"

    committee_translation_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    title = Column(String(125))
    description = Column(String(512))

    # Foreign keys
    committee_id = Column(UUID(as_uuid=True), ForeignKey("committee.committee_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee = db.relationship("Committee", back_populates="translations")
    language = db.relationship("Language", back_populates="committee_translations")

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
