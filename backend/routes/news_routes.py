"""
News Routes (Protected)
API Endpoint: '/api/v1/news'
"""

import json
from http import HTTPStatus
from typing import Any, Dict
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content.author import Author, AuthorType
from models.content.news import News, NewsTranslation
from models.core.student import Student
from services.content.author import get_author_from_email
from services.content.item import (
    create_item,
    delete_item,
    get_item_by_url,
    get_items,
    get_items_from_author,
    publish,
    update_item,
    update_translations,
)
from utility.constants import AVAILABLE_LANGUAGES
from utility.gc import upload_file
from utility.translation import retrieve_languages


news_bp = Blueprint("news", __name__)


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
    author = get_author_from_email(entity_table=Student, email=email)

    if not author:
        return jsonify({}), 404

    return jsonify(get_items_from_author(author, News, provided_languages))


@news_bp.route("/", methods=["POST"])
@jwt_required()
def create_news():
    """Creates a news item

    Returns:
        dict: News item
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: Dict[str, Any] = json.loads(json.dumps(data))

    author: Dict | None = data.get("author")
    if author is None:
        return jsonify({"error": "No author provided"}), 400

    author_type = author.get("author_type")

    author_table = None
    if author_type == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), 401

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), 401

        author_table = Student
    elif author_type == "COMMITTEE":
        author_table = Committee
    elif author_type == "COMMITTEE_POSITION":
        author_table = CommitteePosition
    else:
        return jsonify({"error": "Invalid author type"}), 400

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), 400

    author_email = author.get("email")

    if author_email is None:
        return jsonify({"error": "No email provided"}), 400

    return {
        "url": create_item(
            author_table=author_table,
            email=author_email,
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
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    json_data = json.loads(json.dumps(data))

    if json_data.get("author") is None:
        return jsonify({"error": "No author provided"}), 400

    author_type = json_data.get("author").get("author_type")
    if author_type == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), 401

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), 401

    url_identifier: bool = request.args.get("url", type=bool)
    langauge_code = retrieve_languages(request.args)

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

    form_data = request.form

    if not form_data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    author = json.loads(form_data.get("author"))

    if not author:
        return jsonify({"error": "No author provided"}), HTTPStatus.BAD_REQUEST

    author_type = author.get("author_type")
    if author_type == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({}), HTTPStatus.UNAUTHORIZED

        if "NEWS" not in permissions.get("author"):
            return jsonify({}), HTTPStatus.UNAUTHORIZED

    news_item: News = News.query.get_or_404(identifier)

    translation_data = []
    for index, language_code in enumerate(AVAILABLE_LANGUAGES):
        translation_data.append(
            {
                "language_code": language_code,
                "title": form_data.get(
                    f"translations[{index}][title]", "Untitled Item"
                ),
                "short_description": form_data.get(
                    f"translations[{index}][short_description]"
                ),
            }
        )

        if request.files.get(f"translations[{index}][main_image_url]"):
            upload_result = upload_file(
                file=request.files.get(f"translations[{index}][main_image_url]"),
                file_name=f"{news_item.news_id}/{language_code}.webp",
                path="news",
                content_disposition="inline",
                content_type="image/webp",
                timedelta=None,
                language_code=language_code,
            )

            if not upload_result:
                return jsonify(
                    {"error": "Failed to upload file"}
                ), HTTPStatus.INTERNAL_SERVER_ERROR

            translation_data[index]["main_image_url"] = upload_result

    if not translation_data:
        return jsonify({"error": "No translations provided"}), HTTPStatus.BAD_REQUEST

    publish_result = publish(news_item, NewsTranslation, translation_data)

    if not publish_result:
        return jsonify({"error": "Failed to publish"}), 400

    return jsonify({"url": publish_result}), 201


@news_bp.route("/<string:url>", methods=["DELETE"])
@jwt_required()
def delete_news(url: str):
    """Deletes a news item."""

    news_item: News = News.query.filter_by(url=url).first_or_404()

    author: Author = Author.query.get_or_404(news_item.author_id)

    claims = get_jwt()

    author_type = author.author_type

    if author_type == AuthorType.STUDENT:
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED
    elif author_type == AuthorType.COMMITTEE:
        committee: Committee = Committee.query.get_or_404(author.committee_id)
        if committee.committee_id != author.committee_id:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        committee.total_news -= 1

    delete_item(News, news_item.news_id)

    return jsonify({}), HTTPStatus.NO_CONTENT
