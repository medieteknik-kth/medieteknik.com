from pydantic import BaseModel

from dto.core.student import StudentDTO


class MessageDTO(BaseModel):
    message_id: str
    content: str
    created_at: str | None = None
    read_at: str | None = None
    previous_status: str | None = None
    new_status: str | None = None
    sender: StudentDTO | None = None
    message_type: str | None = None

class AddMessageDTO(BaseModel):
    message: str

class ThreadDTO(BaseModel):
    thread_id: str
    messages: list[MessageDTO] | None = []
    unread_messages: list[MessageDTO] | None = []
