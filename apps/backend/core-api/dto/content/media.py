from pydantic import BaseModel

from dto.content.item import ItemDTO
from models.content.media import MediaType


class MediaTranslationDTO(BaseModel):
    title: str
    description: str | None = None
    language_code: str


class MediaDTO(ItemDTO):
    media_id: str
    media_url: str
    media_type: MediaType
    translations: list[MediaTranslationDTO]
