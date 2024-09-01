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
    _, next_month_end_day = monthrange(date.year, date.month + 1)
    end_date = date.replace(day=next_month_end_day)  # Make end_date inclusive

    # Adjusted filter conditions for overlapping events and inclusivity
    events: List[Event] = Event.query.filter(
        Event.calendar_id == main_calendar.calendar_id,
        or_(
            Event.start_date.between(start_date, end_date),  # Starts within range
            Event.end_date.between(start_date, end_date),  # Ends within range
            (Event.start_date < start_date)
            & (Event.end_date > end_date),  # Spans the range
        ),
    ).all()

    return Response(
        get_main_calendar().to_ics(events, provided_langauges[0]),
        mimetype="text/calendar",
    )
