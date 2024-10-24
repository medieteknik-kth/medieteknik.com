"""
Event Routes (Protected)
API Endpoint: '/api/v1/events'
"""

import json
import uuid
from http import HTTPStatus
from typing import Any
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content.author import Author
from models.content.event import Event, RepeatableEvent
from models.core.student import Student, StudentMembership
from services.content.item import (
    create_item,
    delete_item,
)
from services.content.public.calendar import get_main_calendar
from utility.database import db
from sqlalchemy.exc import SQLAlchemyError

events_bp = Blueprint("events", __name__)


@events_bp.route("/<string:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id: str):
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
    except NotImplementedError as e:
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR
    except SQLAlchemyError as e:
        return jsonify({"sql_error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({}), HTTPStatus.NO_CONTENT


@events_bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: dict[str, Any] = json.loads(json.dumps(data))

    author = data.get("author")

    if author is None:
        return jsonify({"error": "No author provided"}), 400

    author_table = None
    if author.get("author_type") == "STUDENT":
        author_table = Student
    elif author.get("author_type") == "COMMITTEE":
        author_table = Committee
    elif author.get("author_type") == "COMMITTEE_POSITION":
        author_table = CommitteePosition
    else:
        return jsonify({"error": "Invalid author type"}), 400

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), 400

    author_email = author.get("email")

    if author_email is None:
        return jsonify({"error": "No email provided"}), 400

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

    return {"id": id}, 201
