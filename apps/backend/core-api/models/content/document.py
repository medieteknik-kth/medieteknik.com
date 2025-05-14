import enum
import uuid
from typing import TYPE_CHECKING, List

from sqlalchemy import inspect
from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE

if TYPE_CHECKING:
    from models.core.language import Language


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

    document_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    document_type: DocumentType = DocumentType.DOCUMENT

    # Foreign keys
    item_id: uuid.UUID = Field(foreign_key="item.item_id")

    # Relationships
    item: "Item" = Relationship(back_populates="document")
    translations: "DocumentTranslation" = Relationship(back_populates="document")

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
            translation: DocumentTranslation | None = translation_lookup.get(
                language_code
            )

            if not translation or not isinstance(translation, DocumentTranslation):
                translation: DocumentTranslation | None = translation_lookup.get(
                    DEFAULT_LANGUAGE_CODE
                ) or next(iter(translation_lookup.values()), None)

            if translation and isinstance(translation, DocumentTranslation):
                translations.append(translation.to_dict())

        base_data["translations"] = translations

        return base_data


class DocumentTranslation(SQLModel, table=True):
    __tablename__ = "document_translation"

    document_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    categories: list[str]
    url: str

    # Foreign keys
    document_id = Field(
        foreign_key="document.document_id",
    )
    language_code: str = Field(
        foreign_key="language.language_code",
    )

    # Relationships
    document: "Document" = Relationship(back_populates="translations")
    language: "Language" = Relationship(back_populates="document_translations")

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
