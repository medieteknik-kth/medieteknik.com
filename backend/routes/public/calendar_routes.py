"""
Calendar Routes (Public)
API Endpoint: '/api/v1/public/calendar'
"""

import datetime
from flask import Blueprint, jsonify, request
from services.content.public.calendar import get_main_calendar, get_events_monthly
from utility.translation import retrieve_languages

public_calendar_bp = Blueprint("public_calendar", __name__)


@public_calendar_bp.route("/")
def get_calendar():
    return jsonify(get_main_calendar().to_dict())


@public_calendar_bp.route("/events")
def get_events():
    date = request.args.get("date")
    provided_languages = retrieve_languages(request.args)

    if not date:
        date = datetime.datetime.now().strftime("%Y-%m")

    return jsonify(
        get_events_monthly(date_str=date, provided_languages=provided_languages)
    )
