from typing import Union

from pydantic import BaseModel

from dto.committees.committee import CommitteeDTO
from dto.committees.committee_position import PublicCommitteePositionDTO
from dto.core.student import BaseStudentDTO


class AuthorDTO(BaseModel):
    student: Union[BaseStudentDTO, None] = None
    committee: Union[CommitteeDTO, None] = None
    committee_position: Union[PublicCommitteePositionDTO, None] = None
