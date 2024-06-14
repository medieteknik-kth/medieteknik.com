from typing import Any, Dict, List
from sqlalchemy import func
from models.committees import Committee, CommitteePosition, CommitteeTranslation
from dataclasses import dataclass


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
    provided_languages: List[str],
    committee_settings: CommitteeSettings | None = None,
) -> Dict[str, Any] | None:
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

    committee_dict = committee.to_dict(provided_languages)

    if not committee_dict:
        return None

    if committee_settings.include_positions:
        committee_positions: List[CommitteePosition] = (
            CommitteePosition.query.filter_by(committee_id=committee.committee_id).all()
        )

        committee_dict["positions"] = [
            position.to_dict(provided_languages) for position in committee_positions
        ]

    return committee_dict
