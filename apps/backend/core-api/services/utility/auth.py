from typing import Any, Dict, List, Tuple

from sqlmodel import select

from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.author import Author, AuthorResource
from models.core.permissions import Permissions, Role, StudentPermission
from models.core.student import Student, StudentMembership
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db


def get_student_authorization(
    student: Student,
) -> Tuple[List[Dict[str, Any]], str]:
    """
    Gets the student's permissions and role.
        :param student: Student - The student object.
        :return: Tuple[List[Dict[str, Any]], str] - The permissions and role.
    """
    permissions = {
        "author": [],
        "student": [],
    }
    role = Role.OTHER.value

    stmt = (
        select(
            Student.student_id,
            Author.resources,
            StudentPermission.role,
            StudentPermission.permissions,
        )
        .join(Author, Student.student_id == Author.student_id)
        .join(StudentPermission, Student.student_id == StudentPermission.student_id)
        .where(Student.student_id == student.student_id)
    )

    result = db.session.execute(stmt).first()
    role_result: Role = result.role if result else Role.OTHER
    permissions_result: List[Permissions] = result.permissions if result else []
    resources_result: List[AuthorResource] = result.resources if result else []

    if not result:
        return permissions, role

    role = role_result.value
    permissions["author"] = [resource.value for resource in resources_result]
    permissions["student"] = [permission.value for permission in permissions_result]

    return permissions, role


def get_student_committee_details(
    provided_languages: List[str] = AVAILABLE_LANGUAGES, student: Student | None = None
) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Retrieves the student's permissions, role, committees, and committee positions, if they exist.
        :param provided_languages: List[str] - The list of languages that the user can view.
        :param student: Student - The student object.
        :return: Tuple[List[Dict[str, Any]], List[Dict[str, Any]]] - The committees and committee positions.
    """
    if student is None:
        return None

    committees = []
    committee_positions = []

    stmt = (
        select(
            Student.student_id,
            CommitteePosition,
            Committee,
        )
        .join(StudentMembership, Student.student_id == StudentMembership.student_id)
        .join(
            CommitteePosition,
            StudentMembership.committee_position_id
            == CommitteePosition.committee_position_id,
        )
        .join(Committee, CommitteePosition.committee_id == Committee.committee_id)
        .where(Student.student_id == student.student_id)
    )

    result = db.session.execute(stmt).unique().all()

    if len(result) == 0 or result is None:
        return committees, committee_positions

    for index, _ in enumerate(result):
        committee_position: CommitteePosition = result[index][1]
        committee: Committee = result[index][2]

        position_dict = committee_position.to_dict(
            provided_languages=provided_languages, is_public_route=False
        )

        committee_positions.append(position_dict)

        committee_dict = committee.to_dict(provided_languages=provided_languages)

        if committee_dict in committees:
            continue

        committees.append(committee_dict)

    return committees, committee_positions
