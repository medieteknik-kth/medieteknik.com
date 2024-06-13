from services.committees.public import *
from flask import Blueprint, request, jsonify
from utility.translation import retrieve_languages

public_committee_category_bp = Blueprint('public_committee_category', __name__)
public_committee_bp = Blueprint('public_committee', __name__)
public_committee_position_bp = Blueprint('public_committee_position', __name__)

@public_committee_category_bp.route('/', methods=['GET'])
def get_committee_categories() -> dict:
    """Retrieves all committee categories
    
    Returns:
        list[dict]: List of committee categories
    """
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committee_categories(provided_languages))


@public_committee_bp.route('/', methods=['GET'])
def get_committees() -> dict:
    """Retrieves all committees
    
    Returns:
        list[dict]: List of committees
    """
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committees(provided_languages))

@public_committee_bp.route('/<string:committee_title>', methods=['GET'])
def get_committee_by_name(committee_title: str) -> dict:
    """Retrieves a committee by title
    
    Args:
        committee_title (str): Committee title
    
    Returns:
        dict: Committee
    """
    provided_languages = retrieve_languages(request.args)
    include_positions = request.args.get('include_positions', False, type=bool)

    return jsonify(
        get_committee_by_title(committee_title, provided_languages, CommitteeSettings(include_positions=include_positions))
    )

@public_committee_position_bp.route('/<string:position_title>', methods=['GET'])
def get_committee_position_by_name(position_title: str) -> dict:
    """Retrieves a committee position by title
    
    Args:
        position_title (str): Committee position title
    
    Returns:
        dict: Committee position
    """
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_committee_position_by_title(provided_languages=provided_languages, title=position_title))