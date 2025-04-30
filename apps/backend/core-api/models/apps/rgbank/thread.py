import enum
from typing import List
import uuid
from sqlalchemy import (
    TIMESTAMP,
    UUID,
    Column,
    Enum,
    ForeignKey,
    Index,
    MetaData,
    String,
    text,
)
from models.apps.rgbank import Expense, Invoice, PaymentStatus
from models.core import Student
from utility import db
from utility.logger import log_error


class MessageType(enum.Enum):
    STUDENT = "STUDENT"  # Student
    SYSTEM = "SYSTEM"  # System, status update, etc.


class Thread(db.Model):
    __tablename__ = "thread"
    __table_args__ = {"schema": "rgbank"}

    thread_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    # Foreign Keys
    expense_id = Column(
        UUID(as_uuid=True), ForeignKey(Expense.expense_id), nullable=True
    )

    invoice_id = Column(
        UUID(as_uuid=True), ForeignKey(Invoice.invoice_id), nullable=True
    )

    # Relationships
    expense = db.relationship("Expense", back_populates="thread")
    invoice = db.relationship("Invoice", back_populates="thread")
    messages = db.relationship(
        "Message",
        back_populates="thread",
        cascade="all, delete-orphan",
        lazy="joined",
        uselist=True,
        join_depth=1,
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


class Message(db.Model):
    __tablename__ = "message"
    __table_args__ = {"schema": "rgbank"}

    message_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    content = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=db.func.now(), server_default=text("now()"))

    # Will only be for when the sender/student is not the same as the receiver
    read_at = Column(TIMESTAMP, default=None, server_default=None, nullable=True)
    message_type = Column(
        Enum(MessageType, metadata=MetaData(schema="rgbank")),
        nullable=False,
        default=MessageType.STUDENT,
    )

    previous_status = Column(
        Enum(PaymentStatus, metadata=MetaData(schema="rgbank")), nullable=True
    )
    new_status = Column(
        Enum(PaymentStatus, metadata=MetaData(schema="rgbank")), nullable=True
    )

    # Foreign Keys
    thread_id = Column(UUID(as_uuid=True), ForeignKey(Thread.thread_id), nullable=False)
    sender_id = Column(
        UUID(as_uuid=True),
        ForeignKey(Student.student_id),
        nullable=True,
        index=True,
    )

    # Relationships
    thread = db.relationship("Thread", back_populates="messages")
    sender = db.relationship("Student", back_populates="rgbank_messages", lazy="joined")

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
