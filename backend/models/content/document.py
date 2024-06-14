from typing import List
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy import Column, ForeignKey, Integer, String, inspect
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import get_translation
from utility.database import db
from models.content.base import Item


class Document(Item):
    """
    Document model which inherits from the base Item model.

    Attributes:
        document_id: Primary key
    """

    document_id = Column(Integer, primary_key=True, autoincrement=True)

    # Foreign keys
    item_id = Column(Integer, ForeignKey("item.item_id"))

    # Relationships
    item = db.relationship("Item", backref="document")

    __mapper_args__ = {"polymorphic_identity": "document"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        base_data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

        if not base_data:
            return {}

        translations = []

        for language_code in provided_languages:
            translation = get_translation(
                DocumentTranslation,
                ["document_id"],
                {"document_id": self.document_id},
                language_code,
            )
            translations.append(translation)

        del base_data["document_id"]

        base_data["translations"] = [
            translation.to_dict() for translation in translations
        ]

        return base_data


class DocumentTranslation(db.Model):
    __tablename__ = "document_translation"

    document_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    categories = Column(ARRAY(String))

    # Foreign keys
    document_id = Column(Integer, ForeignKey("document.document_id"))
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    document = db.relationship("Document", backref="translation")
    language = db.relationship("Language", backref="document_translation")

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {c.name: getattr(self, c.name) for c in columns}

        del data["document_translation_id"]
        del data["document_id"]
