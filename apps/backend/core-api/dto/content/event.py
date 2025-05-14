import uuid

from pydantic import BaseModel

from dto.content.item import ItemDTO


class EventTranslationDTO(BaseModel):
    title: str
    description: str
    main_image_url: str | None = None
    sub_image_urls: list[str] | None = []
    language_code: str


class EventDTO(ItemDTO):
    event_id: uuid.UUID
    start_date: str
    duration: int
    background_color: str
    location: str
    is_inherited: bool
    translations: list[EventTranslationDTO] | None = []
