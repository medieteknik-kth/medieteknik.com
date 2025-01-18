"""
Public Event Routes
API Endpoint: '/api/v1/public/events'
"""

from http import HTTPStatus
from typing import Any, Dict
from flask import Blueprint, Response, jsonify, request
from models.content import Event
from models.core import Author, AuthorType, Student
from services.content.public import (
    get_item_by_url,
    get_items,
    get_items_from_author,
)
from utility import retrieve_languages


public_events_bp = Blueprint("public_events", __name__)


@public_events_bp.route("/", methods=["GET"])
def get_events() -> Response:
    """
    Retrieves all events
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get("author")

    if author_id:
        return jsonify(
            get_items(Event, provided_languages, author_id=author_id)
        ), HTTPStatus.OK

    return jsonify(get_items(Event, provided_languages)), HTTPStatus.OK


@public_events_bp.route("/student/<string:email>", methods=["GET"])
def get_events_by_student(email: str) -> Response:
    """
    Retrieves all events by student
        :param email: str - The email of the student
        :return: Response - The response object, 404 if the student or author is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    student: Student = Student.query.filter_by(email=email).first_or_404()

    author: Author = Author.query.filter(
        Author.author_type == AuthorType.STUDENT.value,
        Author.student_id == student.student_id,
    ).first_or_404()

    return jsonify(
        get_items_from_author(
            author=author,
            item_table=Event,
            provided_languages=provided_languages,
        )
    ), HTTPStatus.OK


@public_events_bp.route("/<string:url>", methods=["GET"])
def get_events_by_url(url: str) -> Response:
    """
    Retrieves an event by URL
        :param url: str - The URL of the event
        :return: Response - The response object, 404 if the event is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    item: Dict[str, Any] | None = get_item_by_url(url, Event, provided_languages)

    if not item:
        return jsonify({}), HTTPStatus.NOT_FOUND

    return jsonify(item), HTTPStatus.OK
