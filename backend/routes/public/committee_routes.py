from flask import Blueprint, request, jsonify
from sqlalchemy import func
from models.committee import Committee, CommitteeCategory, CommitteePosition, CommitteeTranslation
from utility.translation import retrieve_language

public_committee_category_bp = Blueprint('public_committee_category', __name__)
public_committee_bp = Blueprint('public_committee', __name__)
public_committee_position_bp = Blueprint('public_committee_position', __name__)

@public_committee_category_bp.route('/', methods=['GET'])
def get_committee_categories() -> dict:
    """Retrieves all committee categories
    
    Returns:
        list[dict]: List of committee categories
    """
    language_code = retrieve_language(request.args)
    
    categories: list[CommitteeCategory] = CommitteeCategory.query.all()
    categories_dict = [category.to_dict(language_code) for category in categories]
    return jsonify(categories_dict)

@public_committee_category_bp.route('/<int:category_id>', methods=['GET'])
def get_committee_category(category_id: int) -> dict:
    """Retrieves a committee category
    
    Args:
        category_id (int): Committee category ID
    
    Returns:
        dict: Committee category
    """
    language_code = retrieve_language(request.args)
    
    category: CommitteeCategory = CommitteeCategory.query.get(category_id)
    return jsonify(category.to_dict(language_code))

@public_committee_bp.route('/', methods=['GET'])
def get_committees() -> dict:
    """Retrieves all committees
    
    Returns:
        list[dict]: List of committees
    """
    language_code = retrieve_language(request.args)
    
    committees: list[Committee] = Committee.query.all()
    committees_dict = [committee.to_dict(language_code) for committee in committees]
    return jsonify(
        committees_dict
    )

@public_committee_bp.route('/<int:committee_id>', methods=['GET'])
def get_committee(committee_id: int) -> dict:
    """Retrieves a committee
    
    Args:
        committee_id (int): Committee ID
    
    Returns:
        dict: Committee
    """
    language_code = retrieve_language(request.args)
    
    committee: Committee = Committee.query.get(committee_id)
    return jsonify(committee.to_dict(language_code))

@public_committee_bp.route('/name/<string:committee_name>', methods=['GET'])
def get_committee_by_name(committee_name: str) -> dict:
    """Retrieves a committee by name
    
    Args:
        committee_name (str): Committee name
    
    Returns:
        dict: Committee
    """
    language_code = retrieve_language(request.args)
    
    committee_translation: CommitteeTranslation | None = CommitteeTranslation.query \
        .filter(func.lower(CommitteeTranslation.title) == func.lower(committee_name)) \
        .filter_by(language_code=language_code).first()
    
    if not committee_translation:
        return jsonify({})
    
    committee_translation: CommitteeTranslation = committee_translation
    committee = Committee.query.filter_by(committee_id=committee_translation.committee_id).first()
    
    return jsonify(committee.to_dict(language_code))

@public_committee_position_bp.route('/', methods=['GET'])
def get_committee_positions() -> dict:
    """Retrieves all committee positions
    
    Returns:
        list[dict]: List of committee positions
    """
    language_code = retrieve_language(request.args)

    per_page = request.args.get('per_page', 10, type=int)
    paginated_items = CommitteePosition.query.paginate(per_page=per_page)
    
    positions: list[CommitteePosition] = paginated_items.items
    positions_dict = [position.to_dict(language_code, is_public_route=True) for position in positions]
    return jsonify(
        {
            "items": positions_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_committee_position_bp.route('/<int:position_id>', methods=['GET'])
def get_committee_position(position_id: int) -> dict:
    """Retrieves a committee position
    
    Args:
        position_id (int): Committee position ID
    
    Returns:
        dict: Committee position
    """
    language_code = retrieve_language(request.args)
    
    position: CommitteePosition = CommitteePosition.query.get(position_id)
    return jsonify(position.to_dict(language_code, is_public_route=True))