import uuid
from datetime import datetime
from typing import Any

import msgspec


class LoginDTO(msgspec.Struct):
    email: str
    password: str


class BaseStudentDTO(msgspec.Struct):
    email: str | None = None
    student_id: uuid.UUID
    first_name: str
    last_name: str | None = None
    profile_picture_url: str | None = None


class PrivateStudentDTO(BaseStudentDTO):
    reception_name: str | None = None
    reception_profile_picture_url: str | None = None


class ProfileDTO(msgspec.Struct):
    facebook_url: str | None
    linkedin_url: str | None
    instagram_url: str | None


class StudentMembershipDTO(msgspec.Struct):
    initiation_date: datetime
    termination_date: datetime | None
    committee_position: Any


class StudentDTO:
    student: BaseStudentDTO
    profile: ProfileDTO | None
    memberships: list[StudentMembershipDTO] | None
