"""
Committee Routes (Protected)
API Endpoint: '/api/v1/committees'
"""

from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException, Path, Query, Response
from sqlmodel import select

from config import Settings
from decorators.jwt import jwt_required
from dto.committees.committee import CommitteeDataDTO, UpdateCommitteeDTO
from dto.committees.committee_position import PublicCommitteePositionDTO
from dto.content.document import DocumentDTO
from dto.content.event import EventDTO
from dto.content.news import NewsDTO
from models.content import Document, Event, News
from models.core import Author
from routes.api.deps import SessionDep
from services.committees.public import (
    get_committee_by_title,
    get_committee_data_by_title,
    get_committee_positions_by_committee_title,
)
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.parser import validate_form_to_msgspec
from utility.translation import convert_iso_639_1_to_bcp_47

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/committees",
    tags=["Committees"],
)


@router.get("/{committee_title}/data", response_model=CommitteeDataDTO)
def get_committees_data_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(jwt_required),
):
    result = get_committee_data_by_title(
        session=session,
        title=committee_title,
    )

    if result is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f"Committee with title '{committee_title}' not found",
        )

    return CommitteeDataDTO.from_orm_with_language(
        obj=result,
        language_code=convert_iso_639_1_to_bcp_47(language),
    )


@router.get(
    "/{committee_title}/news",
)
def get_committee_news_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(jwt_required),
):
    """
    Retrieves the paginated news items for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    committee = get_committee_by_title(
        session=session,
        title=committee_title,
    )

    if not committee:
        raise None

    news = session.exec(
        select(News)
        .join(Author, News.author_id == Author.author_id)
        .where(Author.committee_id == committee.committee_id)
        .order_by(News.created_at.desc())
    ).all()

    return [
        NewsDTO.from_orm_with_language(
            obj=news_item,
            language_code=convert_iso_639_1_to_bcp_47(language),
        )
        for news_item in news
    ]


@router.get(
    "/{committee_title}/events",
)
def get_committee_events_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(jwt_required),
):
    committee = get_committee_by_title(session=session, title=committee_title)

    if not committee:
        return None

    events = session.exec(
        select(Event)
        .join(Author, Event.author_id == Author.author_id)
        .where(Author.committee_id == committee.committee_id)
        .order_by(Event.created_at.desc())
    ).all()

    return [
        EventDTO.from_orm_with_language(
            obj=event,
            language_code=convert_iso_639_1_to_bcp_47(language),
        )
        for event in events
    ]


@router.get(
    "/{committee_title}/documents",
)
def get_committee_documents_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(jwt_required),
):
    """
    Retrieves the paginated document items for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    committee = get_committee_by_title(title=committee_title)

    if not committee:
        return None

    documents = session.exec(
        select(Document)
        .join(Author, Document.author_id == Author.author_id)
        .where(Author.committee_id == committee.committee_id)
        .order_by(Document.created_at.desc())
    ).all()

    return [
        DocumentDTO.from_orm_with_language(
            obj=document,
            language_code=convert_iso_639_1_to_bcp_47(language),
        )
        for document in documents
    ]


@router.get(
    "/{committee_title}/positions",
)
def get_committee_positions_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(jwt_required),
):
    """
    Retrieves the committee positions by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 404 if the committee is not found, 200 if successful
    """

    result = get_committee_positions_by_committee_title(
        session=session, committee_title=committee_title
    )

    if not result:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f"Committee with title '{committee_title}' not found",
        )

    return PublicCommitteePositionDTO.from_orm_with_language(
        obj=result,
        language_code=convert_iso_639_1_to_bcp_47(language),
    )


@router.put(
    "/{committee_title}",
)
def update_committee_by_title(
    session: SessionDep,
    committee_title: Annotated[str, Path(title="Committee Title")],
    translations: Annotated[list[str], Form()],
    logo_url: Annotated[str, Form()],
    group_photo_url: Annotated[str, Form()],
    _=Depends(jwt_required),
):
    """
    Updates the committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """
    form_data = {
        "translations": translations,
        "logo_url": logo_url,
        "group_photo_url": group_photo_url,
    }

    validated_data = validate_form_to_msgspec(
        form_data=form_data,
        model_type=UpdateCommitteeDTO,
    )

    committee = get_committee_by_title(
        session=session,
        title=committee_title,
    )

    if not committee:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail=f"Committee with title '{committee_title}' not found",
        )

    committee.logo_url = validated_data.logo_url
    committee.group_photo_url = validated_data.group_photo_url

    for translation in validated_data.translations:
        existing_translation = next(
            (
                t
                for t in committee.translations
                if t.language_code == translation.language_code
            ),
            None,
        )
        if existing_translation:
            existing_translation.title = translation.title
            existing_translation.description = translation.description
        else:
            committee.translations.append(translation)
    session.add(committee)
    session.commit()
    session.refresh(committee)

    return Response(status_code=HTTPStatus.OK)
