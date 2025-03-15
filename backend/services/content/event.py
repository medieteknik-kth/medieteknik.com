from calendar import Calendar
from datetime import timedelta
from textwrap import dedent
from typing import List
from models.content import Event, EventTranslation, Frequency
from utility.logger import log_error
from utility.translation import get_translation


def escape_special_chars(text: str) -> str:
    """Escapes special characters according to RFC 5545.

    :param text: The text to escape.
    :type text: str
    """
    if not text:
        return text

    # Handle: BACKSLASH, SEMICOLON, COMMA,
    text = text.replace("\\", "\\\\")  # Must be first!
    text = text.replace(";", "\\;")
    text = text.replace(",", "\\,")

    return text


def fold_property(name: str, value: str) -> str:
    """Folds a property line according to RFC 5545 (75 characters per line including property name).

    :param name: The name of the property. E.g, 'SUMMARY' or 'DESCRIPTION'.
    :type name: str
    :param value: The value of the property. E.g, 'This is a summary' or 'This is a description'.
    :type value: str
    """
    if not value:
        return f"{name}:"

    value = escape_special_chars(value)

    value = value.replace("\n", "\\n")

    full_line = f"{name}:{value}"

    if len(full_line) <= 75:
        return full_line

    lines = []

    first_line_length = 75
    lines.append(full_line[:first_line_length])

    remaining = full_line[first_line_length:]
    while remaining:
        lines.append(remaining[:74])
        remaining = remaining[74:]

    return "\r\n ".join(lines)


def sanitize_ical_value(value: str) -> str:
    """Sanitizes a value for use in iCal fields.

    :param value: The value to sanitize.
    :type value: str
    """
    if not value:
        return ""

    # Remove any control characters
    value = "".join(char for char in value if ord(char) >= 32)

    # Limit to ASCII range 0-127 (optional, uncomment if needed)
    # value = value.encode('ascii', 'ignore').decode('ascii')

    return value


def generate_ics(calendar: Calendar, events: List[Event], language: str) -> str:
    try:
        ics = dedent(f"""\
                BEGIN:VCALENDAR
                VERSION:2.0
                NAME:{calendar.name}
                X-WR-CALNAME:{calendar.name}
                X-WR-TIMEZONE:Europe/Stockholm
                COLOR:yellow
                PRODID:-//medieteknik//Calendar 1.0//{language[0:2].upper()}
                CALSCALE:GREGORIAN""")

        for event in events:
            if not event:
                continue
            translation = get_translation(
                EventTranslation, ["event_id"], {"event_id": event.event_id}, language
            )

            if not isinstance(translation, EventTranslation):
                continue

            rrule = ""
            if event.repeatable_event:
                rrule_parts = []
                rrule_parts.append(
                    f"FREQ={event.repeatable_event.frequency.value}".upper()
                )

                if event.repeatable_event.interval:
                    rrule_parts.append(f"INTERVAL={event.repeatable_event.interval}")

                if event.repeatable_event.end_date:
                    rrule_parts.append(
                        f"UNTIL={event.repeatable_event.end_date.strftime('%Y%m%dT%H%M%S')}"
                    )

                if event.repeatable_event.max_occurrences:
                    rrule_parts.append(
                        f"COUNT={event.repeatable_event.max_occurrences}"
                    )

                rrule = ";".join(rrule_parts)

            event_location = sanitize_ical_value(event.location)
            event_summary = sanitize_ical_value(translation.title)
            event_description = sanitize_ical_value(translation.description)

            ics += dedent(f"""
                    BEGIN:VEVENT
                    UID:{str(event.event_id) + "@medieteknik.com"}
                    DTSTAMP:{event.created_at.strftime("%Y%m%dT%H%M%S" + "Z")}
                    {fold_property("SUMMARY", event_summary)}
                    {fold_property("LOCATION", event_location)}
                    LAST-MODIFIED:{event.last_updated.strftime("%Y%m%dT%H%M%S")}Z
                    DTSTART:{event.start_date.strftime("%Y%m%dT%H%M%S")}Z
                    DTEND:{(event.start_date + timedelta(minutes=event.duration)).strftime("%Y%m%dT%H%M%S")}Z""")
            if translation.description or rrule:
                ics += "\n"
                if translation.description:
                    ics += fold_property("DESCRIPTION", event_description)

                if translation.description and rrule:
                    ics += "\n"

                if rrule:
                    ics += f"RRULE:{rrule}"

            ics += "\nEND:VEVENT"

        ics += "\nEND:VCALENDAR"
        ics = dedent(ics)

        return ics

    except Exception as e:
        log_error(f"Failed to generate iCal: {e}")
    return ""


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
