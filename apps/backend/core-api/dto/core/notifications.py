import uuid
from typing import Any

import msgspec

from dto.committees.committee import CommitteeDTO


class NotificationsTranslationDTO(msgspec.Struct):
    title: str
    body: str
    url: str | None = None
    language_code: str


class NotificationsDTO(msgspec.Struct):
    notification_id: uuid.UUID
    created_at: str
    notification_type: str
    metadata: dict[str, Any] | None = None
    committee: CommitteeDTO | None = None
    translations: list[NotificationsTranslationDTO] = []
