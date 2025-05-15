import uuid

import msgspec

from dto.committees.committee import CommitteeDTO
from models.committees.committee_position import (
    CommitteePositionCategory,
    CommitteePositionsRole,
)


class CommitteePositionTranslationDTO(msgspec.Struct):
    title: str
    description: str
    language_code: str


class PublicCommitteePositionDTO(msgspec.Struct):
    email: str | None
    translations: list[CommitteePositionTranslationDTO]
    committee_id: uuid.UUID

    @classmethod
    def from_orm_with_language(
        cls, obj, language_code: str
    ) -> "PublicCommitteePositionDTO":
        """
        Create a PublicCommitteePositionDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new PublicCommitteePositionDTO instance with the filtered translations
        return cls(
            email=obj.email,
            translations=translations,
            committee_id=obj.committee_id,
        )


class PublicCommitteePositionDTOWithCommitteeDTO(
    PublicCommitteePositionDTO,
):
    committee: CommitteeDTO


class ProtectedCommitteePositionDTO(PublicCommitteePositionDTO):
    weight: int
    role: CommitteePositionsRole
    active: bool
    category: CommitteePositionCategory | None
    base: bool


class ProtectedCommitteePositionDTOWithCommitteeDTO(
    ProtectedCommitteePositionDTO,
):
    committee: CommitteeDTO


class CommitteePositionRecruitmentTranslationDTO(msgspec.Struct):
    description: str
    link_url: str
    language_code: str


class CommitteePositionRecruitmentDTO(msgspec.Struct):
    start_date: str
    end_date: str
    committee_position: PublicCommitteePositionDTO
    translations: list[CommitteePositionRecruitmentTranslationDTO]

    @classmethod
    def from_orm_with_language(
        cls, obj, language_code: str
    ) -> "CommitteePositionRecruitmentDTO":
        """
        Create a CommitteePositionRecruitmentDTO from an ORM object and a language code.
        """
        # Filter translations by the specified language code
        translations = [
            translation
            for translation in obj.translations
            if translation.language_code == language_code
        ]

        # Create a new CommitteePositionRecruitmentDTO instance with the filtered translations
        return cls(
            start_date=obj.start_date,
            end_date=obj.end_date,
            committee_position=PublicCommitteePositionDTO.from_orm_with_language(
                obj.committee_position, language_code
            ),
            translations=translations,
        )
