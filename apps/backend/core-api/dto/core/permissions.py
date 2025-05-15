import uuid
from typing import List

import msgspec

from models.core.permissions import Permissions, Role


class StudentPermissionDTO(msgspec.Struct):
    """DTO for student permissions"""

    student_id: uuid.UUID
    role: Role
    permissions: List[Permissions] = []
