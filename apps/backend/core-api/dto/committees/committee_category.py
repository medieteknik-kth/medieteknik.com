from pydantic import BaseModel


class CommitteeCategoryTranslationDTO(BaseModel):
    """DTO for committee category translation"""

    title: str
    language_code: str


class CommitteeCategoryDTO(BaseModel):
    """DTO for committee category"""

    email: str
    translations: list[CommitteeCategoryTranslationDTO]
