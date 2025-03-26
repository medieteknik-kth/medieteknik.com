"""
Calendar Routes (Public)
API Endpoint: '/api/v1/public/calendar'
"""

import datetime
from http import HTTPStatus
from flask import Blueprint, jsonify, make_response, request
from services.content.public import get_events_monthly
from utility import retrieve_languages

public_calendar_bp = Blueprint("public_calendar", __name__)


@public_calendar_bp.route("/events", methods=["GET"])
def get_events():
    """
    Retrieves all events
        :return: Response - The response object, 200 if successful
    """

    date = request.args.get("date")
    provided_languages = retrieve_languages(request.args)

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
