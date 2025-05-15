import msgspec

from dto.content.item import ItemDTO


class NewsTranslationDTO(msgspec.Struct):
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

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "NewsDTO":
        """
        Create a NewsDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new NewsDTO instance with the filtered translations
        return cls(
            news_id=obj.news_id,
            url=obj.url,
            translations=translations,
        )
