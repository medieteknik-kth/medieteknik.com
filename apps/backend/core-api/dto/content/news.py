from pydantic import BaseModel

from dto.content.item import ItemDTO


class NewsTranslationDTO(BaseModel):
    title: str
    body: str
    short_description: str
    main_image_url: str | None = None
    sub_image_urls: list[str] | None = []
    language_code: str


class NewsDTO(ItemDTO):
    news_id: str
    url: str
    translations: list[NewsTranslationDTO]
