"""
Event Routes (Protected)
API Endpoint: '/api/v1/events'
"""

import json
import uuid
from flask import Blueprint, Response, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from http import HTTPStatus
from typing import Any
from sqlalchemy.exc import SQLAlchemyError
from models.committees import Committee, CommitteePosition
from models.content import Event, RepeatableEvent
from models.core import Student, StudentMembership, Author
from services.content import (
    create_item,
    delete_item,
)
from services.content.public import get_main_calendar
from utility.database import db
from utility.logger import log_error


events_bp = Blueprint("events", __name__)


@events_bp.route("/<string:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id: str) -> Response:
    """
    Deletes an event by ID
        :param event_id: str - The event ID
        :return: Response - The response object, 400 if the event ID is invalid, 404 if the event is not found, 401 if the user is not authorized, 204 if successful
    """

    student_id = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims.get("role") == "ADMIN"

    author_email = None
    if is_admin:
        json_data = request.get_json()
        author_email = json_data.get("author_email")

    try:
        event_id = uuid.UUID(event_id)
    except ValueError:
        return jsonify({"error": "Invalid event ID format"}), HTTPStatus.BAD_REQUEST

    author_type = request.args.get("author_type", type=str, default="STUDENT")

    event: Event = Event.query.filter(Event.event_id == event_id).first_or_404(
        "Event not found!"
    )
    author = None

    if author_type == "STUDENT":
        author: Author | None = Author.query.filter_by(student_id=student_id).first()

        if not author and not is_admin:
            return jsonify({"error": "Not authorized student"}), HTTPStatus.UNAUTHORIZED

    elif author_type == "COMMITTEE":
        author: Author | None = (
            Author.query.join(
                CommitteePosition,
                CommitteePosition.committee_id == Author.committee_id,
            )
            .join(
                StudentMembership,
                StudentMembership.committee_position_id
                == CommitteePosition.committee_position_id,
            )
            .filter(
                StudentMembership.student_id == student_id,
                StudentMembership.termination_date.is_(None),
            )
            .first()
        )

        if not author and not is_admin:
            return jsonify(
                {"error": "Not authorized membership committee"}
            ), HTTPStatus.UNAUTHORIZED

        # Decrease the event count for the committee
        if author_email and is_admin:
            committee: Committee = Committee.query.filter_by(
                email=author_email
            ).first_or_404()
            committee.total_events -= 1
        else:
            committee: Committee = Committee.query.filter_by(
                committee_id=author.committee_id
            ).first_or_404()
            committee.total_events -= 1

    if author is not None:
        if author.author_id != event.author_id:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

    try:
        delete_item(Event, event_id)
    except SQLAlchemyError as e:
        log_error(f"Tried to delete event {event_id} but failed: {str(e)}")
        return jsonify(
            {"error": "An internal error has occurred!"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({}), HTTPStatus.NO_CONTENT


@events_bp.route("/", methods=["POST"])
@jwt_required()
def create_event() -> Response:
    """
    Creates an event
        :return: Response - The response object, 400 if data provided is invalid, 201 if successful
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    data: dict[str, Any] = json.loads(json.dumps(data))

    author = data.get("author")
    author_type = author.get("author_type")

    if author is None or author_type is None:
        return jsonify({"error": "No author provided"}), HTTPStatus.BAD_REQUEST

    author_table = None
    if author_type.upper() == "STUDENT":
        author_table = Student
    elif author_type.upper() == "COMMITTEE":
        author_table = Committee
    elif author_type.upper() == "COMMITTEE_POSITION":
        author_table = CommitteePosition
    else:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

    author_email = author.get("email")

    if author_email is None:
        return jsonify({"error": "No email provided"}), HTTPStatus.BAD_REQUEST

    data["calendar_id"] = get_main_calendar().calendar_id

    id = create_item(
        author_table=author_table,
        email=author_email,
        item_table=Event,
        data=data,
        public=True,
    )

    repeatable = data.get("repeats")

    if repeatable:
        event: Event = Event.query.filter(Event.item_id == id).first_or_404()
        end_date = data.get("end_date")
        max_occurrences = data.get("max_occurrences")
        repeatable_event = RepeatableEvent(
            event_id=event.event_id,
            frequency=data.get("frequency"),
            interval=data.get("interval"),
            end_date=end_date,
            max_occurrences=max_occurrences,
            repeat_forever=end_date is None and max_occurrences is None,
        )

        db.session.add(repeatable_event)
        db.session.commit()

    return {"id": id}, HTTPStatus.CREATED
