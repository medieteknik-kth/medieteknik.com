"""
Event Routes (Protected)
API Endpoint: '/api/v1/events'
"""

import json
from typing import Any
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content.event import Event, RepeatableEvent
from models.core.student import Student
from services.content.item import (
    create_item,
)
from services.content.public.calendar import get_main_calendar
from utility.database import db

events_bp = Blueprint("events", __name__)


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


@events_bp.route("/<string:url>", methods=["DELETE"])
@jwt_required()
def delete_event():
    pass
