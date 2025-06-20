import datetime
from typing import Any, Dict, List
from models.apps.rgbank import Statistics, ExpenseCount
from utility import db, AVAILABLE_LANGUAGES

# --- STUDENT STATISTICS --- #


def add_student_statistic(
    student_id: str,
    value: float,
    date: datetime = None,
) -> None:
    """Adds a student statistic for the current month, year, and all time.

    :param student_id: The ID of the student.
    :type student_id: str
    :param value: The value to add to the statistic.
    :type value: float
    :param date: The date for the statistic. Defaults to None.
    :type date: datetime, optional
    :param expense_count: The count of expenses. Defaults to 0.
    :type expense_count: int, optional
    :param invoice_count: The count of invoices. Defaults to 0.
    :type invoice_count: int, optional"""

    if date is None:
        date = datetime.datetime.now()

    # Get the current month and year
    month = date.month
    year = date.year

    # Get the student statistics for the current month and year
    month_statistic: Statistics | None = Statistics.query.filter(
        Statistics.student_id == student_id,
        Statistics.year == year,
        Statistics.month == month,
        Statistics.is_all_time.is_(False),
    ).first()

    year_statistic: Statistics | None = Statistics.query.filter(
        Statistics.student_id == student_id,
        Statistics.year == year,
        Statistics.month == None,  # noqa: E711
        Statistics.is_all_time.is_(False),
    ).first()

    all_time_statistic: Statistics | None = Statistics.query.filter(
        Statistics.student_id == student_id, Statistics.is_all_time.is_(True)
    ).first()

    if not month_statistic or not isinstance(month_statistic, Statistics):
        month_statistic = Statistics(
            student_id=student_id,
            year=year,
            month=month,
            is_all_time=False,
            value=value,
        )
        db.session.add(month_statistic)
    else:
        month_statistic.value += value

    if not year_statistic or not isinstance(year_statistic, Statistics):
        year_statistic = Statistics(
            student_id=student_id,
            year=year,
            month=None,
            is_all_time=False,
            value=value,
        )
        db.session.add(year_statistic)
    else:
        year_statistic.value += value

    if not all_time_statistic or not isinstance(all_time_statistic, Statistics):
        all_time_statistic = Statistics(
            student_id=student_id,
            year=None,
            month=None,
            is_all_time=True,
            value=value,
        )
        db.session.add(all_time_statistic)
    else:
        all_time_statistic.value += value

    db.session.commit()


def get_student_statistic(
    student_id: str,
    year: int = None,
    month: int = None,
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any] | None:
    """Gets statistics for a student. If you don't provide a year or month, it will return the all-time statistics.

    :param student_id: The ID of the student.
    :type student_id: str
    :param year: The year of the statistics. Defaults to None.
    :type year: int, optional
    :param month: The month of the statistics. Defaults to None.
    :type month: int, optional
    :param provided_languages: The languages provided. Defaults to AVAILABLE_LANGUAGES.
    :type provided_languages: List[str], optional
    :return: The statistics for the student.
    :rtype: Dict[str, Any] | None"""

    if year:
        if month:
            statistic: Statistics | None = Statistics.query.filter(
                Statistics.student_id == student_id,
                Statistics.year == year,  # noqa: E711
                Statistics.month == month,
                Statistics.is_all_time.is_(False),
            ).first()
        else:
            statistic: Statistics | None = Statistics.query.filter(
                Statistics.student_id == student_id,
                Statistics.year == year,
                Statistics.month == None,  # noqa: E711
                Statistics.is_all_time.is_(False),
            ).first()
    else:
        statistic: Statistics | None = Statistics.query.filter(
            Statistics.student_id == student_id,
            Statistics.year == None,  # noqa: E711
            Statistics.month == None,  # noqa: E711
            Statistics.is_all_time.is_(True),
        ).first()

    if statistic is None or not isinstance(statistic, Statistics):
        return None

    return statistic.to_dict(provided_languages=provided_languages)


# --- COMMITTEE STATISTICS --- #


def add_committee_statistic(
    committee_id: str,
    value: float,
    date: datetime = None,
) -> None:
    """Adds a committee statistic for the current month, year, and all time.

    :param committee_id: The ID of the committee.
    :type committee_id: str
    :param value: The value to add to the statistic.
    :type value: float
    :param date: The date for the statistic. Defaults to None.
    :type date: datetime, optional
    :param expense_count: The count of expenses. Defaults to 0.
    :type expense_count: int, optional
    :param invoice_count: The count of invoices. Defaults to 0.
    :type invoice_count: int, optional"""

    if date is None:
        date = datetime.datetime.now()

    # Get the current month and year
    month = date.month
    year = date.year

    # Get the committee statistics for the current month and year
    month_statistic: Statistics | None = Statistics.query.filter(
        Statistics.committee_id == committee_id,
        Statistics.year == year,  # noqa: E711
        Statistics.month == month,
        Statistics.is_all_time.is_(False),
    ).first()

    year_statistic: Statistics | None = Statistics.query.filter(
        Statistics.committee_id == committee_id,
        Statistics.year == year,
        Statistics.month == None,  # noqa: E711
        Statistics.is_all_time.is_(False),
    ).first()

    all_time_statistic: Statistics | None = Statistics.query.filter(
        Statistics.committee_id == committee_id, Statistics.is_all_time.is_(True)
    ).first()

    if not month_statistic or not isinstance(month_statistic, Statistics):
        month_statistic = Statistics(
            committee_id=committee_id,
            year=year,
            month=month,
            is_all_time=False,
            value=value,
        )
        db.session.add(month_statistic)
    else:
        month_statistic.value += value

    if not year_statistic or not isinstance(year_statistic, Statistics):
        year_statistic = Statistics(
            committee_id=committee_id,
            year=year,
            month=None,
            is_all_time=False,
            value=value,
        )
        db.session.add(year_statistic)
    else:
        year_statistic.value += value

    if not all_time_statistic or not isinstance(all_time_statistic, Statistics):
        all_time_statistic = Statistics(
            committee_id=committee_id,
            year=None,
            month=None,
            is_all_time=True,
            value=value,
        )
        db.session.add(all_time_statistic)
    else:
        all_time_statistic.value += value

    db.session.commit()


def get_committee_statistic(
    committee_id: str,
    year: int = None,
    month: int = None,
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
) -> Dict[str, Any] | None:
    """Gets statistics for a committee. If you don't provide a year or month, it will return the all-time statistics.

    :param committee_id: The ID of the committee.
    :type committee_id: str
    :param year: The year of the statistics. Defaults to None.
    :type year: int, optional
    :param month: The month of the statistics. Defaults to None.
    :type month: int, optional
    :param provided_languages: The languages provided. Defaults to AVAILABLE_LANGUAGES.
    :type provided_languages: List[str], optional
    :return: The statistics for the committee.
    :rtype: Dict[str, Any] | None"""

    if year:
        if month:
            statistic: Statistics | None = Statistics.query.filter(
                Statistics.committee_id == committee_id,
                Statistics.year == None,  # noqa: E711
                Statistics.month == month,
                Statistics.is_all_time.is_(False),
            ).first()
        else:
            statistic: Statistics | None = Statistics.query.filter(
                Statistics.committee_id == committee_id,
                Statistics.year == year,
                Statistics.month == month,
                Statistics.is_all_time.is_(False),
            ).first()

    else:
        statistic: Statistics | None = Statistics.query.filter(
            Statistics.committee_id == committee_id,
            Statistics.year == None,  # noqa: E711
            Statistics.month == None,  # noqa: E711
            Statistics.is_all_time.is_(True),
        ).first()

    if statistic is None or not isinstance(statistic, Statistics):
        return None

    return statistic.to_dict(provided_languages=provided_languages)


def add_expense_count(
    student_id: str = None,
    committee_id: str = None,
    expense_count: int = 0,
    invoice_count: int = 0,
) -> None:
    """Adds an expense count for a student or committee.

    :param student_id: The ID of the student. Defaults to None.
    :type student_id: str, optional
    :param committee_id: The ID of the committee. Defaults to None.
    :type committee_id: str, optional
    :param expense_count: The count of expenses. Defaults to 0.
    :type expense_count: int, optional
    :param invoice_count: The count of invoices. Defaults to 0.
    :type invoice_count: int, optional"""

    if not student_id and not committee_id:
        raise ValueError("Either student_id or committee_id must be provided.")

    if student_id:
        expense_count_obj: ExpenseCount | None = ExpenseCount.query.filter_by(
            student_id=student_id
        ).first()

        if not expense_count_obj or not isinstance(expense_count_obj, ExpenseCount):
            expense_count_obj = ExpenseCount(
                student_id=student_id,
                expense_count=expense_count,
                invoice_count=invoice_count,
            )
            db.session.add(expense_count_obj)
        else:
            expense_count_obj.expense_count += expense_count
            expense_count_obj.invoice_count += invoice_count

    if committee_id:
        expense_count_obj: ExpenseCount | None = ExpenseCount.query.filter(
            ExpenseCount.committee_id == committee_id
        ).first()

        if not expense_count_obj or not isinstance(expense_count_obj, ExpenseCount):
            expense_count_obj = ExpenseCount(
                committee_id=committee_id,
                expense_count=expense_count,
                invoice_count=invoice_count,
            )
            db.session.add(expense_count_obj)
        else:
            expense_count_obj.expense_count += expense_count
            expense_count_obj.invoice_count += invoice_count

    db.session.commit()
