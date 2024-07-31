"""
The public service for student related queries
"""

from sqlalchemy.orm import joinedload
from models.committees.committee_position import (
    CommitteePosition,
    CommitteePositionsRole,
)
from models.core.student import Student, StudentMembership
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
        .filter(CommitteePosition.role == CommitteePositionsRole.COMMITTEE)
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
