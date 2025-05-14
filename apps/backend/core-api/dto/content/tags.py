from pydantic import BaseModel

from models.content.tags import TagCategory


class TagTranslationDTO(BaseModel):
    title: str
    language_code: str


class TagDTO(BaseModel):
    tag_id: str
    color: str
    category: TagCategory
    translations: list[TagTranslationDTO]
