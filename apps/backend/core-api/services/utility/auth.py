from typing import Dict, List, Tuple

from sqlmodel import Session, select

from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.author import Author
from models.core.permissions import Role, StudentPermission
from models.core.student import Student, StudentMembership


def get_student_authorization(
    session: Session,
    student: Student,
) -> Tuple[Dict[str, List[str]], str]:
    """
    Retrieves the student's permissions and role.

    Args:
        session (Session): The database session.
        student (Student): The student object.

    Returns:
        Tuple[Dict[str, List[str]], str]: A tuple containing the permissions and role.
    """
    permissions = {
        "author": [],
        "student": [],
    }
    role = Role.OTHER.value

    stmt = (
        select(
            Student,
            Author,
            StudentPermission,
        )
        .join(Author, Student.student_id == Author.student_id)
        .join(StudentPermission, Student.student_id == StudentPermission.student_id)
        .where(Student.student_id == student.student_id)
    )

    result = session.exec(stmt).first()

    if not result:
        return permissions, role

    _, author, student_permission = result

    role_result: Role = student_permission.role if student_permission else Role.OTHER
    permissions_result = student_permission.permissions if student_permission else None
    resources_result = author.resources if author else None

    if not resources_result or not permissions_result:
        return permissions, role

    role = role_result.value
    permissions["author"] = [resource.value for resource in resources_result]
    permissions["student"] = [permission.value for permission in permissions_result]

    return permissions, role


def get_student_committee_details(
    session: Session,
    student: Student | None = None,
) -> Tuple[list, list] | None:
    """
    Retrieves the student's committees and committee positions.

    Args:
        session (Session): The database session.
        student (Student | None): The student object. If None, the function returns None.

    Returns:
        Tuple[list, list] | None: A tuple containing the committees and committee positions.
    """
    if student is None:
        return None

    committees = []
    committee_positions = []

    stmt = (
        select(
            Student,
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
        .distinct()
    )

    result = session.exec(stmt).all()

    if len(result) == 0 or result is None:
        return committees, committee_positions

    for data in result:
        committee_position = data[1]
        committee = data[2]

        committee_positions.append(committee_position)

        if committee in committees:
            continue

        committees.append(committee)

    return committees, committee_positions
