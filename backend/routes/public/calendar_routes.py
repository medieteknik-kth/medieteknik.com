from calendar import monthrange
import datetime
from typing import List
from flask import Blueprint, jsonify, request, Response
from sqlalchemy import or_
from models.content.event import Event
from services.content.public.calendar import get_main_calendar, get_events_monthly

calendar_bp = Blueprint("calendar", __name__)


@calendar_bp.route("/")
def get_calendar():
    return jsonify(get_main_calendar().to_dict())


@calendar_bp.route("/events")
def get_events():
    date = request.args.get("date")

    if not date:
        date = datetime.datetime.now().strftime("%Y-%m")

    return jsonify(get_events_monthly(date_str=date))


@calendar_bp.route("/ics")
def get_calendar_ics():
    language = request.args.get("language", "sv-SE")

    main_calendar = get_main_calendar()

    date = datetime.datetime.now()

    start_date = (date - datetime.timedelta(days=1)).replace(day=1)
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
        get_main_calendar().to_ics(events, language), mimetype="text/calendar"
    )
