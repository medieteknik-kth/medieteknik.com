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
