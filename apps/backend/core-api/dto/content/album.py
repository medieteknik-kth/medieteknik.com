from pydantic import BaseModel

from dto.content.media import MediaDTO


class AlbumTranslationDTO(BaseModel):
    title: str
    description: str
    language_code: str


class AlbumDTO(BaseModel):
    album_id: str
    total_images: int
    total_videos: int
    updated_at: str
    preview_media: MediaDTO | None = None
    translations: list[AlbumTranslationDTO] = []

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "AlbumDTO":
        """
        Create a AlbumDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new AlbumDTO instance with the filtered translations
        return cls(
            album_id=obj.album_id,
            total_images=obj.total_images,
            total_videos=obj.total_videos,
            updated_at=obj.updated_at,
            preview_media=obj.preview_media,
            translations=translations,
        )
