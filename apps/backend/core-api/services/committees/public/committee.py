"""
Public Committee service
"""

from typing import Any, Dict, List
from dataclasses import dataclass
from sqlalchemy import func, or_
from models.committees import (
    Committee,
    CommitteePosition,
    CommitteeTranslation,
)
from models.core import StudentMembership
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
    committees: List[Committee] = Committee.query.filter_by(hidden=False).all()

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
        committee_settings (CommitteeSettings | None, optional): Additional settings. Defaults to None.

    Returns:
        Dict[str, Any] | None: A committee dictionary.
    """
    committee_settings = committee_settings or CommitteeSettings()

    translation: CommitteeTranslation | None = CommitteeTranslation.query.filter(
        func.lower(CommitteeTranslation.title) == func.lower(title)
    ).first()

    if not translation:
        return None

    committee: Committee | None = Committee.query.get(translation.committee_id)

    return committee


def get_committee_data_by_title(
    title: str,
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
    is_public_route: bool = True,
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
        "members": {
            "items": [],
            "page": 1,
            "per_page": 10,
            "total_items": 0,
            "total_pages": 1,
        },
        "positions": [],
        "total_news": committee.total_news,
        "total_events": committee.total_events,
        "total_documents": committee.total_documents,
        "total_media": committee.total_media,
    }

    # Members
    positions: List[CommitteePosition] | None = (
        get_committee_positions_by_committee_title(committee_title=title)
    )
    if positions:
        data["positions"] = [
            position.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
            for position in positions
        ]
        members = StudentMembership.query.filter(
            StudentMembership.committee_position_id.in_(
                position.committee_position_id for position in positions
            ),
            or_(
                StudentMembership.termination_date == None,  # noqa
                StudentMembership.termination_date > datetime.now(),
            ),
        ).paginate(per_page=10, max_per_page=25)
        data["members"] = {
            "items": [
                member.to_dict(is_public_route=is_public_route)
                for member in members.items
            ],
            "page": members.page,
            "per_page": members.per_page,
            "total_pages": members.pages,
            "total_items": members.total,
        }
    return data
