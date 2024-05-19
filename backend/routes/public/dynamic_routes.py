from flask import Blueprint, jsonify
from sqlalchemy import func
from models.resource import Resource

dynamic_routes_bp = Blueprint('dynamic_routes', __name__)

@dynamic_routes_bp.route('/', methods=['GET'])
def get_resources() -> dict:
    """Retrieves all resources
    
    Returns:
        list[dict]: List of resources
    """
    paginated_items: list[Resource] = Resource.query.paginate()
    resources_dict = [resource.to_public_dict() for resource in paginated_items]
    return jsonify(
        {
            "items": resources_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@dynamic_routes_bp.route('/categories', methods=['GET'])
def get_categories() -> dict:
    """Retrieves all categories
    
    Returns:
        list[dict]: List of categories
    """
    # Get all categories and amount of resources in each category
    categories = Resource.query.with_entities(Resource.category, func.count(Resource.resource_id)).group_by(Resource.category)
    categories = categories.filter_by(is_public=True).filter(Resource.category.isnot(None)).all()
    categories_dict = [{"category": category.value, "count": count} for category, count in categories]
    return jsonify(categories_dict)

@dynamic_routes_bp.route('/categories/<string:category>', methods=['GET'])
def get_resources_by_category(category: str) -> dict:
    """Retrieves all resources by category
    
    Args:
        category (str): Resource category
        
    Returns:
        list[dict]: List of resources
    """
    paginated_items: list[Resource] = Resource.query.filter(Resource.category == category.upper()).paginate()
    resources_dict = [resource.to_public_dict() for resource in paginated_items]
    return jsonify(
        {
            "items": resources_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )