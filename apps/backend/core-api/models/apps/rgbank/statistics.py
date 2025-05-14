import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING, Any, Dict, List

from sqlmodel import CheckConstraint, Field, Relationship, SQLModel

from utility import AVAILABLE_LANGUAGES

if TYPE_CHECKING:
    from models.committees.committee import Committee
    from models.core.student import Student


class Statistics(SQLModel, table=True):
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

    statistics_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    year: int | None  # NULL for all-time/yearly statistics
    month: int | None  # NULL for all-time/yearly statistics
    is_all_time: bool = False

    value: float = 0.0

    created_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )
    updated_at: datetime = Field(
        default_factory=datetime.now(tz=timezone.utc),
    )

    # Foreign Keys
    student_id: uuid.UUID | None = Field(
        foreign_key="student.student_id",
        index=True,
    )
    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        index=True,
    )

    # Relationships
    student: "Student" | None = Relationship(
        back_populates="rgbank_statistics",
    )
    committee: "Committee" | None = Relationship(
        back_populates="rgbank_statistics",
    )

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


class ExpenseCount(SQLModel, table=True):
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

    expense_count_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    expense_count: int = 0
    invoice_count: int = 0

    # Foreign Keys
    student_id: uuid.UUID | None = Field(
        foreign_key="student.student_id",
        index=True,
        unique=True,
    )

    committee_id: uuid.UUID | None = Field(
        foreign_key="committee.committee_id",
        index=True,
        unique=True,
    )

    # Relationships
    student: "Student" | None = Relationship(
        back_populates="rgbank_expense_count",
    )
    committee: "Committee" | None = Relationship(
        back_populates="rgbank_expense_count",
    )

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
