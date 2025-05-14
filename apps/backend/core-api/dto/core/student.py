import uuid
from datetime import datetime
from typing import Any

from pydantic import BaseModel


class LoginDTO(BaseModel):
    email: str
    password: str


class BaseStudentDTO(BaseModel):
    email: str | None = None
    student_id: uuid.UUID
    first_name: str
    last_name: str | None = None
    profile_picture_url: str | None = None


class PrivateStudentDTO(BaseStudentDTO):
    reception_name: str | None = None
    reception_profile_picture_url: str | None = None


class ProfileDTO(BaseModel):
    facebook_url: str | None
    linkedin_url: str | None
    instagram_url: str | None


class StudentMembershipDTO(BaseModel):
    initiation_date: datetime
    termination_date: datetime | None
    committee_position: Any


class StudentDTO:
    student: BaseStudentDTO
    profile: ProfileDTO | None
    memberships: list[StudentMembershipDTO] | None
