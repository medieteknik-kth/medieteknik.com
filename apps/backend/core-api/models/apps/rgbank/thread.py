import uuid
from sqlalchemy import TIMESTAMP, UUID, Column, ForeignKey, Index, text
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
        "Message", back_populates="thread", cascade="all, delete-orphan"
    )


class Message(db.Model):
    __tablename__ = "message"
    __table_args__ = {"schema": "rgbank"}

    message_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

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
