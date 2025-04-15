import uuid
from typing import Any, Dict, List
from sqlalchemy import (
    UUID,
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    text,
)
from utility import db, AVAILABLE_LANGUAGES


class Statistics(db.Model):
    __tablename__ = "statistics"
    __table_args__ = (
        CheckConstraint(
            name="ck_statistics_student_committee",
            sqltext="num_nonnulls(student_id, committee_id) = 1",
        ),
        CheckConstraint(
            name="ck_statistics_year_month",
            sqltext="num_nonnulls(year, month) >= 1 OR is_all_time = true",
        ),
        {
            "schema": "rgbank",
        },
    )

    statistics_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    year = Column(Integer, nullable=True)  # NULL for all-time statistics
    month = Column(Integer, nullable=True)  # NULL for all-time/yearly statistics
    is_all_time = Column(Boolean, nullable=False, default=False)

    value = Column(Float, nullable=False, default=0.0)

    # Metadata
    created_at = Column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True), server_default=text("now()"), nullable=False
    )

    # Foreign Keys
    student_id = Column(
        UUID(as_uuid=True), ForeignKey("student.student_id"), nullable=True, index=True
    )

    committee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee.committee_id"),
        nullable=True,
        index=True,
    )

    # Relationships
    student = db.relationship("Student", back_populates="rgbank_statistics")
    committee = db.relationship("Committee", back_populates="rgbank_statistics")

    def __repr__(self):
        return "<Statistics %r>" % self.statistics_id

    def to_dict(
        self, provided_languages: List[str] = AVAILABLE_LANGUAGES
    ) -> Dict[str, Any]:
        return {
            "statistics_id": str(self.statistics_id),
            "year": self.year,
            "month": self.month,
            "is_all_time": self.is_all_time,
            "value": self.value,
            "created_at": str(self.created_at),
            "updated_at": str(self.updated_at),
            "student": self.student.to_dict() if self.student else None,
            "committee": self.committee.to_dict(provided_languages=provided_languages)
            if self.committee
            else None,
        }


class ExpenseCount(db.Model):
    __tablename__ = "expense_count"
    __table_args__ = (
        CheckConstraint(
            name="ck_expense_count_student_committee",
            sqltext="num_nonnulls(student_id, committee_id) = 1",
        ),
        {
            "schema": "rgbank",
        },
    )

    expense_count_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        nullable=False,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    expense_count = Column(Integer, nullable=False, default=0)
    invoice_count = Column(Integer, nullable=False, default=0)

    # Foreign Keys
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=True,
        index=True,
        unique=True,
    )

    committee_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee.committee_id"),
        nullable=True,
        index=True,
        unique=True,
    )

    # Relationships
    student = db.relationship("Student", back_populates="rgbank_expense_count")
    committee = db.relationship("Committee", back_populates="rgbank_expense_count")

    def __repr__(self):
        return "<ExpenseCount %r>" % self.expense_count_id

    def to_dict(self) -> Dict[str, Any]:
        return {
            "expense_count_id": str(self.expense_count_id),
            "expense_count": self.expense_count,
            "invoice_count": self.invoice_count,
            "student": self.student.to_dict() if self.student else None,
            "committee": self.committee.to_dict() if self.committee else None,
        }
