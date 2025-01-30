"""
Committee Routes (Protected)
API Endpoint: '/api/v1/committees'
"""

from http import HTTPStatus
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import jwt_required
from decorators.auditable import audit
from models.committees import Committee
from models.core import Author
from models.content import Document, Event, News
from models.utility.audit import EndpointCategory
from services.committees.committee import update_committee
from services.committees.public import (
    get_committee_by_title,
    get_committee_data_by_title,
    get_committee_positions_by_committee_title,
)
from utility import retrieve_languages

committee_bp = Blueprint("committee", __name__)


@committee_bp.route("/<string:committee_title>/data", methods=["GET"])
@jwt_required()
def get_committees_data_by_title(committee_title: str) -> Response:
    """
    Retrieves the committee data by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 404 if the committee is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    result = get_committee_data_by_title(
        title=committee_title,
        provided_languages=provided_languages,
        is_public_route=False,
    )
    if result is None:
        return jsonify({}), HTTPStatus.NOT_FOUND
    return jsonify(result), HTTPStatus.OK


@committee_bp.route("/<string:committee_title>/news", methods=["GET"])
@jwt_required()
def get_committee_news_by_title(committee_title: str) -> Response:
    """
    Retrieves the paginated news items for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    committee: Committee | None = get_committee_by_title(title=committee_title)

    if not committee:
        return jsonify([])

    news = (
        News.query.join(Author, News.author_id == Author.author_id)
        .filter_by(committee_id=committee.committee_id)
        .paginate()
    )

    items = news.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )
        is not None
    ]

    return jsonify(
        {
            "items": items_dict,
            "page": news.page,
            "per_page": news.per_page,
            "total_pages": news.pages,
            "total_items": news.total,
        }
    ), HTTPStatus.OK


@committee_bp.route("/<string:committee_title>/events", methods=["GET"])
@jwt_required()
def get_committee_events_by_title(committee_title: str) -> Response:
    """
    Retrieves the paginated event items for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    committee: Committee | None = get_committee_by_title(title=committee_title)

    if not committee:
        return jsonify([])

    events = (
        Event.query.join(Author, Event.author_id == Author.author_id)
        .filter_by(committee_id=committee.committee_id)
        .paginate()
    )

    items = events.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )
        is not None
    ]

    return jsonify(
        {
            "items": items_dict,
            "page": events.page,
            "per_page": events.per_page,
            "total_pages": events.pages,
            "total_items": events.total,
        }
    ), HTTPStatus.OK


@committee_bp.route("/<string:committee_title>/documents", methods=["GET"])
@jwt_required()
def get_committee_documents_by_title(committee_title: str) -> Response:
    """
    Retrieves the paginated document items for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    committee: Committee | None = get_committee_by_title(title=committee_title)

    if not committee:
        return jsonify([])

    documents = (
        Document.query.join(Author, Document.author_id == Author.author_id)
        .filter_by(committee_id=committee.committee_id)
        .paginate()
    )

    items = documents.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )
        is not None
    ]

    return jsonify(
        {
            "items": items_dict,
            "page": documents.page,
            "per_page": documents.per_page,
            "total_pages": documents.pages,
            "total_items": documents.total,
        }
    ), HTTPStatus.OK


@committee_bp.route("/<string:committee_title>/positions", methods=["GET"])
@jwt_required()
def get_committee_positions_by_title(committee_title: str) -> Response:
    """
    Retrieves the committee positions by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 404 if the committee is not found, 200 if successful
    """

    result = get_committee_positions_by_committee_title(committee_title)
    if not result:
        return jsonify({}), HTTPStatus.NOT_FOUND
    return jsonify(result), HTTPStatus.OK


@committee_bp.route("/<string:committee_title>", methods=["PUT"])
@jwt_required()
@audit(
    endpoint_category=EndpointCategory.COMMITTEE,
    additional_info="Can contain copyrighted material, either logo or group photo.",
)
def update_committee_by_title(committee_title: str) -> Response:
    """
    Updates the committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    languages = retrieve_languages(request.args)
    return jsonify(
        update_committee(
            request=request,
            committee_title=committee_title,
            provided_languages=languages,
        )
    ), HTTPStatus.OK
