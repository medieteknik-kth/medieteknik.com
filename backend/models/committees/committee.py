from typing import Any, Dict, List
from sqlalchemy import DateTime, String, Integer, Column, ForeignKey, inspect
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


class Committee(db.Model):
    __tablename__ = "committee"
    committee_id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True)
    logo_url = Column(String(500))

    # Foreign key
    committee_category_id = Column(
        Integer, ForeignKey("committee_category.committee_category_id")
    )

    # Relationship
    committee_category = db.relationship("CommitteeCategory", backref="committees")

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

        del data["committee_id"]
        del data["committee_category_id"]

        data["translations"] = [
            translation.to_dict() for translation in set(translations)
        ]

        return data


class CommitteeTranslation(db.Model):
    __tablename__ = "committee_translation"

    committee_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(255))

    # Foreign keys
    committee_id = Column(Integer, ForeignKey("committee.committee_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee = db.relationship("Committee", backref="committee_translations")
    language = db.relationship("Language", backref="committee_translations")

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


class CommitteeRecruitment(db.Model):
    __tablename__ = "committee_recruitment"

    committee_recruitment_id = Column(Integer, primary_key=True, autoincrement=True)

    start_date = Column(DateTime)
    end_date = Column(DateTime)

    # Foreign keys
    committee_id = Column(Integer, ForeignKey("committee.committee_id"))

    # Relationship
    committee = db.relationship("Committee", backref="committee_recruitments")

    def __repr__(self):
        return "<CommitteeRecruitment %r>" % self.committee_recruitment_id

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_recruitment_id"]
        del data["committee_id"]

        return data


class CommitteeRecruitmentTranslation(db.Model):
    __tablename__ = "committee_recruitment_translation"

    committee_recruitment_translation_id = Column(
        Integer, primary_key=True, autoincrement=True
    )

    description = Column(String(255))
    link_url = Column(String(512))

    # Foreign keys
    committee_recruitment_id = Column(
        Integer, ForeignKey("committee_recruitment.committee_recruitment_id")
    )
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee_recruitment = db.relationship(
        "CommitteeRecruitment", backref="committee_recruitment_translations"
    )
    language = db.relationship("Language", backref="committee_recruitment_translations")

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_recruitment_translation_id"]
        del data["language_code"]
        del data["committee_recruitment_id"]

        return data
