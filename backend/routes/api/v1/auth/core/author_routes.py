"""
Author Routes (Protected)
API Endpoint: '/api/v1/authors'
"""

from http import HTTPStatus
from flask import Blueprint, Response, request, jsonify
from flask_jwt_extended import jwt_required
from html import escape
from models.core import Author, AuthorType, AuthorResource


author_bp = Blueprint("author", __name__)


@author_bp.route("/", methods=["GET"])
@jwt_required()
def get_authors() -> Response:
    """
    Retrieves a list of authors based on the provided query parameters
        :return: Response - The response object, 400 if the author type is invalid, 200 if successful
    """

    author_type = request.args.get("type", type=str)
    authors = Author.query

    if author_type:
        if author_type.upper() not in AuthorType.__members__:
            return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

        author_type = escape(author_type)

        authors = authors.filter(Author.author_type == author_type.upper())

    resources = request.args.getlist("resources")
    santized_resources = []

    if resources:
        for resource in resources:
            if resource.upper() not in [resource.value for resource in AuthorResource]:
                return jsonify({"error": "Invalid resource"}), HTTPStatus.BAD_REQUEST

            if not isinstance(resource, str):
                return jsonify({"error": "Invalid resource"}), HTTPStatus.BAD_REQUEST

            resource = escape(resource)
            santized_resources.append(resource.upper())

        authors = authors.filter(
            Author.resources.contains(
                [resource.upper() for resource in santized_resources]
            )
        )

    authors = authors.all()

    return jsonify([author.to_dict() for author in authors]), HTTPStatus.OK
