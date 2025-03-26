import enum
import uuid
from typing import List
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy import Column, ForeignKey, String, inspect, Enum
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE
from utility.database import db
from models.content.base import Item


class DocumentType(enum.Enum):
    """
    What document can be uploaded as. Mainly used to distinguish between the purpose of a file.

    Attributes:
        DOCUMENT: Document
        FORM: Form
    """

    DOCUMENT = "DOCUMENT"
    FORM = "FORM"


class Document(Item):
    """
    Document model which inherits from the base Item model.

    Attributes:
        document_id: Primary key
    """

    document_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    document_type = Column(
        Enum(DocumentType), default=DocumentType.DOCUMENT, nullable=False
    )

    # Foreign keys
    item_id = Column(UUID(as_uuid=True), ForeignKey("item.item_id", ondelete="CASCADE"))

    # Relationships
    item = db.relationship("Item", back_populates="document", passive_deletes=True)
    translations = db.relationship(
        "DocumentTranslation",
        back_populates="document",
        lazy="joined"
    )

    __mapper_args__ = {"polymorphic_identity": "document"}

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES, is_public_route=True
    ):
        base_data = super().to_dict(
            provided_languages=provided_languages, is_public_route=is_public_route
        )

        if not base_data:
            return {}

        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            base_data[column] = value

        translation_lookup = {
            translation.language_code: translation for translation in self.translations
        }
        translations = []

        for language_code in provided_languages:
            translation: DocumentTranslation | None = translation_lookup.get(language_code)

            if not translation or not isinstance(translation, DocumentTranslation):
                translation: DocumentTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, DocumentTranslation):
                translations.append(translation.to_dict())

        base_data["translations"] = translations

        return base_data


class DocumentTranslation(db.Model):
    __tablename__ = "document_translation"

    document_translation_id = Column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )

    title = Column(String(255))
    categories = Column(ARRAY(String))
    url = Column(String(2096))

    # Foreign keys
    document_id = Column(
        UUID(as_uuid=True), ForeignKey("document.document_id", ondelete="CASCADE")
    )
    language_code = Column(String(20), ForeignKey("language.language_code"))

    # Relationships
    document = db.relationship("Document", back_populates="translations")
    language = db.relationship("Language", back_populates="document_translations")

    def to_dict(self):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if not data:
            return {}

        del data["document_translation_id"]
        del data["document_id"]

        return data
