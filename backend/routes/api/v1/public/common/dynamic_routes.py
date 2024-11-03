"""
Dynamic Routes (Public)
API Endpoint: '/api/v1/public/dynamic'
"""

from http import HTTPStatus
from flask import Blueprint, Response, jsonify
from typing import List
from sqlalchemy import func
from models.core import Resource

public_dynamic_routes_bp = Blueprint("dynamic_routes", __name__)


@public_dynamic_routes_bp.route("/", methods=["GET"])
def get_resources() -> Response:
    """
    Retrieves all resources
        :return: Response - The response object, 200 if successful
    """

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
    ), HTTPStatus.OK


@public_dynamic_routes_bp.route("/categories", methods=["GET"])
def get_categories() -> Response:
    """
    Retrieves all resource categories
        :return: Response - The response object, 200 if successful
    """

    categories = Resource.query.with_entities(
        Resource.category, func.count(Resource.resource_id)
    ).group_by(Resource.category)

    categories = (
        categories.filter_by(is_public=True).filter(Resource.category.isnot(None)).all()
    )

    categories_dict = [
        {"category": category.value, "count": count} for category, count in categories
    ]

    return jsonify(categories_dict), HTTPStatus.OK


@public_dynamic_routes_bp.route("/categories/<string:category>", methods=["GET"])
def get_resources_by_category(category: str) -> Response:
    """
    Retrieves all resources by category
        :param category: str - The category of the resources
        :return: Response - The response object, 200 if successful
    """
    items: List[Resource] = Resource.query.filter(
        Resource.category == category.upper()
    ).all()
    resources_dict = [resource.to_dict(is_public_route=True) for resource in items]

    return jsonify(resources_dict), HTTPStatus.OK
