"""
The public service for student related queries
"""

from datetime import datetime
from sqlalchemy import or_
from sqlalchemy.orm import joinedload
from models.committees import (
    CommitteePosition,
    CommitteePositionsRole,
)
from models.core import Student, StudentMembership
from utility.database import db


def retrieve_all_committee_members(languages):
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
            StudentMembership.termination_date == None,  # noqa
        )
        .options(
            joinedload(StudentMembership.student),  # type: ignore
            joinedload(StudentMembership.committee_position),  # type: ignore
        )
        .all()
    )

    return committee_memberships


def get_officials(languages, date):
    if not date:
        committee_memberships = retrieve_all_committee_members(languages)
        return committee_memberships

    QUARTER_START_MONTHS = {
        "Q1": 1,  # January
        "Q2": 4,  # April
        "Q3": 7,  # July
        "Q4": 10,  # October
    }

    start_year, end_year = date.split("-")

    try:
        start_year = int(start_year)
        end_year = int(end_year)
    except ValueError:
        return None

    start_date = datetime(start_year, QUARTER_START_MONTHS["Q3"], 1)
    end_date = datetime(end_year, QUARTER_START_MONTHS["Q2"], 1)

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
