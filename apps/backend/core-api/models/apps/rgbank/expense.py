import enum
import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict

from sqlalchemy.ext.hybrid import hybrid_property
from sqlmodel import Field, MetaData, Relationship, SQLModel, func

from models.committees import Committee
from models.core import Student
from utility.uuid_util import is_valid_uuid

if TYPE_CHECKING:
    from models.apps.rgbank.thread import Thread
    from models.committees.committee import Committee


class PaymentStatus(enum.IntEnum):
    """
    Payment status codes for expenses in the RG Bank system.
    Status codes are grouped by category:
    - Unconfirmed statuses [0-9]: Initial states before validation
    - Additional information needed statuses [10-19]: States requiring further action
    - Confirmed statuses [20-29]: Valid expenses awaiting payment
    - Payment statuses [30-39]: States related to payment processing
    - Finished statuses [40-49]: Terminal states of the expense workflow
    Attributes:
        UNCONFIRMED (0): Initial state for newly created expenses awaiting approval
        CLARIFICATION (10): Expense needs additional information or clarification
        CONFIRMED (20): Validated expense that is awaiting payment
        PAID (30): Payment for the expense has been processed successfully
        REJECTED (40): Expense has been marked as invalid
        BOOKED (41): Expense has been recorded in the accounting system
    """

    # [0-9] Unconfirmed statuses
    UNCONFIRMED = 0  # Just created / Awaiting approval

    # [10-19] Additional information needed statuses
    CLARIFICATION = 10  # Awaiting clarification

    # [20-29] Confirmed statuses
    CONFIRMED = 20  # Valid expense / Awaiting payment

    # [30-39] Payment statuses
    PAID = 30  # Payment received

    # [40-49] Finished statuses
    REJECTED = 40  # Invalid expense
    BOOKED = 41  # Invoice booked in the system


class ExpenseDomain(SQLModel, table=True):
    __tablename__ = "expense_domain"
    __table_args__ = {"schema": "rgbank"}

    expense_part_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    title: str | None
    parts: list[str] = []

    # Foreign Keys
    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        index=True,
    )

    # Relationships
    committee: "Committee" = Relationship(
        back_populates="rgbank_expense_domain",
    )

    def __repr__(self):
        return f"<ExpenseDomain {self.expense_part_id}>"

    def to_dict(self):
        return {
            "expense_part_id": str(self.expense_part_id),
            "title": self.title,
            "parts": self.parts,
            "committee_id": str(self.committee_id) if self.committee_id else None,
        }


class Expense(SQLModel, table=True):
    __tablename__ = "expense"
    __table_args__ = {"schema": "rgbank"}

    expense_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    file_urls: list[str]
    title: str
    description: str
    date: datetime
    is_digital: bool = False
    categories: list[Dict[str, Any]]
    status: PaymentStatus = Field(
        default=PaymentStatus.UNCONFIRMED,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    # Foreign Keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
        index=True,
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="rgbank_expenses",
    )
    thread: "Thread" = Relationship(
        back_populates="expense",
    )

    @hybrid_property
    def amount(self) -> float:
        """Calculate the total amount from the categories JSONB field."""
        total_amount = 0

        for category in self.categories:
            try:
                total_amount += float(category.get("amount", 0))
            except (ValueError, TypeError):
                total_amount += 0

        return total_amount

    @amount.expression
    def amount(cls):
        """Expression for SQLAlchemy to use in queries."""
        return func.sum(
            func.coalesce(func.jsonb_extract_path_text(cls.categories, "amount"), 0)
        )

    @hybrid_property
    def committee_id(self):
        return self.categories[0].get("author") if self.categories else None

    @committee_id.expression
    def committee_id(cls):
        return func.jsonb_extract_path_text(cls.categories, "author")

    @property
    def committee(self) -> Committee | None:
        author = self.committee_id
        return Committee.query.get(author) if is_valid_uuid(author) else None

    def __repr__(self):
        return f"<Expense {self.expense_id}>"

    def to_dict(self, short: bool = False, is_public_route: bool = True):
        if short:
            base_dict = {
                "expense_id": str(self.expense_id),
                "title": self.title,
                "description": self.description,
                "date": self.date.isoformat() if self.date else None,
                "status": self.status.name,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "committee": self.committee.to_dict() if self.committee else None,
                "amount": self.amount,
            }
        else:
            base_dict = {
                "expense_id": str(self.expense_id),
                "file_urls": self.file_urls,
                "title": self.title,
                "description": self.description,
                "date": self.date.isoformat() if self.date else None,
                "is_digital": self.is_digital,
                "categories": self.categories,
                "status": self.status.name,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "committee": self.committee.to_dict() if self.committee else None,
                "amount": self.amount,
            }

        if not is_public_route:
            base_dict["student"] = (
                self.student.to_dict(is_public_route=False) if self.student else None
            )

        return base_dict


class Invoice(SQLModel, table=True):
    __tablename__ = "invoice"
    __table_args__ = {"schema": "rgbank"}

    invoice_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    already_paid: bool = False
    file_urls: list[str]
    title: str
    description: str
    is_original: bool = False
    is_booked: bool = False
    date_issued: datetime
    due_date: datetime
    categories: list[Dict[str, Any]]
    status: PaymentStatus = Field(
        default=PaymentStatus.UNCONFIRMED,
        sa_column_kwargs={"metadata": MetaData(schema="rgbank")},
    )

    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    # Foreign Keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="rgbank_invoices",
    )
    thread: "Thread" = Relationship(
        back_populates="invoice",
    )

    @hybrid_property
    def amount(self) -> float:
        """Calculate the total amount from the categories JSONB field."""
        total_amount = 0
        for category in self.categories:
            try:
                total_amount += float(category.get("amount", 0))
            except (ValueError, TypeError):
                total_amount += 0

        return total_amount

    @amount.expression
    def amount(cls):
        """Expression for SQLAlchemy to use in queries."""
        return func.sum(
            func.coalesce(func.jsonb_extract_path_text(cls.categories, "amount"), 0)
        )

    @hybrid_property
    def committee_id(self):
        return self.categories[0].get("author") if self.categories else None

    @committee_id.expression
    def committee_id(cls):
        return func.jsonb_extract_path_text(cls.categories, "author")

    @property
    def committee(self) -> Committee | None:
        author = self.committee_id
        return Committee.query.get(author) if is_valid_uuid(author) else None

    def __repr__(self):
        return f"<Invoice {self.invoice_id}>"

    def to_dict(self, short: bool = False, is_public_route: bool = True):
        if short:
            base_dict = {
                "invoice_id": str(self.invoice_id),
                "title": self.title,
                "description": self.description,
                "date_issued": self.date_issued.isoformat()
                if self.date_issued
                else None,
                "due_date": self.due_date.isoformat() if self.due_date else None,
                "status": self.status.name,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "committee": self.committee.to_dict() if self.committee else None,
                "amount": self.amount,
            }

        else:
            base_dict = {
                "invoice_id": str(self.invoice_id),
                "already_paid": self.already_paid,
                "file_urls": self.file_urls,
                "title": self.title,
                "description": self.description,
                "is_original": self.is_original,
                "is_booked": self.is_booked,
                "date_issued": self.date_issued.isoformat()
                if self.date_issued
                else None,
                "due_date": self.due_date.isoformat() if self.due_date else None,
                "categories": self.categories,
                "status": self.status.name,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "committee": self.committee.to_dict() if self.committee else None,
                "amount": self.amount,
            }

        if not is_public_route:
            base_dict["student"] = (
                self.student.to_dict(is_public_route=False) if self.student else None
            )

        return base_dict
