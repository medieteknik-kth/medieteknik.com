from pydantic import BaseModel

from dto.committees.committee import CommitteeDTO
from dto.core.student import StudentDTO


class StatisticsDTO(BaseModel):
    statistics_id: str
    year: int
    month: int
    is_all_time: bool
    value: float
    created_at: str
    updated_at: str
    student: StudentDTO | None = None
    committee: CommitteeDTO | None = None


class ExpenseCountDTO(BaseModel):
    expense_count_id: str
    expense_count: int
    invoice_count: int
    student: StudentDTO | None = None
    committee: CommitteeDTO | None = None
