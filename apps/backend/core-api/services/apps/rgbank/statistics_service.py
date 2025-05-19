"""
RGBank Statistics Service
"""

import datetime

from sqlmodel import Session, select

from models.apps.rgbank import ExpenseCount, Statistics

# --- STUDENT STATISTICS --- #


def add_student_statistic(
    session: Session,
    student_id: str,
    value: float,
    date: datetime = None,
):
    """
    Adds a student statistic for the current month, year, and all time.

    Args:
        session (Session): The database session.
        student_id (str): The ID of the student.
        value (float): The value to add to the statistic.
        date (datetime, optional): The date for the statistic. Defaults to None.
    """

    if date is None:
        date = datetime.datetime.now()

    # Get the current month and year
    month = date.month
    year = date.year

    # Get the student statistics for the current month and year

    month_stmt = select(Statistics).where(
        Statistics.student_id == student_id,
        Statistics.year == year,
        Statistics.month == month,
        Statistics.is_all_time.is_(False),
    )
    month_statistic = session.exec(month_stmt).first()

    year_stmt = select(Statistics).where(
        Statistics.student_id == student_id,
        Statistics.year == year,
        Statistics.month == None,  # noqa: E711
        Statistics.is_all_time.is_(False),
    )

    year_statistic = session.exec(year_stmt).first()

    all_time_stmt = select(Statistics).where(
        Statistics.student_id == student_id, Statistics.is_all_time.is_(True)
    )
    all_time_statistic = session.exec(all_time_stmt).first()

    if not month_statistic:
        month_statistic = Statistics(
            student_id=student_id,
            year=year,
            month=month,
            is_all_time=False,
            value=value,
        )
        session.add(month_statistic)

    else:
        month_statistic.value += value

    if not year_statistic:
        year_statistic = Statistics(
            student_id=student_id,
            year=year,
            month=None,
            is_all_time=False,
            value=value,
        )
        session.add(year_statistic)
    else:
        year_statistic.value += value

    if not all_time_statistic:
        all_time_statistic = Statistics(
            student_id=student_id,
            year=None,
            month=None,
            is_all_time=True,
            value=value,
        )
        session.add(all_time_statistic)

    else:
        all_time_statistic.value += value

    session.commit()
    session.refresh(month_statistic)
    session.refresh(year_statistic)
    session.refresh(all_time_statistic)


def get_student_statistic(
    session: Session,
    student_id: str,
    year: int = None,
    month: int = None,
) -> Statistics | None:
    """
    Gets statistics for a student. If you don't provide a year or month, it will return the all-time statistics.

    Args:
        session (Session): The database session.
        student_id (str): The ID of the student.
        year (int, optional): The year of the statistics. Defaults to None.
        month (int, optional): The month of the statistics. Defaults to None.

    Returns:
        Statistics | None: The statistics for the student.
    """

    if year:
        if month:
            month_stmt = select(Statistics).where(
                Statistics.student_id == student_id,
                Statistics.year == year,
                Statistics.month == month,
                Statistics.is_all_time.is_(False),
            )
            statistic = session.exec(month_stmt).first()
        else:
            year_stmt = select(Statistics).where(
                Statistics.student_id == student_id,
                Statistics.year == year,
                Statistics.month == None,  # noqa: E711
                Statistics.is_all_time.is_(False),
            )
            statistic = session.exec(year_stmt).first()
    else:
        all_time_stmt = select(Statistics).where(
            Statistics.student_id == student_id, Statistics.is_all_time.is_(True)
        )
        statistic = session.exec(all_time_stmt).first()

    if statistic is None:
        return None

    return statistic


# --- COMMITTEE STATISTICS --- #


def add_committee_statistic(
    session: Session,
    committee_id: str,
    value: float,
    date: datetime = None,
):
    """
    Adds a committee statistic for the current month, year, and all time.

    Args:
        session (Session): The database session.
        committee_id (str): The ID of the committee.
        value (float): The value to add to the statistic.
        date (datetime, optional): The date for the statistic. Defaults to None.

    """

    if date is None:
        date = datetime.datetime.now()

    # Get the current month and year
    month = date.month
    year = date.year

    # Get the committee statistics for the current month and year
    month_stmt = select(Statistics).where(
        Statistics.committee_id == committee_id,
        Statistics.year == year,
        Statistics.month == month,
        Statistics.is_all_time.is_(False),
    )
    month_statistic = session.exec(month_stmt).first()

    year_stmt = select(Statistics).where(
        Statistics.committee_id == committee_id,
        Statistics.year == year,
        Statistics.month == None,  # noqa: E711
        Statistics.is_all_time.is_(False),
    )
    year_statistic = session.exec(year_stmt).first()

    all_time_stmt = select(Statistics).where(
        Statistics.committee_id == committee_id, Statistics.is_all_time.is_(True)
    )
    all_time_statistic = session.exec(all_time_stmt).first()

    if not month_statistic:
        month_statistic = Statistics(
            committee_id=committee_id,
            year=year,
            month=month,
            is_all_time=False,
            value=value,
        )
        session.add(month_statistic)
    else:
        month_statistic.value += value

    if not year_statistic:
        year_statistic = Statistics(
            committee_id=committee_id,
            year=year,
            month=None,
            is_all_time=False,
            value=value,
        )
        session.add(year_statistic)
    else:
        year_statistic.value += value

    if not all_time_statistic:
        all_time_statistic = Statistics(
            committee_id=committee_id,
            year=None,
            month=None,
            is_all_time=True,
            value=value,
        )
        session.add(all_time_statistic)
    else:
        all_time_statistic.value += value

    session.commit()
    session.refresh(month_statistic)
    session.refresh(year_statistic)
    session.refresh(all_time_statistic)


def get_committee_statistic(
    session: Session,
    committee_id: str,
    year: int | None = None,
    month: int | None = None,
) -> Statistics | None:
    """
    Gets statistics for a committee. If you don't provide a year or month, it will return the all-time statistics.

    Args:
        session (Session): The database session.
        committee_id (str): The ID of the committee.
        year (int, optional): The year of the statistics. Defaults to None.
        month (int, optional): The month of the statistics. Defaults to None.

    Returns:
        Statistics | None: The statistics for the committee.
    """

    if year:
        stmt = select(Statistics).where(
            Statistics.committee_id == committee_id,
            Statistics.year == year,
            Statistics.month == month,
            Statistics.is_all_time.is_(False),
        )
        statistic = session.exec(stmt).first()

    else:
        stmt = select(Statistics).where(
            Statistics.committee_id == committee_id,
            Statistics.year == None,  # noqa: E711
            Statistics.month == None,  # noqa: E711
            Statistics.is_all_time.is_(True),
        )
        statistic = session.exec(stmt).first()

    if statistic is None:
        return None

    return statistic


def add_expense_count(
    session: Session,
    student_id: str = None,
    committee_id: str = None,
    expense_count: int = 0,
    invoice_count: int = 0,
):
    """
    Adds or updates the expense count for a student or committee.

    Args:
        session (Session): The database session.
        student_id (str, optional): The ID of the student. Defaults to None.
        committee_id (str, optional): The ID of the committee. Defaults to None.
        expense_count (int, optional): The expense count to add. Defaults to 0.
        invoice_count (int, optional): The invoice count to add. Defaults to 0.

    Raises:
        ValueError: If neither student_id nor committee_id is provided.
    """

    if not student_id and not committee_id:
        raise ValueError("Either student_id or committee_id must be provided.")

    if student_id:
        expense_count_stmt = select(ExpenseCount).where(
            ExpenseCount.student_id == student_id
        )
        expense_count_obj = session.exec(expense_count_stmt).first()

        if not expense_count_obj:
            expense_count_obj = ExpenseCount(
                student_id=student_id,
                expense_count=expense_count,
                invoice_count=invoice_count,
            )
            session.add(expense_count_obj)
        else:
            expense_count_obj.expense_count += expense_count
            expense_count_obj.invoice_count += invoice_count

    if committee_id:
        expense_count_stmt = select(ExpenseCount).where(
            ExpenseCount.committee_id == committee_id
        )
        expense_count_obj = session.exec(expense_count_stmt).first()

        if not expense_count_obj or not isinstance(expense_count_obj, ExpenseCount):
            expense_count_obj = ExpenseCount(
                committee_id=committee_id,
                expense_count=expense_count,
                invoice_count=invoice_count,
            )
            session.add(expense_count_obj)
        else:
            expense_count_obj.expense_count += expense_count
            expense_count_obj.invoice_count += invoice_count

    session.commit()
