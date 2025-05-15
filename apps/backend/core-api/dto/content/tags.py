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

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "TagDTO":
        """
        Create a TagDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new TagDTO instance with the filtered translations
        return cls(
            tag_id=obj.tag_id,
            color=obj.color,
            category=obj.category,
            translations=translations,
        )
