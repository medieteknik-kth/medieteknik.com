import enum
import uuid
from typing import TYPE_CHECKING

from sqlmodel import Field, Relationship, SQLModel

from models.content.base import Item

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


class DocumentTranslation(SQLModel, table=True):
    __tablename__ = "document_translation"

    document_translation_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str
    categories: list[str] | None
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
