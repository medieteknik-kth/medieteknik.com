from calendar import monthrange
from datetime import datetime, timedelta
from typing import List
from sqlalchemy import and_, or_
from models.content import Calendar, Event
from utility.database import db


def get_main_calendar() -> Calendar:
    main_calendar = Calendar.query.filter_by(is_main=True).first()

    if not main_calendar or not isinstance(main_calendar, Calendar):
        calendar = Calendar()
        setattr(calendar, "name", "Medieteknik's Calendar")
        setattr(calendar, "is_main", True)

        db.session.add(calendar)
        db.session.commit()
        main_calendar = calendar

    return main_calendar


def get_events_monthly(date_str: str):
    try:
        date = datetime.strptime(date_str, "%Y-%m")
    except ValueError:
        raise ValueError("Invalid date format. Use YYYY-MM")

    main_calendar = get_main_calendar()

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

    return [
        event_dict for event in events if (event_dict := event.to_dict()) is not None
    ]


def get_event_by_date(date_str: str):
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        raise ValueError("Invalid date format. Use YYYY-MM-DD")

    main_calendar = get_main_calendar()

    event = Event.query.filter(
        Event.calendar_id == main_calendar.calendar_id,
        and_(Event.start_date <= date, Event.end_date >= date),
    ).first()

    if not event or not isinstance(event, Event):
        raise Exception("No event found")

    return event.to_dict()