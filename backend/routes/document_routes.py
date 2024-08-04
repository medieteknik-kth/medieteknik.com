"""
Document Routes (Protected)
API Endpoint: '/api/v1/documents'
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.content.document import Document
from models.core.student import Student
from services.content.item import create_item
from utility.gc import upload_file
from utility.translation import convert_iso_639_1_to_bcp_47


documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/", methods=["POST"])
@jwt_required()
def create_document():
    document_type = request.form.get("document_type")
    author_type = request.form.get("author[author_type]")
    entity_email = request.form.get("author[entity_email]")

    file = request.files.get("translations[0][file]")
    title = request.form.get("translations[0][title]")
    language_code = request.form.get("translations[0][language_code]")

    if (
        document_type is None
        or author_type is None
        or entity_email is None
        or file is None
        or title is None
        or language_code is None
    ):
        return jsonify({"error": "Missing required fields"}), 400

    result = upload_file(
        file=file,
        file_name=f"{file.filename}",
        path=f"documents/{convert_iso_639_1_to_bcp_47(language_code)}",
    )

    if not result:
        return jsonify({"error": "Failed to upload file"}), 400

    id = create_item(
        author_table=Student,
        author_email=entity_email,
        item_table=Document,
        data={
            "document_type": document_type,
            "author": {"author_type": author_type, "entity_email": entity_email},
            "translations": [
                {
                    "title": title,
                    "language_code": language_code,
                    "url": result,
                }
            ],
        },
        public=True,
    )

    if not id:
        return jsonify({"error": "Failed to create item"}), 400

    return {"id": id}, 201
