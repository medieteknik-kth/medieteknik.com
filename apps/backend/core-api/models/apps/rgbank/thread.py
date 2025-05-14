import enum
import uuid
from datetime import datetime, timezone

from sqlmodel import Field, Index, MetaData, Relationship, SQLModel, text

from models.apps.rgbank import Expense, Invoice, PaymentStatus
from models.core import Student
from utility.logger import log_error


class MessageType(enum.Enum):
    STUDENT = "STUDENT"  # Student
    SYSTEM = "SYSTEM"  # System, status update, etc.


class Thread(SQLModel, table=True):
    __tablename__ = "thread"
    __table_args__ = {"schema": "rgbank"}

    thread_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    # Foreign Keys
    expense_id: uuid.UUID | None = Field(
        foreign_key="expense.expense_id",
    )
    invoice_id: uuid.UUID | None = Field(
        foreign_key="invoice.invoice_id",
    )

    # Relationships
    expense: "Expense" | None = Relationship(
        back_populates="thread",
    )
    invoice: "Invoice" | None = Relationship(
        back_populates="thread",
    )
    messages: list["Message"] = Relationship(
        back_populates="thread",
    )

    def __repr__(self):
        return "<Thread %r>" % self.thread_id

    def to_dict(self, include_messages=True):
        if include_messages:
            messages = []
            unread_messages = []

            for message in self.messages:
                try:
                    msg_dict = message.to_dict()
                    if message.read_at is None:
                        unread_messages.append(msg_dict)
                    else:
                        messages.append(msg_dict)
                except Exception as e:
                    log_error(
                        f"Error converting message {message.message_id} to dict: {e}"
                    )

            return {
                "thread_id": str(self.thread_id),
                "messages": messages,
                "unread_messages": unread_messages,
            }

        return {
            "thread_id": str(self.thread_id),
        }


class Message(SQLModel, table=True):
    __tablename__ = "message"
    __table_args__ = {"schema": "rgbank"}

    message_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    content: str
    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    read_at: datetime | None
    message_type: MessageType = Field(
        default=MessageType.STUDENT,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    previous_status: PaymentStatus | None = Field(
        default=None,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    new_status: PaymentStatus | None = Field(
        default=None,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    # Foreign Keys
    thread_id: uuid.UUID = Field(
        foreign_key="thread.thread_id",
    )
    sender_id: uuid.UUID | None = Field(
        foreign_key="student.student_id",
        index=True,
    )

    # Relationships
    thread: "Thread" = Relationship(
        back_populates="messages",
    )
    sender: "Student" | None = Relationship(
        back_populates="rgbank_messages",
    )

    __table_args__ = (
        Index(
            "ix_unsent_messages",
            "message_id",
            postgresql_where=text("read_at IS NULL"),
        ),
        {"schema": "rgbank"},
    )

    def __repr__(self):
        return "<Message %r>" % self.message_id

    def to_dict(self):
        sender_dict = None

        if self.sender_id and self.sender:
            sender_dict = self.sender.to_dict()

        return {
            "message_id": str(self.message_id),
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "previous_status": self.previous_status.name
            if self.previous_status is not None
            else None,
            "new_status": self.new_status.name if self.new_status is not None else None,
            "sender": sender_dict,
            "message_type": self.message_type.name,
        }
