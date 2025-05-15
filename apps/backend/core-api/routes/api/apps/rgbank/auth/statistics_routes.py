from http import HTTPStatus
from typing import Annotated, Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Path, Query

from config import Settings
from decorators.jwt import get_jwt_identity, jwt_required
from dto.apps.rgbank.statistics import StatisticsDTO
from routes.api.deps import SessionDep
from services.apps.rgbank import (
    get_student_statistic,
)
from utility import DEFAULT_LANGUAGE_CODE

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/rgbank/statistics",
    tags=["RGBank", "Statistics"],
)


@router.get(
    "/year/{year}",
    response_model=StatisticsDTO,
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.NOT_FOUND: {
            "description": "Statistics not found",
        },
    },
)
async def get_student_statistics_year(
    session: SessionDep,
    year: Annotated[int, Path(title="Year", ge=2000, le=2100)],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """Get statistics for a student."""

    student_id = get_jwt_identity(jwt)

    statistics = get_student_statistic(
        session=session, student_id=student_id, year=year, month=None
    )

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)


@router.get(
    "/year/{year}/month/{month}",
    response_model=StatisticsDTO,
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.NOT_FOUND: {
            "description": "Statistics not found",
        },
    },
)
async def get_student_statistics_month(
    session: SessionDep,
    year: Annotated[int, Path(title="Year", ge=2000, le=2100)],
    month: Annotated[int, Path(title="Month", ge=1, le=12)],
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """Get statistics for a student."""

    student_id = get_jwt_identity(jwt)

    statistics = get_student_statistic(
        session=session, student_id=student_id, year=year, month=month
    )

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)


@router.get(
    "/all_time",
    response_model=StatisticsDTO,
    status_code=HTTPStatus.OK,
    responses={
        HTTPStatus.NOT_FOUND: {
            "description": "Statistics not found",
        },
    },
)
async def get_student_statistics_all_time(
    session: SessionDep,
    language: Annotated[str, Query(title="Language")] = DEFAULT_LANGUAGE_CODE,
    jwt: Dict[str, Any] = Depends(jwt_required),
):
    """Get all-time statistics for a student."""

    student_id = get_jwt_identity(jwt)

    statistics = get_student_statistic(
        session=session,
        student_id=student_id,
        year=None,
        month=None,
    )

    if statistics is None:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Statistics not found",
        )

    return StatisticsDTO.from_orm_with_language(statistics, language_code=language)
