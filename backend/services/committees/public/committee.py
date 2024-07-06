from typing import Any, Dict, List
from dataclasses import dataclass
from sqlalchemy import func
from models.committees import Committee, CommitteePosition, CommitteeTranslation
from models.content.album import Album
from models.content.author import Author, AuthorType
from models.content.document import Document
from models.content.event import Event
from models.content.news import News
from models.core.student import StudentMembership
from .committee_position import get_committee_positions_by_committee_title


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


def get_committee_data_by_title(title: str) -> Dict[str, Any] | None:
    """
    Retrieves a committee from the database by its name.

    Args:
        title (str): The title of the committee.

    Returns:
        Dict[str, Any] | None: A committee dictionary.
    """
    committee: Committee | None = CommitteeTranslation.query.filter(
        func.lower(CommitteeTranslation.title) == func.lower(title)
    ).first()

    if not committee:
        return None

    committee_author = Author.query.filter_by(
        author_type=AuthorType.COMMITTEE, entity_id=committee.committee_id
    ).first()

    data = {
        "members": {"ids": [], "total": 0},
        "positions": {"ids": [], "total": 0},
        "news": {"ids": [], "total": 0},
        "events": {"ids": [], "total": 0},
        "documents": {"ids": [], "total": 0},
        "albums": {"ids": [], "total": 0},
    }

    # Members
    positions: List[CommitteePosition] | None = (
        get_committee_positions_by_committee_title(title)
    )
    if positions:
        data["positions"]["ids"] = [
            position.committee_position_id for position in positions
        ]
        data["positions"]["total"] = len(positions)
        members = StudentMembership.query.filter_by(
            committee_position_id=[
                position.committee_position_id for position in positions if position
            ]
        ).all()
        if members:
            members: List[StudentMembership] = members
            data["members"]["ids"] = [member.student_id for member in members]
            data["members"]["total"] = len(members)

    # Articles
    if committee_author:
        all_news = News.query.filter_by(author_id=committee_author.author_id).all()
        if all_news:
            all_news: List[News] = all_news
            data["news"]["ids"] = [news.news_id for news in all_news]
            data["news"]["total"] = len(all_news)

    # Events
    if committee_author:
        all_events = Event.query.filter_by(author_id=committee_author.author_id).all()
        if all_events:
            all_events: List[Event] = all_events
            data["events"]["ids"] = [event.event_id for event in all_events]
            data["events"]["total"] = len(all_events)

    # Documents
    if committee_author:
        all_documents = Document.query.filter_by(
            author_id=committee_author.author_id
        ).all()
        if all_documents:
            all_documents: List[Document] = all_documents
            data["documents"]["ids"] = [
                document.document_id for document in all_documents
            ]
            data["documents"]["total"] = len(all_documents)

    # Images
    if committee_author:
        all_albums = Album.query.filter_by(author_id=committee_author.author_id).all()
        if all_albums:
            all_albums: List[Album] = all_albums
            data["albums"]["ids"] = [album.album_id for album in all_albums]
            data["albums"]["total"] = len(all_albums)

    return data
