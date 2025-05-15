import msgspec

from dto.committees.committee import CommitteeDTO
from dto.committees.committee_position import PublicCommitteePositionDTO
from dto.core.permissions import StudentPermissionDTO
from dto.core.student import PrivateStudentDTO


class AuthResponseDTO(msgspec.Struct):
    student: PrivateStudentDTO
    permissions: StudentPermissionDTO
    role: str
    committees: list[CommitteeDTO] | None = None
    committee_positions: list[PublicCommitteePositionDTO] | None = None
    expiration: int
    view_permission_level: int | None = None
    access_level: int | None = None
