"""
Public Committee
"""

from typing import Any, Dict, List
from dataclasses import dataclass
from sqlalchemy import func
from models.committees import (
    Committee,
    CommitteePosition,
    CommitteeTranslation,
    CommitteeRecruitment,
)
from models.core.student import Student, StudentMembership
from utility.constants import AVAILABLE_LANGUAGES
from .committee_position import get_committee_positions_by_committee_title
from datetime import datetime


@dataclass
class CommitteeSettings:
    """
    Settings for the committee service.

    Attributes:
        include_positions (bool): Whether to include all committee positions in the response.
    """

    include_positions: bool = False


def get_all_committees(provided_languages: List[str]) -> List[Dict[str, Any]]:
    """
    Retrieves all committees from the database.

    Args:
        provided_languages (List[str]): The languages to include in the response.

    Returns:
        List[Dict[str, Any]]: A list of committee dictionaries.
    """
    committees: List[Committee] = Committee.query.all()

    return [
        committee_dict
        for committee in committees
        if (committee_dict := committee.to_dict(provided_languages)) is not None
    ]


def get_committee_by_title(
    title: str,
    committee_settings: CommitteeSettings | None = None,
) -> Committee | None:
    """
    Retrieves a committee from the database by its name.

    Args:
        title (str): The title of the committee.
        provided_languages (List[str]): The languages to include in the response.
        committee_settings (CommitteeSettings | None, optional): Additional settings. Defaults to None.

    Returns:
        Dict[str, Any] | None: A committee dictionary.
    """
    if not committee_settings:
        committee_settings = CommitteeSettings()

    translation: CommitteeTranslation | None = CommitteeTranslation.query.filter(
        func.lower(CommitteeTranslation.title) == func.lower(title)
    ).first()

    if not translation:
        return None

    committee: Committee | None = Committee.query.get(translation.committee_id)

    if not committee:
        return None

    return committee


def get_all_members_by_title(
    title: str, positions: List[CommitteePosition] | None = None
) -> List[StudentMembership]:
    committee: Committee | None = get_committee_by_title(title)

    if not committee:
        return None

    if not positions:
        positions = get_committee_positions_by_committee_title(title)

    members: List[StudentMembership] = []

    for position in positions:
        for member in StudentMembership.query.filter_by(
            committee_position_id=position.committee_position_id
        ).all():
            members.append(member)

    return members


def get_committee_data_by_title(
    title: str, provided_languages: List[str] = AVAILABLE_LANGUAGES
) -> Dict[str, Any] | None:
    """
    Retrieves a committee from the database by its name.

    Args:
        title (str): The title of the committee.

    Returns:
        Dict[str, Any] | None: A committee dictionary.
    """
    committee_translation: CommitteeTranslation | None = (
        CommitteeTranslation.query.filter(
            func.lower(CommitteeTranslation.title) == func.lower(title)
        ).first()
    )

    if not committee_translation or not isinstance(
        committee_translation, CommitteeTranslation
    ):
        return None

    committee: Committee | None = Committee.query.get(
        committee_translation.committee_id
    )

    if not committee:
        return None

    data = {
        "members": [],
        "positions": [],
        "total_news": committee.total_news,
        "total_events": committee.total_events,
        "total_documents": committee.total_documents,
    }

    # Members
    positions: List[CommitteePosition] | None = (
        get_committee_positions_by_committee_title(
            committee_title=title, provided_languages=provided_languages
        )
    )
    if positions:
        data["positions"] = [position.to_dict() for position in positions]
        members = get_all_members_by_title(title, positions)
        if members:
            members: List[StudentMembership] = members
            students: List[Student] = []
            for member in members:
                student: Student | None = Student.query.get(member.student_id)
                if student:
                    students.append(student.to_dict(is_public_route=False))

            data["members"] = students

    return data


def get_all_recruitments(provided_languages: List[str]) -> List[Dict[str, Any]]:
    recruting: List[Any] = CommitteeRecruitment.query.filter(
        CommitteeRecruitment.end_date > datetime.now()
    ).all()

    return [
        recruitment_dict
        for recruitment in recruting
        if (recruitment_dict := recruitment.to_dict(provided_languages)) is not None
    ]
