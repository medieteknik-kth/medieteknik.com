"""
General Routes (Public)
API Endpoint: '/api/v1/public'
"""

from http import HTTPStatus
from flask import Blueprint, Response, jsonify
from models.core import Language
from utility import ROUTES

public_bp = Blueprint("public", __name__)
LANGUAGE_ROUTE_PREFIX: str = ROUTES.LANGUAGES.value


@public_bp.route(LANGUAGE_ROUTE_PREFIX, methods=["GET"])
def get_languages() -> Response:
    """
    Retrieves all languages
        :return: Response - The response object, 200 if successful
    """

    languages: list[Language] = Language.query.all()
    languages_dict = [language.to_dict() for language in languages]
    return jsonify(languages_dict), HTTPStatus.OK
