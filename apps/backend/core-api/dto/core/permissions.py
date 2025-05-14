import uuid
from typing import List

from pydantic import BaseModel

from models.core.permissions import Permissions, Role


class StudentPermissionDTO(BaseModel):
    """DTO for student permissions"""

    student_id: uuid.UUID
    role: Role
    permissions: List[Permissions] = []
