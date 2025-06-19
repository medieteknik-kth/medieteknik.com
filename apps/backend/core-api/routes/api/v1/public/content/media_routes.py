"""
Public Media Routes
API Endpoint: '/api/v1/public/media'
"""

from http import HTTPStatus
from flask import Blueprint, Response, jsonify, request
from models.core import Author
from models.content import Media
from services.content.public.item import (
    get_items_from_author,
    get_latest_items,
)
from utility.translation import retrieve_languages


public_media_bp = Blueprint("public_media", __name__)



@public_media_bp.route("/author/<string:author_id>")
def get_media_by_author(author_id: str) -> Response:
    """
    Retrieves all media by author
        :param author_id: str - The author id
        :return: Response - The response object, 404 if the author is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    author: Author | None = Author.query.filter_by(student_id=author_id).first()

    if not author:
        author: Author | None = Author.query.filter_by(committee_id=author_id).first()

    if not author:
        return jsonify({}), HTTPStatus.NOT_FOUND

    return jsonify(
        get_items_from_author(author, Media, provided_languages)
    ), HTTPStatus.OK


@public_media_bp.route("/latest")
def get_latest_media() -> Response:
    """
    Retrieves the latest media items
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    return jsonify(
        get_latest_items(
            item_table=Media, count=10, provided_languages=provided_languages
        )
    ), HTTPStatus.OK
