"""
Calendar Routes (Public)
API Endpoint: '/api/v1/public/calendar'
"""

import datetime
from http import HTTPStatus

from fastapi import APIRouter
from flask import Blueprint, jsonify, make_response

from config import Settings
from services.content.public import get_events_monthly
from utility import retrieve_languages

public_calendar_bp = Blueprint("public_calendar", __name__)

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/public/calendar",
    tags=["Public", "Calendar"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/events",
)
def get_events(
    date: str | None = None,
    language: str | None = None,
):
    """
    Retrieves all events
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(language)

    if not date:
        date = datetime.datetime.now().strftime("%Y-%m")

    response = make_response(
        jsonify(
            get_events_monthly(date_str=date, provided_languages=provided_languages)
        )
    )

    response.headers["Cache-Control"] = "pubilc, no-store, max-age=0"
    response.status_code = HTTPStatus.OK

    return response
