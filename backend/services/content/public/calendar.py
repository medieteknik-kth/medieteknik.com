from calendar import monthrange
from datetime import datetime, timedelta
from typing import List
from sqlalchemy import and_, or_
from models.content import Event
from models.core import Calendar
from services.content.event import generate_events
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db


def get_main_calendar() -> Calendar:
    main_calendar = Calendar.query.filter(Calendar.is_root == True).first()  # noqa: E712

    if not main_calendar:
        calendar = Calendar()
        setattr(calendar, "name", "Medieteknik's Calendar")

        db.session.add(calendar)
        db.session.commit()
        main_calendar = calendar

    return main_calendar


def get_events_monthly(
    date_str: str, provided_languages: List[str] = AVAILABLE_LANGUAGES
):
    try:
        date = datetime.strptime(date_str, "%Y-%m")
    except ValueError:
        raise ValueError("Invalid date format. Use YYYY-MM")

    main_calendar = get_main_calendar()

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

    all_event_occurrences = []
    for event in events:
        if event.repeatable_event:
            occurrences = generate_events(event, start_date, end_date)
            all_event_occurrences.extend(occurrences)

        else:
            if event.start_date >= start_date and event.start_date <= end_date:
                all_event_occurrences.append(
                    {
                        "event": event,
                        "start_date": event.start_date,
                        "end_date": (
                            event.start_date + timedelta(minutes=event.duration)
                        ),
                    }
                )

    return [
        event_dict
        for event_occurrence in all_event_occurrences
        if (
            event_dict := event_occurrence["event"].to_dict(
                provided_languages=provided_languages,
                custom_start_date=event_occurrence["start_date"],
            )
        )
        is not None
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
