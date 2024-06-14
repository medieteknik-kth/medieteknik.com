from typing import List
from sqlalchemy import String, Integer, Column, ForeignKey, inspect
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation


class CommitteeCategory(db.Model):
    __tablename__ = "committee_category"
    committee_category_id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String(255), unique=True, nullable=True)

    def __repr__(self):
        return "<CommitteeCategory %r>" % self.committee_category_id

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                CommitteeCategoryTranslation,
                ["committee_category_id"],
                {"committee_category_id": self.committee_category_id},
                language_code,
            )
            translations.append(translation)

        del data["committee_category_id"]

        data["translations"] = [
            translation.to_dict() for translation in set(translations)
        ]

        return data


class CommitteeCategoryTranslation(db.Model):
    __tablename__ = "committee_category_translation"
    committee_category_translation_id = Column(
        Integer, primary_key=True, autoincrement=True
    )

    title = Column(String(255))

    # Foreign key
    committee_category_id = Column(
        Integer, ForeignKey("committee_category.committee_category_id")
    )
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationship
    committee_category = db.relationship(
        "CommitteeCategory", backref="committee_category_translations"
    )
    language = db.relationship("Language", backref="committee_category_translations")

    def __repr__(self):
        return (
            "<CommitteeCategoryTranslation %r>" % self.committee_category_translation_id
        )

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["committee_category_translation_id"]
        del data["committee_category_id"]

        return data
