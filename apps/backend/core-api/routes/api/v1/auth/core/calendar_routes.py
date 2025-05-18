"""
Calendar Routes (Protected)
API Endpoint: '/api/v1/calendar'
"""

import uuid
from calendar import monthrange
from datetime import datetime, timedelta
from http import HTTPStatus

from fastapi import APIRouter, HTTPException, Response
from sqlmodel import or_, select

from config import Settings
from models.content import Event
from models.core import Student
from routes.api.deps import SessionDep
from services.content import generate_ics
from services.content.public import get_main_calendar
from utility import retrieve_languages

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/calendar",
    tags=["Calendar"],
    responses={404: {"description": "Not found"}},
)


@router.get(
    "/ics",
)
async def get_calendar_ics(
    session: SessionDep, student: uuid.UUID, language: str | None
):
    """
    Retrieves the calendar in iCalendar format
        :return: Response - The response object,  404 if the student is not found, 400 if the student is not provided, 200 if successful
    """

    student_exist_stmt = select(Student).where(
        Student.student_id == student,
    )
    student_exist = session.exec(student_exist_stmt).first()

    if not student_exist:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND, detail="Student not found"
        )

    provided_langauges = retrieve_languages(language)

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
    events_stmt = select(Event).where(
        Event.calendar_id == main_calendar.calendar_id,
        or_(
            Event.start_date <= end_date,  # Starts before or on the end date
            Event.start_date >= start_date,  # Starts after or on the start date
        ),
    )
    events = session.exec(events_stmt).all()

    return Response(
        content=generate_ics(
            calendar=main_calendar,
            events=events,
            language=provided_langauges[0],
        ),
        status_code=HTTPStatus.OK,
        media_type="text/calendar",
        headers={
            "Content-Disposition": 'attachment; filename="calendar.ics"',
            "Content-Type": "text/calendar",
        },
    )
