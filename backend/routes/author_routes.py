from html import escape
from flask import Blueprint, request, jsonify
from models.content import Author, AuthorType, AuthorResource
from utility import database

db = database.db

author_bp = Blueprint("author", __name__)


@author_bp.route("/", methods=["GET"])
def get_authors():
    """Get all authors

    Returns:
        dict: List of authors
    """

    author_type = request.args.get("type")
    authors = Author.query

    if author_type:
        if author_type.upper() not in [author_type.value for author_type in AuthorType]:
            return jsonify({"error": "Invalid author type"}), 400

        # Sanitize input
        if not isinstance(author_type, str):
            return jsonify({"error": "Invalid author type"}), 400

        author_type = escape(author_type)

        authors = authors.filter_by(author_type=author_type.upper())

    resources = request.args.getlist("resources")
    santized_resources = []

    if resources:
        for resource in resources:
            if resource.upper() not in [resource.value for resource in AuthorResource]:
                return jsonify({"error": "Invalid resource"}), 400

            if not isinstance(resource, str):
                return jsonify({"error": "Invalid resource"}), 400

            resource = escape(resource)
            santized_resources.append(resource.upper())

        authors = authors.filter(
            Author.resources.contains(
                [resource.upper() for resource in santized_resources]
            )
        )

    authors = authors.all()

    return jsonify([author.to_dict() for author in authors])


# @author_bp.route("/", methods=["POST"])
# def create_author():
# pass