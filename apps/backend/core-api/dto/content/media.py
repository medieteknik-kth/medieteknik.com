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

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "MediaDTO":
        """
        Create a MediaDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new MediaDTO instance with the filtered translations
        return cls(
            media_id=obj.media_id,
            media_url=obj.media_url,
            media_type=obj.media_type,
            translations=translations,
        )
