"""
The public service for student related queries
"""

from datetime import datetime
from typing import List
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from models.committees import (
    CommitteePosition,
    CommitteePositionsRole,
)
from models.core import Student, StudentMembership
from utility.database import db


def get_officials(year: str = None, semester: str = "VT") -> List[StudentMembership]:
    """
    Retrieves all officials for a given year and semester.

    :param year: The year to retrieve officials for
    :type year: str
    :param semester: The semester to retrieve officials for
    :type semester: str

    :return: The list of officials
    :rtype: list
    """
    if semester != "VT" and semester != "HT":
        return None
    if year is None or len(year) != 4 or not year.isdigit():
        return None

    # start_date = datetime(start_year, QUARTER_START_MONTHS["Q3"], 1)
    # end_date = datetime(end_year, QUARTER_START_MONTHS["Q2"], 1)

    start_date = None
    end_date = None

    if semester == "VT":
        start_date = datetime(int(year), 1, 1)
        end_date = datetime(int(year), 6, 30)
    elif semester == "HT":
        start_date = datetime(int(year), 7, 1)
        end_date = datetime(int(year), 12, 31)

    committee_memberships = (
        db.session.query(StudentMembership)
        .join(
            CommitteePosition,
            StudentMembership.committee_position_id
            == CommitteePosition.committee_position_id,
        )
        .join(Student, StudentMembership.student_id == Student.student_id)
        .filter(
            CommitteePosition.role == CommitteePositionsRole.COMMITTEE,
            or_(
                StudentMembership.termination_date >= start_date,
                StudentMembership.termination_date == None,  # noqa
            ),
            StudentMembership.initiation_date <= end_date,
        )
        .options(
            joinedload(StudentMembership.student),  # type: ignore
            joinedload(StudentMembership.committee_position),  # type: ignore
        )
        .all()
    )

    return committee_memberships


def retrieve_student_membership_by_id(student_id):
    committee_memberships = (
        db.session.query(StudentMembership)
        .join(
            CommitteePosition,
            StudentMembership.committee_position_id
            == CommitteePosition.committee_position_id,
        )
        .filter(StudentMembership.student_id == student_id)
        .options(
            joinedload(StudentMembership.committee_position),  # type: ignore
        )
        .all()
    )

    return committee_memberships
