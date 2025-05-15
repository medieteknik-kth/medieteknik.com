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

    @classmethod
    def from_orm_with_language(cls, obj, language_code: str) -> "StatisticsDTO":
        """
        Create a StatisticsDTO from an ORM object and a language code.
        """
        committee: CommitteeDTO = (
            CommitteeDTO.from_orm_with_language(obj.committee, language_code)
            if obj.committee
            else None
        )

        # Filter translations by the specified language code
        return cls(
            statistics_id=obj.statistics_id,
            year=obj.year,
            month=obj.month,
            is_all_time=obj.is_all_time,
            value=obj.value,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
            student=obj.student,
            committee=committee,
        )


class ExpenseCountDTO(BaseModel):
    expense_count_id: str
    expense_count: int
    invoice_count: int
    student: StudentDTO | None = None
    committee: CommitteeDTO | None = None
