import uuid
from sqlalchemy import TIMESTAMP, UUID, Column, ForeignKey, Index, String, text
from models.apps.rgbank.expense import Expense, Invoice
from models.core.student import Student
from utility.database import db


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
        "Message", back_populates="thread", cascade="all, delete-orphan", uselist=True
    )

    def to_dict(self, include_messages=True):
        if include_messages:
            messages = [
                message.to_dict() for message in self.messages if message.read_at
            ]
            unread_messages = [
                message.to_dict() for message in self.messages if not message.read_at
            ]

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
    read_at = Column(TIMESTAMP, default=None, server_default=None, nullable=True)

    # Foreign Keys
    thread_id = Column(UUID(as_uuid=True), ForeignKey(Thread.thread_id), nullable=False)
    sender_id = Column(
        UUID(as_uuid=True),
        ForeignKey(Student.student_id),
        nullable=False,
        index=True,
    )

    # Relationships
    thread = db.relationship("Thread", back_populates="messages")
    sender = db.relationship("Student", back_populates="rgbank_messages")

    __table_args__ = (
        Index(
            "ix_unsent_messages",
            "message_id",
            postgresql_where=text("read_at IS NULL"),
        ),
        {"schema": "rgbank"},
    )

    def to_dict(self):
        sender = Student.query.filter_by(student_id=self.sender_id).first()
        if sender:
            sender = sender.to_dict()
        else:
            sender = None

        return {
            "message_id": str(self.message_id),
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "read_at": self.read_at.isoformat() if self.read_at else None,
            "sender": sender,
        }
