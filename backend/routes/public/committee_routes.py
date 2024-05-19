from flask import Blueprint, request, jsonify
from models.committee import Committee, CommitteeCategory, CommitteePosition

public_committee_category_bp = Blueprint('public_committee_category', __name__)
public_committee_bp = Blueprint('public_committee', __name__)
public_committee_position_bp = Blueprint('public_committee_position', __name__)

@public_committee_category_bp.route('/', methods=['GET'])
def get_committee_categories() -> dict:
    """Retrieves all committee categories
    
    Returns:
        list[dict]: List of committee categories
    """
    categories: list[CommitteeCategory] = CommitteeCategory.query.all()
    categories_dict = [category.to_dict() for category in categories]
    return jsonify(categories_dict)

@public_committee_category_bp.route('/<int:category_id>', methods=['GET'])
def get_committee_category(category_id: int) -> dict:
    """Retrieves a committee category
    
    Args:
        category_id (int): Committee category ID
    
    Returns:
        dict: Committee category
    """
    category: CommitteeCategory = CommitteeCategory.query.get(category_id)
    return jsonify(category.to_dict())

@public_committee_bp.route('/', methods=['GET'])
def get_committees() -> dict:
    """Retrieves all committees
    
    Returns:
        list[dict]: List of committees
    """
    per_page = request.args.get('per_page', 5, type=int)
    paginated_items = Committee.query.paginate(per_page=per_page)
    
    committees: list[Committee] = paginated_items.items
    committees_dict = [committee.to_public_dict() for committee in committees]
    return jsonify(
        {
            "items": committees_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_committee_bp.route('/<int:committee_id>', methods=['GET'])
def get_committee(committee_id: int) -> dict:
    """Retrieves a committee
    
    Args:
        committee_id (int): Committee ID
    
    Returns:
        dict: Committee
    """
    committee: Committee = Committee.query.get(committee_id)
    return jsonify(committee.to_public_dict())

@public_committee_position_bp.route('/', methods=['GET'])
def get_committee_positions() -> dict:
    """Retrieves all committee positions
    
    Returns:
        list[dict]: List of committee positions
    """
    per_page = request.args.get('per_page', 10, type=int)
    paginated_items = CommitteePosition.query.paginate(per_page=per_page)
    
    positions: list[CommitteePosition] = paginated_items.items
    positions_dict = [position.to_public_dict() for position in positions]
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
    position: CommitteePosition = CommitteePosition.query.get(position_id)
    return jsonify(position.to_public_dict())