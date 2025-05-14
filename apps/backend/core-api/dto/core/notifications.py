import uuid
from typing import Any

from pydantic import BaseModel

from dto.committees.committee import CommitteeDTO


class NotificationsTranslationDTO(BaseModel):
    title: str
    body: str
    url: str | None = None
    language_code: str


class NotificationsDTO(BaseModel):
    notification_id: uuid.UUID
    created_at: str
    notification_type: str
    metadata: dict[str, Any] | None = None
    committee: CommitteeDTO | None = None
    translations: list[NotificationsTranslationDTO] = []
