"""
News Routes (Protected)
API Endpoint: '/api/v1/news'
"""

import json
from flask import Blueprint, Response, jsonify, make_response, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from http import HTTPStatus
from typing import Any, Dict, List
from models.committees import Committee, CommitteePosition
from models.content import News, NewsTranslation
from models.core import Student, Author, AuthorType
from models.core.student import StudentMembership
from services.content import (
    create_item,
    delete_item,
    get_item_by_url,
    get_items_from_author,
    publish,
    update_item,
)
from services.core import get_author_from_email
from utility import (
    AVAILABLE_LANGUAGES,
    upload_file,
    retrieve_languages,
)
from utility.database import db
from sqlalchemy.sql import exists, select


news_bp = Blueprint("news", __name__)


@news_bp.route("/<string:identifier>", methods=["GET"])
@jwt_required()
def get_news_by_id(identifier: str) -> Response:
    """
    Retrieves a news item by ID
        :param identifier: str - The news ID or URL, if the URL is provided, the URL parameter must be set to True
        :return: Response - The response object, 404 if the news item is not found, 200 if successful
    """

    url_identifier: bool = request.args.get("url", type=bool)
    language_code = retrieve_languages(request.args)

    if url_identifier:
        return jsonify(
            get_item_by_url(
                url=identifier, item_table=News, provided_languages=language_code
            )
        )

    news: News = (
        News.query.join(
            Author,
            Author.author_id == News.author_id,
        )
        .filter(News.news_id == identifier)
        .first_or_404()
    )

    student_id = get_jwt_identity()

    if news.author.author_type == AuthorType.COMMITTEE:
        stmt = select(
            exists().where(
                StudentMembership.committee_position_id
                == CommitteePosition.committee_position_id,
                CommitteePosition.committee_id == Committee.committee_id,
                StudentMembership.student_id == student_id,
                Committee.committee_id == news.author.committee_id,
            )
        )

        is_member: bool = db.session.execute(stmt).scalar()

        if not is_member:
            return jsonify({}), HTTPStatus.FORBIDDEN

    elif news.author.author_type == AuthorType.STUDENT:
        if news.author.student_id != student_id:
            return jsonify({}), HTTPStatus.FORBIDDEN

    return jsonify(
        news.to_dict(provided_languages=language_code, is_public_route=False)
    ), HTTPStatus.OK


@news_bp.route("/student/<string:email>", methods=["GET"])
@jwt_required()
def get_news_by_student(email: str) -> Response:
    """
    Retrieves all news items by student
        :param email: str - The student email
        :return: Response - The response object, 404 if the student is not found, 403 if the user is not authorized, 200 if successful
    """

    claims = get_jwt()
    permissions = claims.get("permissions")

    if not permissions:
        return jsonify({}), HTTPStatus.FORBIDDEN

    if not permissions.get("student").get("ITEMS_VIEW"):
        return jsonify({}), HTTPStatus.FORBIDDEN

    provided_languages = retrieve_languages(request.args)
    author = get_author_from_email(entity_table=Student, email=email)

    if not author:
        return jsonify({}), HTTPStatus.NOT_FOUND

    return jsonify(
        get_items_from_author(author, News, provided_languages)
    ), HTTPStatus.OK


@news_bp.route("", methods=["POST"])
@jwt_required()
def create_news() -> Response:
    """
    Creates a news item
        :return: Response - The response object, 401 if the user is not authorized, 400 if the author is not provided, 201 if successful
    """

    data = request.get_json()
    language = request.args.get("language", type=str)

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    if not language:
        return jsonify({"error": "No language provided"}), HTTPStatus.BAD_REQUEST

    data: Dict[str, Any] = json.loads(json.dumps(data))

    author: Dict | None = data.get("author")
    author_type: str = author.get("author_type")

    if author is None or author_type is None:
        return jsonify({"error": "No author provided"}), HTTPStatus.BAD_REQUEST

    author_table = None
    if author_type.upper() == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

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

    url = create_item(
        author_table=author_table,
        email=author_email,
        item_table=News,
        data=data,
    )

    if not url:
        return jsonify(
            {"error": "Failed to create item"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({"url": url}), HTTPStatus.CREATED


@news_bp.route("/<string:identifier>", methods=["PUT"])
@jwt_required()
def update_news_by_url(identifier: str) -> Response:
    """
    Updates a news item by URL
        :param identifier: str - The news URL
        :return: Response - The response object, 404 if the news can't be found 400 if no data is provided, 401 if the user is not authorized, 404 if the news item is not found, 200 if successful
    """

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST
    json_data = json.loads(json.dumps(data))

    if json_data.get("author") is None:
        return jsonify({"error": "No author provided"}), HTTPStatus.BAD_REQUEST

    author_type = json_data.get("author").get("author_type")
    if author_type == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

    url_identifier: bool = request.args.get("url", type=bool)
    langauge_code = retrieve_languages(request.args)

    news_item = None
    if url_identifier:
        news_item = get_item_by_url(
            url=identifier, item_table=News, provided_languages=langauge_code
        )
    else:
        news_item = News.query.filter_by(news_id=identifier).first_or_404()

    if news_item is None or not isinstance(news_item, News):
        return jsonify({"error": "News item not found"}), HTTPStatus.NOT_FOUND

    translations: List[NewsTranslation] = NewsTranslation.query.filter_by(
        news_id=news_item.news_id
    ).all()
    data_translations: List[Dict[str, Any]] = json_data.get("translations")
    for translation in translations:
        # TODO: For now update all translation with the first translation data
        translation.body = data_translations[0].get("body")
        translation.title = data_translations[0].get("title")

    del data["author"]
    del data["translations"]

    update_item(news_item, data=data)
    response = make_response(
        jsonify(
            news_item.to_dict(provided_languages=langauge_code, is_public_route=False)
        )
    )

    response.headers["Cache-Control"] = "no-store"
    response.status_code = HTTPStatus.OK
    return response


@news_bp.route("/<string:identifier>/publish", methods=["PUT"])
@jwt_required()
def publish_news(identifier: str) -> Response:
    """
    Publishes a news item
        :param identifier: str - The news ID
        :return: Response - The response object, 500 if the item failed to create, 401 if the user is not authorized, 400 if no data is provided, 201 if successful
    """

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

    news_item: News = News.query.filter_by(news_id=identifier).first_or_404()

    translation_data: List[Dict[str, Any]] = []
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
                cache_control="public, max-age=31536000, immutable",
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
        return jsonify({"error": "Failed to publish"}), HTTPStatus.INTERNAL_SERVER_ERROR

    """
    TODO: Implement Pub/Sub service for notifications and Discord messages, after the endpoints are in production
    try:
        # Defer notification and Discord message creation to the Pub/Sub service
        base_task_data = {
            "notification_type": "NEWS",
            "notification_metadata": None,
            "translation": [
                {
                    "language_code": translation_data.get("language_code"),
                    "title": translation_data.get("title"),
                    "body": translation_data.get("short_description"),
                    "url": publish_result,
                }
                for translation_data in translation_data
            ],
            "committee_id": author.get("committee_id")
            if author.get("committee_id")
            else None,
        }

        notification_task_data = {
            "task_type": "add_notification",
            **base_task_data,
        }

        notification_data = json.dumps(notification_task_data).encode("utf-8")
        publisher.publish(topic=topic_path, data=notification_data)

        if (
            os.environ.get("DISCORD_WEBHOOK_URL") is not None
            and os.environ.get("DISCORD_WEBHOOK_URL") != ""
        ):
            discord_task_data = {
                "task_type": "send_discord_message",
                **base_task_data,
            }
            discord_data = json.dumps(discord_task_data).encode("utf-8")
            publisher.publish(topic=topic_path, data=discord_data)

    except Exception as e:
        print(f"Unable to send Pub/Sub message, error: {str(e)}")"""

    return jsonify({"url": publish_result}), HTTPStatus.CREATED


@news_bp.route("/<string:url>", methods=["DELETE"])
@jwt_required()
def delete_news(url: str) -> Response:
    """
    Deletes a news item
        :param url: str - The news URL
        :return: Response - The response object, 404 if the news item or author is not found, 401 if the user is not authorized, 204 if successful
    """

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
