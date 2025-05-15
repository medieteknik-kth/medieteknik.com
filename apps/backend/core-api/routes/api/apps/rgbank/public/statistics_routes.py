from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response
from sqlmodel import select

from config import Settings
from decorators import nextjs_auth_required
from dto.apps.rgbank.statistics import StatisticsDTO
from models.apps.rgbank import Statistics
from routes.api.deps import SessionDep
from services.apps.rgbank import (
    get_committee_statistic,
)
from utility import DEFAULT_LANGUAGE_CODE
from utility.translation import convert_iso_639_1_to_bcp_47

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "public/rgbank/statistics",
    tags=["RGBank", "Public", "Statistics"],
)


# --- GENERAL STATISTICS --- #


@router.get("/years", response_model=list[int])
async def get_years(session: SessionDep, _=Depends(nextjs_auth_required)):
    """Get all years with statistics."""
    stmt = select(Statistics.year).distinct()
    all_possible_years = session.exec(stmt).all()

    if not all_possible_years:
        return []

    all_possible_years: list[int] = [
        year[0] for year in all_possible_years if year is not None
    ]
    return all_possible_years


# --- COMMITTEE STATISTICS --- #


@router.get(
    "/committee/{committee_id}/year/{year}",
    response_model=StatisticsDTO,
    responses={HTTPStatus.NOT_FOUND: {"description": "Statistics were not found"}},
    status_code=HTTPStatus.OK,
)
async def get_committee_statistics_year(
    session: SessionDep,
    committee_id: Annotated[str, Path(title="Committee ID")],
    year: Annotated[int, Path(title="Year")],
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get statistics for a committee."""
    statistics = get_committee_statistic(session, committee_id=committee_id, year=year)
    language = convert_iso_639_1_to_bcp_47(language)

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)


@router.get(
    "/committee/{committee_id}/year/{year}/month/{month}",
    response_model=StatisticsDTO,
    responses={HTTPStatus.NOT_FOUND: {"description": "Statistics not found"}},
    status_code=HTTPStatus.OK,
)
def get_committee_statistics_month(
    session: SessionDep,
    committee_id: Annotated[str, Path(title="Committee ID")],
    year: Annotated[int, Path(title="Year")],
    month: Annotated[int, Path(title="Month")],
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get statistics for a committee."""
    language = convert_iso_639_1_to_bcp_47(language)

    statistics = get_committee_statistic(
        session=session,
        committee_id=committee_id,
        year=year,
        month=month,
    )

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)


@router.get(
    "/committee/{committee_id}/all_time",
    response_model=StatisticsDTO,
    responses={HTTPStatus.NOT_FOUND: {"description": "Statistics not found"}},
    status_code=HTTPStatus.OK,
)
async def get_committee_statistics_all_time(
    session: SessionDep,
    committee_id: Annotated[str, Path(title="Committee ID")],
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get all-time statistics for a committee."""
    language = convert_iso_639_1_to_bcp_47(language)

    statistics = get_committee_statistic(
        session=session,
        committee_id=committee_id,
    )

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)


@router.get(
    "/committees/year/{year}",
    response_model=list[StatisticsDTO],
    responses={HTTPStatus.NO_CONTENT: {"description": "No statistics found"}},
    status_code=HTTPStatus.OK,
)
async def get_all_committees_year(
    session: SessionDep,
    year: Annotated[int, Path(title="Year")],
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get statistics for all committees."""
    language = convert_iso_639_1_to_bcp_47(language)

    stmt = select(Statistics).where(
        Statistics.committee_id.is_not(None),
        Statistics.year == year,
        Statistics.month is None,
    )
    statistics = session.exec(stmt).all()

    if not statistics:
        return Response(status_code=HTTPStatus.NO_CONTENT)

    return [
        StatisticsDTO.from_orm_with_language(stat, language_code=language)
        for stat in statistics
    ]


@router.get(
    "/committees/year/{year}/month/{month}",
    response_model=list[StatisticsDTO],
    responses={HTTPStatus.NO_CONTENT: {"description": "No statistics found"}},
    status_code=HTTPStatus.OK,
)
async def get_all_committees_month(
    session: SessionDep,
    year: Annotated[int, Path(title="Year")],
    month: Annotated[int, Path(title="Month")],
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get statistics for all committees."""
    language = convert_iso_639_1_to_bcp_47(language)

    stmt = select(Statistics).where(
        Statistics.committee_id.is_not(None),
        Statistics.year == year,
        Statistics.month == month,
    )

    statistics = session.exec(stmt).all()

    if not statistics:
        return Response(status_code=HTTPStatus.NO_CONTENT)

    return [
        StatisticsDTO.from_orm_with_language(stat, language_code=language)
        for stat in statistics
    ]


@router.get(
    "/committees/all_time",
    response_model=list[StatisticsDTO],
    responses={HTTPStatus.NO_CONTENT: {"description": "No statistics found"}},
    status_code=HTTPStatus.OK,
)
def get_all_committees_all_time(
    session: SessionDep,
    language: Annotated[str | None, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    _=Depends(nextjs_auth_required),
):
    """Get all-time statistics for all committees."""
    language = convert_iso_639_1_to_bcp_47(language)

    stmt = select(Statistics).where(
        Statistics.committee_id.is_not(None),
        Statistics.is_all_time.is_(True),
    )

    statistics = session.exec(stmt).all()

    if not statistics:
        return Response(status_code=HTTPStatus.NO_CONTENT)

    return [
        StatisticsDTO.from_orm_with_language(stat, language_code=language)
        for stat in statistics
    ]
