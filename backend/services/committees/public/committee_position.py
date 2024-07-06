from sqlalchemy import func
from models.committees import CommitteePosition, CommitteePositionTranslation
from models.committees.committee import Committee, CommitteeTranslation
from utility.constants import AVAILABLE_LANGUAGES
from typing import Any, Dict, List


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
    committee_title: str, provided_languages: List[str] = AVAILABLE_LANGUAGES
) -> List[CommitteePosition] | None:
    """
    Retrieves all committee positions from the database by its committee title.

    Args:
        committee_title (str): The title of the committee.
        provided_languages (List[str], optional): The languages to include in the response. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        List[Dict[str, Any]]: A list of committee position dictionaries.
    """

    committee_translation: CommitteeTranslation | None = (
        CommitteeTranslation.query.filter(
            func.lower(CommitteeTranslation.title) == func.lower(committee_title)
        ).first()
    )

    if not committee_translation:
        return None

    committee: Committee | None = Committee.query.get(
        committee_translation.committee_id
    )

    if not committee:
        return None

    committee_positions: List[CommitteePosition] = CommitteePosition.query.filter_by(
        committee_id=committee.committee_id
    ).all()

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
