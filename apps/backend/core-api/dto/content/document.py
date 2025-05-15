import uuid

from pydantic import BaseModel

from dto.content.item import ItemDTO
from models.content.document import DocumentType


class DocumentTranslationDTO(BaseModel):
    title: str
    categories: list[str] | None = []
    url: str
    language_code: str


class DocumentDTO(ItemDTO):
    document_id: uuid.UUID
    document_type: DocumentType
    translations: list[DocumentTranslationDTO]

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "DocumentDTO":
        """
        Create a DocumentDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new DocumentDTO instance with the filtered translations
        return cls(
            document_id=obj.document_id,
            document_type=obj.document_type,
            translations=translations,
        )
