"""
Public Committee service
"""

from datetime import datetime
from typing import Any, Dict, Sequence

from sqlmodel import Session, func, or_, select

from models.committees import (
    Committee,
    CommitteePosition,
    CommitteeTranslation,
)
from models.core import StudentMembership


def get_all_committees(session: Session) -> Sequence[Committee]:
    return session.exec(select(Committee).where(Committee.hidden.is_(False))).all()


def get_committee_by_title(
    session: Session,
    title: str,
) -> Committee | None:
    translation = session.exec(
        select(CommitteeTranslation).where(
            func.lower(CommitteeTranslation.title) == title.lower()
        )
    ).first()

    if not translation:
        return None

    committee = session.exec(
        select(Committee).where(
            Committee.committee_id == translation.committee_id,
            Committee.hidden.is_(False),
        )
    ).first()

    return committee


def get_committee_data_by_title(
    session: Session,
    title: str,
) -> Dict[str, Any] | None:
    translation = session.exec(
        select(CommitteeTranslation).where(
            func.lower(CommitteeTranslation.title) == title.lower()
        )
    ).first()

    if not translation:
        return None

    committee = session.exec(
        select(Committee).where(
            Committee.committee_id == translation.committee_id,
            Committee.hidden.is_(False),
        )
    ).first()

    if not committee:
        return None

    data = {
        "members": [],
        "positions": [],
        "total_news": committee.total_news,
        "total_events": committee.total_events,
        "total_documents": committee.total_documents,
        "total_media": committee.total_media,
    }

    # Members
    positions = session.exec(
        select(CommitteePosition).where(
            CommitteePosition.committee_id == committee.committee_id,
        )
    ).all()

    if positions:
        data["positions"] = [position for position in positions]
        members = session.exec(
            select(StudentMembership).where(
                StudentMembership.committee_position_id.in_(
                    position.committee_position_id for position in positions
                ),
                or_(
                    StudentMembership.termination_date == None,  # noqa
                    StudentMembership.termination_date > datetime.now(),
                ),
            )
        ).all()
        data["members"] = [member for member in members]

    return data
