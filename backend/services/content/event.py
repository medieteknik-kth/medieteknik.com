from calendar import Calendar
from datetime import timedelta
from textwrap import dedent
from typing import List
from models.content import Event, EventTranslation, Frequency
from utility.translation import get_translation


def generate_ics(calendar: Calendar, events: List[Event], language: str) -> str:
    ics = dedent(f"""\
        BEGIN:VCALENDAR
        VERSION:2.0
        X-WR-CALNAME:{calendar.name}
        X-WR-TIMEZONE:Europe/Stockholm
        PRODID:-//medieteknik//Calendar 1.0//{language[0:2].upper()}
        CALSCALE:GREGORIAN""")

    for event in events:
        if not event:
            continue
        translation = get_translation(
            EventTranslation, ["event_id"], {"event_id": event.event_id}, language
        )

        if not isinstance(translation, EventTranslation):
            return None

        rrule = ""
        if event.repeatable_event:
            rrule = f"FREQ={event.repeatable_event.frequency.value};".upper()

            if event.repeatable_event.interval:
                rrule += f"INTERVAL={event.repeatable_event.interval};"

            if event.repeatable_event.end_date:
                rrule += f"UNTIL={event.repeatable_event.end_date.strftime('%Y%m%dT%H%M%S')};"

            if event.repeatable_event.max_occurrences:
                rrule += f"COUNT={event.repeatable_event.max_occurrences};"

        ics += dedent(f"""
            BEGIN:VEVENT
            UID:{str(event.event_id) + '@medieteknik.com'}
            DTSTAMP:{event.created_at.strftime("%Y%m%dT%H%M%S" + "Z")}
            SUMMARY:{translation.title}
            LOCATION:{event.location}
            LAST-MODIFIED:{event.last_updated.strftime("%Y%m%dT%H%M%S" + "Z")}
            DTSTART:{event.start_date.strftime("%Y%m%dT%H%M%S") + "Z"}
            DTEND:{(event.start_date + timedelta(minutes=event.duration)).strftime("%Y%m%dT%H%M%S") + "Z"}""")
        if translation.description or rrule:
            ics += "\n"
            if translation.description:
                ics += f"DESCRIPTION:{translation.description}"

            if translation.description and rrule:
                ics += "\n"

            if rrule:
                ics += f"RRULE:{rrule}"

        ics += "\nEND:VEVENT"

    ics += "\nEND:VCALENDAR"
    ics = dedent(ics)

    return ics


def generate_events(event: Event, start_date, end_date) -> List:
    """
    Generate a list of occurrences for a repeatable event.

    Args:
        event: The event to generate occurrences for
        start_date: The start date of the range
        end_date: The end date of the range

    Returns:
        List: A list of occurrences for the event
    """
    occurrences = []
    current_occurrence = event.start_date
    occurrence_count = 0

    if not event.repeatable_event:
        return occurrences

    repeat = event.repeatable_event

    while current_occurrence < end_date:
        event_end_time = current_occurrence + timedelta(minutes=event.duration)

        if (repeat.end_date and current_occurrence > repeat.end_date) or (
            repeat.max_occurrences and occurrence_count >= repeat.max_occurrences
        ):
            break

        if current_occurrence >= start_date:
            occurrences.append(
                {
                    "event": event,
                    "start_date": current_occurrence,
                    "end_date": event_end_time,
                }
            )
            occurrence_count += 1

        match event.repeatable_event.frequency:
            case Frequency.DAILY:
                current_occurrence += timedelta(days=event.repeatable_event.interval)
            case Frequency.WEEKLY:
                current_occurrence += timedelta(weeks=event.repeatable_event.interval)
            case Frequency.MONTHLY:
                current_occurrence = current_occurrence.replace(
                    month=current_occurrence.month + event.repeatable_event.interval
                )
            case Frequency.YEARLY:
                current_occurrence = current_occurrence.replace(
                    year=current_occurrence.year + event.repeatable_event.interval
                )

    return occurrences
