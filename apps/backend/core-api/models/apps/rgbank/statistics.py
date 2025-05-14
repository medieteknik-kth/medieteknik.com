import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlmodel import CheckConstraint, Field, Relationship, SQLModel

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
