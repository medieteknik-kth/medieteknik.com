from datetime import datetime
from typing import Any, Dict, List, Sequence

from sqlmodel import Session, func, select

from models.committees import (
    Committee,
    CommitteePosition,
    CommitteePositionTranslation,
    CommitteeTranslation,
)
from models.core import Student, StudentMembership
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db


def get_committee_position_by_title(
    title: str, provided_languages: List[str] = AVAILABLE_LANGUAGES
) -> Dict[str, Any] | None:
    """
    Retrieves a committee position from the database by its name.

    Args:
        title (str): The title of the committee position.
        provided_languages (List[str], optional): The languages to include in the response. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        Dict[str, Any] | None: A committee position dictionary.
    """

    translation: CommitteePositionTranslation | None = (
        CommitteePositionTranslation.query.filter(
            func.lower(CommitteePositionTranslation.title) == func.lower(title)
        ).first()
    )

    if not translation:
        return None

    committee_position: CommitteePosition | None = CommitteePosition.query.get(
        translation.committee_position_id
    )

    if not committee_position:
        return None

    committee_position_dict = committee_position.to_dict(
        provided_languages=provided_languages, is_public_route=True
    )

    return committee_position_dict


def get_committee_positions_by_committee_title(
    session: Session,
    committee_title: str,
) -> Sequence[CommitteePosition] | None:
    """
    Retrieves all committee positions from the database by its committee title.

    Args:
        committee_title (str): The title of the committee.
        provided_languages (List[str], optional): The languages to include in the response. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        List[Dict[str, Any]]: A list of committee position dictionaries.
    """

    translation = session.exec(
        select(CommitteeTranslation).where(
            func.lower(CommitteeTranslation.title) == committee_title.lower()
        )
    ).first()

    if not translation:
        return None

    committee = session.exec(
        select(Committee).where(Committee.committee_id == translation.committee_id)
    ).first()

    if not committee:
        return None

    committee_positions = session.exec(
        select(CommitteePosition).where(
            CommitteePosition.committee_id == committee.committee_id,
            CommitteePosition.active.is_(True),
        )
    ).all()

    if not committee_positions:
        return None

    return committee_positions


def get_member_from_position_id(position_id: int) -> Dict[str, Any] | None:
    """
    Retrieves a member from the database by its position id.

    Args:
        position_id (int): The id of the position.

    Returns:
        Dict[str, Any] | None: A member dictionary.
    """

    committee_position: CommitteePosition | None = CommitteePosition.query.get(
        position_id
    )

    if not committee_position:
        return None

    committee_position_dict = committee_position.to_dict(
        provided_languages=AVAILABLE_LANGUAGES, is_public_route=True
    )

    return committee_position_dict


def get_all_committee_members(
    committee: Committee,
    date: str | None,
    officials: bool,
    provided_languages: List[str],
    page: int = 1,
    per_page: int = 10,
) -> List[Dict[str, Any]]:
    """
    Retrieves all committee members from the database.

    :param committee - The committee to retrieve members from
    :type committee - Committee
    :param date - The exact date (YYY-MM-DD) to retrieve members for if not None
    :type date - str | None
    :param provided_languages - The languages to include in the response
    :type provided_languages - List[str]
    :param page - The page number to retrieve
    :type page - int
    :param per_page - The number of items per page
    :type per_page - int
    """
    if per_page > 25:
        per_page = 25
    if per_page < 1:
        per_page = 1

    offset = (page - 1) * per_page
    query = None

    if date:
        # Snapshot query, get all members that were active on the given date
        target_date = datetime.strptime(date, "%Y-%m-%d")
        query = (
            db.session.query(StudentMembership)
            .join(
                CommitteePosition,
                CommitteePosition.committee_position_id
                == StudentMembership.committee_position_id,
            )
            .filter_by(
                committee_id=committee.committee_id,
            )
            .filter(
                and_(
                    StudentMembership.initiation_date <= target_date,
                    or_(
                        StudentMembership.termination_date >= target_date,
                        StudentMembership.termination_date.is_(None),
                    ),
                ),
                CommitteePosition.role == "COMMITTEE"
                if officials
                else (
                    or_(
                        CommitteePosition.role == "COMMITTEE",
                        CommitteePosition.role == "MEMBER",
                    )
                ),
            )
            .options(
                joinedload(StudentMembership.student),  # type: ignore
                joinedload(StudentMembership.committee_position),  # type: ignore
            )
            .limit(per_page)
            .offset(offset)
        )
    else:
        query = (
            db.session.query(StudentMembership)
            .join(
                CommitteePosition,
                CommitteePosition.committee_position_id
                == StudentMembership.committee_position_id,
            )
            .filter_by(
                committee_id=committee.committee_id,
            )
            .filter(
                StudentMembership.termination_date.is_(None),
                CommitteePosition.active.is_(True),
                CommitteePosition.role == "COMMITTEE"
                if officials
                else (
                    or_(
                        CommitteePosition.role == "COMMITTEE",
                        CommitteePosition.role == "MEMBER",
                    )
                ),
            )
            .join(
                Student,
                StudentMembership.student_id == Student.student_id,
            )
            .options(
                joinedload(StudentMembership.student),  # type: ignore
                joinedload(StudentMembership.committee_position),  # type: ignore
            )
            .limit(per_page)
            .offset(offset)
        )

    committee_memberships = query.all()

    total_members = query.count()
    total_pages = (total_members + per_page - 1) // per_page

    return {
        "items": [
            {
                "student": membership.student.to_dict(),
                "position": membership.committee_position.to_dict(
                    provided_languages=provided_languages
                ),
                "initiation_date": membership.initiation_date,
                "termination_date": membership.termination_date,
            }
            for membership in committee_memberships
        ],
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages,
        "total_items": total_members,
    }


def recruit_for_position():
    pass
