"""RGBank services module.
==========
This module contains the services for the RGBank application.
"""

from .auth_service import has_access
from .auth_service import has_full_authority

from .message_service import add_message

from .statistics_service import add_committee_statistic
from .statistics_service import add_student_statistic
from .statistics_service import get_committee_statistic
from .statistics_service import get_student_statistic
from .statistics_service import add_expense_count
from .statistics_service import get_top_students
from .statistics_service import get_monthly_value_by_year

__all__ = [
    "has_access",
    "has_full_authority",
    "add_message",
    "add_committee_statistic",
    "add_student_statistic",
    "get_committee_statistic",
    "get_student_statistic",
    "add_expense_count",
    "get_top_students",
    "get_monthly_value_by_year",
]
