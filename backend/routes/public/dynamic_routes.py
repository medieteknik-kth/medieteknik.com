from typing import List
from flask import Blueprint, jsonify
from sqlalchemy import func
from models.core import Resource

public_dynamic_routes_bp = Blueprint("dynamic_routes", __name__)


@public_dynamic_routes_bp.route("/", methods=["GET"])
def get_resources():
    """Retrieves all resources"""
    paginated_items = Resource.query.paginate()

    items: List[Resource] = paginated_items.items
    resources_dict = [
        resource_dict
        for resource in items
        if (resource_dict := resource.to_dict(is_public_route=True)) is not None
    ]

    return jsonify(
        {
            "items": resources_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )


@public_dynamic_routes_bp.route("/categories", methods=["GET"])
def get_categories():
    """Retrieves all categories"""
    # Get all categories and amount of resources in each category
    categories = Resource.query.with_entities(
        Resource.category, func.count(Resource.resource_id)
    ).group_by(Resource.category)
    categories = (
        categories.filter_by(is_public=True).filter(Resource.category.isnot(None)).all()
    )
    categories_dict = [
        {"category": category.value, "count": count} for category, count in categories
    ]
    return jsonify(categories_dict)


@public_dynamic_routes_bp.route("/categories/<string:category>", methods=["GET"])
def get_resources_by_category(category: str):
    """Retrieves all resources by category

    Args:
        category (str): Resource category
    """
    items: List[Resource] = Resource.query.filter(
        Resource.category == category.upper()
    ).all()
    resources_dict = [resource.to_dict(is_public_route=True) for resource in items]

    return jsonify(resources_dict)
