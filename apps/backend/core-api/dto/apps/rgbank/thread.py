import msgspec

from dto.core.student import StudentDTO


class MessageDTO(msgspec.Struct):
    message_id: str
    content: str
    created_at: str | None = None
    read_at: str | None = None
    previous_status: str | None = None
    new_status: str | None = None
    sender: StudentDTO | None = None
    message_type: str | None = None


class AddMessageDTO(msgspec.Struct):
    message: str


class ThreadDTO(msgspec.Struct):
    thread_id: str
    messages: list[MessageDTO] | None = []
    unread_messages: list[MessageDTO] | None = []
