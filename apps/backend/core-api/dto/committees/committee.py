from pydantic import BaseModel


class CommitteeTranslationDTO(BaseModel):
    title: str
    description: str
    language_code: str


class CommitteeDTO(BaseModel):
    email: str
    group_photo_url: str | None = None
    logo_url: str
    total_news: int
    total_events: int
    total_documents: int
    total_media: int
    hidden: bool
    translations: list[CommitteeTranslationDTO]
