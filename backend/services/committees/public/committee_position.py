from sqlalchemy import func
from models.committees import CommitteePosition, CommitteePositionTranslation
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
