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
