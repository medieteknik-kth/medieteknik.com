"""
General Routes (Public)
API Endpoint: '/api/v1/public'
"""

from http import HTTPStatus
import json
from flask import Blueprint, Response, jsonify, request
from services.utility.search import update_search_cache
from utility.cache import get_cache
from utility.constants import AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE_CODE
from utility.translation import convert_iso_639_1_to_bcp_47, retrieve_languages

public_bp = Blueprint("public", __name__)


@public_bp.route("/search", methods=["GET"])
def search_content() -> Response:
    """
    Retrieves all translations
        :return: Response - The response object, 200 if successful
    """

    language = request.args.get("language", DEFAULT_LANGUAGE_CODE)
    language = convert_iso_639_1_to_bcp_47(language)

    if language not in AVAILABLE_LANGUAGES:
        return jsonify({"error": "Language not available"}), HTTPStatus.NOT_FOUND

    cached_data = None

    try:
        cached_data = get_cache(f"search_{language}")
    except Exception as e:
        return jsonify({"error": str(e)}), HTTPStatus.INTERNAL_SERVER_ERROR

    if not cached_data:
        cached_data = update_search_cache(language)

    if not cached_data:
        return jsonify(
            {"error": "Failed to retrieve search data"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    cached_data_json = json.loads(cached_data)
    data = cached_data_json

    if "data" in cached_data_json:
        data = cached_data_json["data"]

    if "committees" not in data:
        return jsonify(
            {"error": "Failed to retrieve search data"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    if isinstance(data, dict):
        return jsonify(data), HTTPStatus.OK

    try:
        data = json.loads(data)
    except json.JSONDecodeError:
        return jsonify(
            {"error": "Failed to parse data as JSON"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify(data), HTTPStatus.OK


@public_bp.route("/search/update", methods=["GET"])
def update_search_content():
    # TODO: Add GCP scheduler to update search data
    language = retrieve_languages(args=request.args, fallback=False)[0]
    result = update_search_cache(language)

    if not result:
        return jsonify(
            {"error": "Failed to update search data"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify({"message": "Search data updated"}), HTTPStatus.OK
