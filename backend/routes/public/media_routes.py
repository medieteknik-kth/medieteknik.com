from flask import Blueprint, jsonify, request

from models.content.author import Author
from models.content.media import Media
from services.content.public.item import (
    get_items,
    get_items_from_author,
    get_latest_items,
)
from utility.translation import retrieve_languages


public_media_bp = Blueprint("public_media", __name__)


@public_media_bp.route("/")
def get_all_media():
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_items(Media, provided_languages)), 200


@public_media_bp.route("/author/<string:author_id>")
def get_media_by_author(author_id: str):
    provided_languages = retrieve_languages(request.args)

    author = Author.query.filter_by(student_id=author_id).first()

    if not author:
        author = Author.query.filter_by(committee_id=author_id).first()

    if not author:
        return jsonify({}), 404

    return jsonify(get_items_from_author(author, Media, provided_languages)), 200


@public_media_bp.route("/latest")
def get_latest_media():
    provided_languages = retrieve_languages(request.args)
    return get_latest_items(
        item_table=Media, count=10, provided_languages=provided_languages
    )
