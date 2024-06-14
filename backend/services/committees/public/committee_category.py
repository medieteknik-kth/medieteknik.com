from sqlalchemy import func
from models.committees import (
    Committee,
    CommitteeCategory,
    CommitteeCategoryTranslation,
)
from utility.constants import AVAILABLE_LANGUAGES
from typing import Any, Dict, List
from dataclasses import dataclass


@dataclass
class CommitteeCategorySettings:
    """
    Settings for the committee category service.

    Attributes:
        include_committees (bool): Whether to include all committees that belong to the committee category in the response.
    """

    include_committees: bool = False


def get_all_committee_categories(
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
) -> List[Dict[str, Any]]:
    """
    Retrieves all committee categories from the database.

    Args:
        provided_languages (List[str], optional): The languages to include in the response. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        List[Dict[str, Any]]: A list of committee category dictionaries.
    """
    committee_categories: List[CommitteeCategory] = CommitteeCategory.query.all()

    return [
        committee_category_dict
        for committee_category in committee_categories
        if (
            committee_category_dict := committee_category.to_dict(
                provided_languages=provided_languages
            )
        )
        is not None
    ]


def get_committee_category_by_title(
    title: str,
    provided_languages: List[str] = AVAILABLE_LANGUAGES,
    committee_category_settings: CommitteeCategorySettings | None = None,
) -> Dict[str, Any] | None:
    """
    Retrieves a committee category from the database by its name.

    Args:
        title (str): The title of the committee category.
        provided_languages (List[str], optional): The languages to include in the response. Defaults to AVAILABLE_LANGUAGES.
        committee_category_settings (CommitteeCategorySettings | None, optional): Additional settings. Defaults to None.

    Returns:
        Dict[str, Any] | None: A committee category dictionary.
    """
    if not committee_category_settings:
        committee_category_settings = CommitteeCategorySettings()

    translation = CommitteeCategoryTranslation.query.filter(
        func.lower(CommitteeCategoryTranslation.title) == func.lower(title)
    ).first()

    if not translation:
        return None

    committee_category: CommitteeCategory | None = CommitteeCategory.query.get(
        translation.committee_category_id
    )

    if not committee_category:
        return None

    committee_category_dict = committee_category.to_dict(
        provided_languages=provided_languages
    )

    if not committee_category_dict:
        return None

    if committee_category_settings.include_committees:
        committees: List[Committee] = Committee.query.filter_by(
            committee_category_id=committee_category.committee_category_id
        ).all()

        committee_category_dict["committees"] = [
            committee.to_dict(provided_languages=provided_languages)
            for committee in committees
        ]

    return committee_category_dict
