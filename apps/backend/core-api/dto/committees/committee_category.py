from pydantic import BaseModel


class CommitteeCategoryTranslationDTO(BaseModel):
    """DTO for committee category translation"""

    title: str
    language_code: str


class CommitteeCategoryDTO(BaseModel):
    """DTO for committee category"""

    email: str
    translations: list[CommitteeCategoryTranslationDTO]

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "CommitteeCategoryDTO":
        """
        Create a CommitteeCategoryDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new CommitteeCategoryDTO instance with the filtered translations
        return cls(
            email=obj.email,
            translations=translations,
        )
