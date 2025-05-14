import uuid

from pydantic import BaseModel

from dto.committees.committee import CommitteeDTO
from models.committees.committee_position import (
    CommitteePositionCategory,
    CommitteePositionsRole,
)


class CommitteePositionTranslationDTO(BaseModel):
    """DTO for committee position translation"""

    title: str
    description: str
    language_code: str


class PublicCommitteePositionDTO(BaseModel):
    """DTO for committee position"""

    email: str | None
    translations: list[CommitteePositionTranslationDTO]
    committee_id: uuid.UUID


class PublicCommitteePositionDTOWithCommitteeDTO(
    PublicCommitteePositionDTO,
):
    """DTO for committee position with committee"""

    committee: CommitteeDTO


class ProtectedCommitteePositionDTO(PublicCommitteePositionDTO):
    """DTO for committee position with protected fields"""

    weight: int
    role: CommitteePositionsRole
    active: bool
    category: CommitteePositionCategory | None
    base: bool


class ProtectedCommitteePositionDTOWithCommitteeDTO(
    ProtectedCommitteePositionDTO,
):
    """DTO for committee position with committee"""

    committee: CommitteeDTO


class CommitteePositionRecruitmentTranslationDTO(BaseModel):
    description: str
    link_url: str
    language_code: str


class CommitteePositionRecruitmentDTO(BaseModel):
    start_date: str
    end_date: str
    committee_position: PublicCommitteePositionDTO
    translations: list[CommitteePositionRecruitmentTranslationDTO]
