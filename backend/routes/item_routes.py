from typing import Any
from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content import Author, News, NewsTranslation
from models.content.event import Event
from models.core.student import Student
from services.content.item import (
    create_item,
    get_items,
    get_items_from_author,
    get_author_from_email,
    get_item_by_url,
    delete_item,
    publish,
    update_item,
    update_translations,
)
from services.content.public.calendar import get_main_calendar
from utility.translation import retrieve_languages
import json

news_bp = Blueprint("news", __name__)
events_bp = Blueprint("events", __name__)
documents_bp = Blueprint("documents", __name__)
albums_bp = Blueprint("albums", __name__)


@news_bp.route("/", methods=["GET"])
@jwt_required()
def get_news():
    """Retrieves all news items from a specific author

    Returns:
        dict: News items
    """
    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), 403

    if not permissions.get("student").get("ITEMS_VIEW"):
        return jsonify({}), 403

    language_code = retrieve_languages(request.args)
    specific_author_id = request.args.get("author")

    author = Author.query.get(specific_author_id)

    if not author:
        return jsonify({}), 404

    if specific_author_id:
        return jsonify(get_items_from_author(author, News, language_code)), 200

    return jsonify(get_items(News, language_code)), 200


@news_bp.route("/<string:identifier>", methods=["GET"])
@jwt_required()
def get_news_by_id(identifier: str):
    """Retrieves a news item by ID

    Args:
        id (str): News ID

    Returns:
        dict: News item
    """
    url_identifier: bool = request.args.get("url", type=bool)
    language_code = retrieve_languages(request.args)

    if url_identifier:
        return jsonify(
            get_item_by_url(
                url=identifier, item_table=News, provided_languages=language_code
            )
        )

    news = News.query.get(identifier)

    if not news or not isinstance(news, News):
        return jsonify({}), 404

    return jsonify(
        news.to_dict(provided_languages=language_code, is_public_route=False)
    )


@news_bp.route("/student/<string:email>", methods=["GET"])
@jwt_required()
def get_news_by_student(email: str):
    """Retrieves a news item by author

    Args:
        email (str): Author email

    Returns:
        dict: News item
    """
    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), 403

    if not permissions.get("student").get("ITEMS_VIEW"):
        return jsonify({}), 403

    provided_languages = retrieve_languages(request.args)
    author = get_author_from_email(entity_table=Student, entity_email=email)

    if not author:
        return jsonify({}), 404

    print("author", author.author_id, author.author_type, author.entity_id)
    return jsonify(get_items_from_author(author, News, provided_languages))


@news_bp.route("/", methods=["POST"])
@jwt_required()
def create_news():
    """Creates a news item

    Returns:
        dict: News item
    """
    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), 403

    if "NEWS" not in permissions.get("author"):
        return jsonify({}), 403

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: dict[str, Any] = json.loads(json.dumps(data))

    author: dict | None = data.get("author")
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

    author_email = author.get("entity_email")

    if author_email is None:
        return jsonify({"error": "No email provided"}), 400

    return {
        "url": create_item(
            author_table=author_table,
            author_email=author_email,
            item_table=News,
            data=data,
        )
    }, 201


@news_bp.route("/<string:identifier>", methods=["PUT"])
@jwt_required()
def update_news_by_url(identifier: str):
    """Updates a news item and the translations
    It will try and create a translation entry if it doesn't exist

    Args:
        url (str): News URL

    Returns:
        dict: News item
    """

    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({"error": "Not authorized"}), 403

    if "NEWS" not in permissions.get("author"):
        return jsonify({"error": "Not authorized"}), 403

    url_identifier: bool = request.args.get("url", type=bool)
    data = request.get_json()
    langauge_code = retrieve_languages(request.args)

    if not data:
        return jsonify({"error": "No data provided"}), 400

    news_item = None
    if url_identifier:
        news_item = get_item_by_url(
            url=identifier, item_table=News, provided_languages=langauge_code
        )
    else:
        news_item = News.query.get(identifier)

    if news_item is None or not isinstance(news_item, News):
        return jsonify({"error": "News item not found"}), 404

    update_translations(news_item, NewsTranslation, data.get("translations"))
    del data["author"]
    del data["translations"]

    update_item(news_item, data)
    return jsonify(
        news_item.to_dict(provided_languages=langauge_code, is_public_route=False)
    )


@news_bp.route("/<string:identifier>/publish", methods=["PUT"])
@jwt_required()
def publish_news(identifier: str):
    """Publishes a news item."""

    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), 403

    if "NEWS" not in permissions.get("author"):
        return jsonify({}), 403

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    news_item = News.query.get(identifier)

    if not news_item:
        return jsonify({"error": "News item not found"}), 404

    result = publish(news_item, NewsTranslation, data.get("translations"))

    if not result:
        return jsonify({"error": "Failed to publish"}), 400

    return jsonify({"url": result}), 201


@news_bp.route("/<string:url>", methods=["DELETE"])
@jwt_required()
def delete_news(url: str):
    """Deletes a news item."""

    news_item = News.query.filter_by(url=url).first()

    if not news_item or not isinstance(news_item, News):
        return jsonify({"error": "News item not found"}), 404

    claims = get_jwt()
    student_id = get_jwt_identity()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), 403

    if (
        "ITEMS_DELETE" not in permissions.get("student")
        or news_item.author_id is not student_id
    ):
        return jsonify({}), 403

    delete_item(news_item, NewsTranslation)

    return jsonify({}), 200


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

    author_email = author.get("entity_email")

    if author_email is None:
        return jsonify({"error": "No email provided"}), 400

    data["calendar_id"] = get_main_calendar().calendar_id

    return {
        "url": create_item(
            author_table=author_table,
            author_email=author_email,
            item_table=Event,
            data=data,
            public=True,
        )
    }, 201
