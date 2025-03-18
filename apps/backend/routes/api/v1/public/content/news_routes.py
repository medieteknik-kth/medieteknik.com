"""
Public News Routes
API Endpoint: '/api/v1/public/news'
"""

from http import HTTPStatus
from flask import Blueprint, Response, request, jsonify
from models.content import News
from models.core import AuthorType, Author, Student
from services.core import get_author_from_email
from utility import retrieve_languages
from services.content.public import (
    get_latest_items,
    get_item_by_url,
    get_items,
    get_items_from_author,
)

public_news_bp = Blueprint("public_news", __name__)


@public_news_bp.route("/", methods=["GET"])
def get_news() -> Response:
    """
    Retrieves all news
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get("author")

    if author_id:
        return jsonify(
            get_items_from_author(Author.query.get(author_id), News, provided_languages)
        ), HTTPStatus.OK

    return jsonify(get_items(News, provided_languages)), HTTPStatus.OK


@public_news_bp.route("/student/<string:email>", methods=["GET"])
def get_news_by_student(email: str) -> Response:
    """
    Retrieves all news by student
        :param email: str - The email of the student
        :return: Response - The response object, 404 if the student or author is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    author_student = get_author_from_email(entity_table=Student, email=email)

    if not author_student:
        return jsonify({}), HTTPStatus.NOT_FOUND

    return jsonify(
        get_items_from_author(
            Author.query.filter(
                Author.author_type == AuthorType.STUDENT.value,
                Author.student_id == author_student.student_id,
            ).first_or_404(),
            News,
            provided_languages,
        )
    ), HTTPStatus.OK


@public_news_bp.route("/<string:url>", methods=["GET"])
def get_news_by_url(url: str) -> Response:
    """
    Retrieves a news by URL
        :param url: str - The URL of the news
        :return: Response - The response object, 404 if the news is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    item = get_item_by_url(url, News, provided_languages)

    if not item:
        return jsonify({}), HTTPStatus.NOT_FOUND
    item: News = item

    return jsonify(item)


@public_news_bp.route("/latest", methods=["GET"])
def get_latest_news() -> Response:
    """
    Retrieves the latest news items
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    return jsonify(
        get_latest_items(News, provided_languages=provided_languages)
    ), HTTPStatus.OK
