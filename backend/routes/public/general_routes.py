from flask import Blueprint, request, jsonify
from models.language import Language
from utility.constants import ROUTES

public_bp = Blueprint('public', __name__)
LANGUAGE_ROUTE_PREFIX: str = ROUTES.LANGUAGES.value

@public_bp.route(LANGUAGE_ROUTE_PREFIX, methods=['GET'])
def get_languages() -> dict:
    """Retrieves all languages
    
    Returns:
        list[dict]: List of languages
    """
    languages: list[Language] = Language.query.all()
    languages_dict = [language.to_dict() for language in languages]
    return jsonify(languages_dict)