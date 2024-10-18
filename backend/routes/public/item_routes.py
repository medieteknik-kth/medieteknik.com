from flask import Blueprint, request, jsonify
from models.content import News, Event, Media, Author
from models.content.author import AuthorType
from models.core.student import Student
from services.content.author import get_author_from_email
from utility.translation import retrieve_languages
from services.content.public.item import (
    get_latest_items,
    get_item_by_url,
    get_items,
    get_items_from_author,
)

public_news_bp = Blueprint("public_news", __name__)
public_events_bp = Blueprint("public_events", __name__)


@public_news_bp.route("/", methods=["GET"])
def get_news() -> dict:
    """Retrieves all news

    Returns:
        list[dict]: List of news
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get("author")

    if author_id:
        return jsonify(
            get_items_from_author(Author.query.get(author_id), News, provided_languages)
        ), 200

    return jsonify(get_items(News, provided_languages)), 200


@public_news_bp.route("/student/<string:email>", methods=["GET"])
def get_news_by_student(email: str):
    """Retrieves news by a given student

    Args:
        email (str): Student email

    Returns:
        dict: News item
    """

    provided_languages = retrieve_languages(request.args)

    author_student = get_author_from_email(entity_table=Student, email=email)

    if not author_student:
        return jsonify({}), 404

    return jsonify(
        get_items_from_author(
            Author.query.filter(
                Author.author_type == AuthorType.STUDENT.value,
                Author.student_id == author_student.student_id,
            ).first_or_404(),
            News,
            provided_languages,
        )
    )


@public_news_bp.route("/<string:url>", methods=["GET"])
def get_news_by_url(url: str) -> dict:
    """Retrieves a news item by URL

    Args:
        url (str): News URL

    Returns:
        dict: News item
    """
    provided_languages = retrieve_languages(request.args)

    item = get_item_by_url(url, News, provided_languages)

    if not item:
        return jsonify({}), 404
    item: News = item

    return jsonify(item)


@public_news_bp.route("/latest", methods=["GET"])
def get_latest_news():
    provided_languages = retrieve_languages(request.args)
    return jsonify(get_latest_items(News, provided_languages=provided_languages)), 200


@public_events_bp.route("/", methods=["GET"])
def get_events() -> dict:
    """Retrieves all events

    Returns:
        list[dict]: List of events
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get("author")

    if author_id:
        return jsonify(get_items(Event, provided_languages, author_id=author_id)), 200

    return jsonify(get_items(Event, provided_languages)), 200


@public_events_bp.route("/student/<string:email>", methods=["GET"])
def get_events_by_student(email: str):
    """Retrieves events by a given student

    Args:
        email (str): Student email

    Returns:
        dict: News item
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
    )


@public_events_bp.route("/<string:url>", methods=["GET"])
def get_events_by_url(url: str) -> dict:
    """Retrieves a event item by URL

    Args:
        url (str): Event URL

    Returns:
        dict: Event item
    """
    provided_languages = retrieve_languages(request.args)

    item = get_item_by_url(url, Event, provided_languages)

    if not item:
        return jsonify({}), 404
    item: Event = item

    return jsonify(item)
