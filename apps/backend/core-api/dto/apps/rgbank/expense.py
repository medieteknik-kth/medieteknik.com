from typing import Any, Dict

from pydantic import BaseModel

from dto.apps.rgbank.thread import ThreadDTO
from dto.core.student import StudentDTO
from models.apps.rgbank.expense import PaymentStatus


class ExpenseDomainDTO(BaseModel):
    expense_part_id: str
    title: str
    parts: list[str]
    committee_id: str


class UpdateExpenseDomainDTO(BaseModel):
    title: str | None = None
    parts: list[str] | None = None


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
    amount: float
    student: StudentDTO | None = None


class UpdateItemForm(BaseModel):
    status: str | None = None
    updatedCategories: list[Dict[str, Any]] | None = None
    comment: str | None = None


class CreateExpenseForm(BaseModel):
    files: list[bytes]
    date: str
    title: str
    description: str
    is_digital: str
    categories: list[Dict[str, Any]]


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
    amount: float
    student: StudentDTO | None = None


class CreateInvoiceForm(BaseModel):
    files: list[bytes]
    already_paid: str
    title: str
    description: str
    is_original: str
    is_booked: str
    date_issued: str
    due_date: str
    categories: list[Dict[str, Any]]


class BaseItemResponseDTO(BaseModel):
    student: StudentDTO
    bank_information: str
    thread: ThreadDTO


class ExpenseResponseDTO(BaseItemResponseDTO):
    expense: ExpenseDTO


class InvoiceResponseDTO(BaseItemResponseDTO):
    invoice: InvoiceDTO
