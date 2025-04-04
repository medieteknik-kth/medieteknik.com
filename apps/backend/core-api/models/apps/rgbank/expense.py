import enum
import uuid
from sqlalchemy import (
    TIMESTAMP,
    UUID,
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    String,
    text,
    func,
)
from sqlalchemy.dialects.postgresql import ARRAY, JSONB
from sqlalchemy.ext.hybrid import hybrid_property
from models.committees.committee import Committee
from models.core.student import Student
from utility.database import db


class Status(enum.Enum):
    BOOKED = "BOOKED"  # Invoice booked in the system
    PAID = "PAID"  # Payment received
    CONFIRMED = "CONFIRMED"  # Valid expense / Awaiting payment
    REJECTED = "REJECTED"  # Invalid expense
    CLARIFICATION = "CLARIFICATION"  # Awaiting clarification
    UNCONFIRMED = "UNCONFIRMED"  # Just created, not yet confirmed


class ExpenseDomain(db.Model):
    __tablename__ = "expense_domain"
    __table_args__ = {"schema": "rgbank"}

    expense_part_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    title = Column(String, nullable=False)
    parts = Column(ARRAY(String), nullable=False, default=[])

    # Foreign Keys
    commitee_id = Column(
        UUID(as_uuid=True),
        ForeignKey(Committee.committee_id),
        nullable=True,
    )

    # Relationships
    committee = db.relationship("Committee", back_populates="rgbank_expense_domain")

    def __repr__(self):
        return f"<ExpenseDomain {self.expense_part_id}>"

    def to_dict(self):
        return {
            "expense_part_id": str(self.expense_part_id),
            "title": self.title,
            "parts": self.parts,
            "committee_id": str(self.commitee_id) if self.commitee_id else None,
        }


class Expense(db.Model):
    __tablename__ = "expense"
    __table_args__ = {"schema": "rgbank"}

    expense_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    file_urls = Column(ARRAY(String), nullable=False)
    description = Column(String, nullable=False)
    date = Column(DateTime, nullable=False)
    is_digital = Column(Boolean, default=False, nullable=False)
    categories = Column(JSONB, nullable=False)
    status = Column(Enum(Status), nullable=False, default=Status.UNCONFIRMED)

    # Meta information
    created_at = Column(DateTime, default=func.now(), server_default=text("now()"))

    # Foreign Keys
    student_id = Column(
        UUID(as_uuid=True), ForeignKey(Student.student_id), nullable=False
    )

    # Relationships
    student = db.relationship("Student", back_populates="rgbank_expenses")

    thread = db.relationship(
        "Thread", back_populates="expense", cascade="all, delete-orphan"
    )

    @hybrid_property
    def amount(self):
        # Get the amount from the categories JSONB field
        total_amount = 0
        for category in self.categories:
            total_amount += category.get("amount", 0)

        return total_amount

    @amount.expression
    def amount(cls):
        # Expression for SQLAlchemy to use in queries
        return func.sum(
            func.coalesce(func.jsonb_extract_path_text(cls.categories, "amount"), 0)
        )

    def __repr__(self):
        return f"<Expense {self.expense_id}>"

    def to_dict(self):
        return {
            "expense_id": str(self.expense_id),
            "file_urls": self.file_urls,
            "description": self.description,
            "date": self.date.isoformat() if self.date else None,
            "is_digital": self.is_digital,
            "categories": self.categories,
            "status": self.status.name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Invoice(db.Model):
    __tablename__ = "invoice"
    __table_args__ = {"schema": "rgbank"}

    invoice_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    file_urls = Column(ARRAY(String), nullable=False)
    description = Column(String, nullable=False)
    is_original = Column(Boolean, default=False, nullable=False)
    is_booked = Column(Boolean, default=False, nullable=False)
    date_issued = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    categories = Column(JSONB, nullable=False)
    status = Column(Enum(Status), nullable=False, default=Status.UNCONFIRMED)

    # Meta information
    created_at = Column(TIMESTAMP, default=func.now(), server_default=text("now()"))

    # Foreign Keys
    student_id = Column(
        UUID(as_uuid=True), ForeignKey(Student.student_id), nullable=False
    )

    # Relationships
    student = db.relationship("Student", back_populates="rgbank_invoices")

    thread = db.relationship(
        "Thread", back_populates="invoice", cascade="all, delete-orphan"
    )

    @hybrid_property
    def amount(self):
        # Get the amount from the categories JSONB field
        total_amount = 0
        for category in self.categories:
            total_amount += category.get("amount", 0)

        return total_amount

    @amount.expression
    def amount(cls):
        # Expression for SQLAlchemy to use in queries
        return func.sum(
            func.coalesce(func.jsonb_extract_path_text(cls.categories, "amount"), 0)
        )

    def __repr__(self):
        return f"<Invoice {self.invoice_id}>"

    def to_dict(self):
        return {
            "invoice_id": str(self.invoice_id),
            "file_urls": self.file_urls,
            "description": self.description,
            "is_original": self.is_original,
            "is_booked": self.is_booked,
            "date_issued": self.date_issued.isoformat() if self.date_issued else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "categories": self.categories,
            "status": self.status.name,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
