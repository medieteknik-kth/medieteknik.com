from typing import Any, Dict

from pydantic import BaseModel

from dto.committees.committee import CommitteeDTO
from dto.core.student import StudentDTO
from models.apps.rgbank.expense import PaymentStatus


class ExpenseDomainDTO(BaseModel):
    expense_part_id: str
    title: str
    parts: list[str]
    committee_id: str


class ExpenseDTO(BaseModel):
    expense_id: str
    file_urls: list[str]
    title: str
    description: str
    date: str
    is_digital: bool
    categories: list[Dict[str, Any]]
    status: PaymentStatus
    created_at: str
    committee: CommitteeDTO | None = None
    amount: float
    student: StudentDTO | None = None


class InvoiceDTO(BaseModel):
    invoice_id: str
    already_paid: bool
    file_urls: list[str]
    title: str
    description: str
    is_original: bool
    is_booked: bool
    date_issued: str | None = None
    due_date: str | None = None
    categories: list[Dict[str, Any]]
    status: PaymentStatus
    created_at: str
    committee: CommitteeDTO | None = None
    amount: float
    student: StudentDTO | None = None
