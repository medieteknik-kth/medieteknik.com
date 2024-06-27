import enum
from typing import List
from sqlalchemy import Column, Enum, ForeignKey, Integer, String, inspect
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from utility.database import db


class TagCategory(enum.Enum):
    NEWS = "NEWS"
    EVENTS = "EVENTS"
    DOCUMENTS = "DOCUMENTS"


class Tag(db.Model):
    __tablename__ = "tag"

    tag_id = Column(Integer, primary_key=True)

    color = Column(String(7))
    category = Column(Enum(TagCategory), nullable=False, default=TagCategory.NEWS)

    # Relationships
    translations = db.relationship("TagTranslation", back_populates="tag")

    def to_dict(self, provided_languages: List[str] = AVAILABLE_LANGUAGES):
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
                TagTranslation, ["tag_id"], {"tag_id": self.tag_id}, language_code
            )
            translations.append(translation)

        data["translations"] = [translation.to_dict() for translation in translations]

        del data["tag_id"]

        return data


class TagTranslation(db.Model):
    __tablename__ = "tag_translation"

    tag_translation_id = Column(Integer, primary_key=True)

    title = Column(String(255))

    # Foreign keys
    tag_id = Column(Integer, ForeignKey("tag.tag_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    tag = db.relationship("Tag", back_populates="translations")
    language = db.relationship("Language", back_populates="tag_translations")

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        del data["tag_translation_id"]
        del data["tag_id"]
        del data["language_code"]

        return data
