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

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "EventDTO":
        """
        Create a EventDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new EventDTO instance with the filtered translations
        return cls(
            event_id=obj.event_id,
            start_date=obj.start_date,
            duration=obj.duration,
            background_color=obj.background_color,
            location=obj.location,
            is_inherited=obj.is_inherited,
            translations=translations,
        )
