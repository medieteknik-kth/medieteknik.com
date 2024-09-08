"""
Calendar Routes (Protected)
API Endpoint: '/api/v1/calendar'
"""

from calendar import monthrange
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import List
from flask import Blueprint, Response, jsonify, request
from sqlalchemy import or_

from models.content.event import Event
from models.core.student import Student
from services.content.event import generate_events, generate_ics
from services.content.public.calendar import get_main_calendar
from utility.translation import retrieve_languages


calendar_bp = Blueprint("calendar", __name__)


@calendar_bp.route("/ics")
def get_calendar_ics():
    student = request.args.get("u", type=str)

    if not student:
        return jsonify({}), HTTPStatus.BAD_REQUEST

    student_exist = Student.query.get(student)

    if not student_exist:
        return jsonify({}), HTTPStatus.NOT_FOUND

    provided_langauges = retrieve_languages(request.args)

    main_calendar = get_main_calendar()

    date = datetime.now()

    start_date = (date - timedelta(days=1)).replace(day=1)

    # Handle year and month transition for the next month
    if date.month == 12:
        next_month = 1
        next_month_year = date.year + 1
    else:
        next_month = date.month + 1
        next_month_year = date.year

    _, next_month_end_day = monthrange(next_month_year, next_month)
    end_date = date.replace(
        year=next_month_year, month=next_month, day=next_month_end_day
    )  # Make end_date inclusive

    # Adjusted filter conditions for overlapping events and inclusivity
    events = Event.query.filter(
        Event.calendar_id == main_calendar.calendar_id,
        or_(
            Event.start_date <= end_date,  # Starts before or on the end date
            Event.start_date >= start_date,  # Starts after or on the start date
        ),
    ).all()

    return Response(
        response=generate_ics(
            calendar=main_calendar,
            events=events,
            language=provided_langauges[0],
        ),
        mimetype="text/calendar",
    )
