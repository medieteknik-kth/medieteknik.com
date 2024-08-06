"""
Document Routes (Protected)
API Endpoint: '/api/v1/documents'
"""

from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models.content.document import Document
from models.core.student import Student
from services.content.item import create_item
from utility.constants import AVAILABLE_LANGUAGES
from utility.gc import upload_file
from utility.translation import convert_iso_639_1_to_bcp_47


documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/", methods=["POST"])
@jwt_required()
def create_document():
    document_type = request.form.get("document_type")
    author_type = request.form.get("author[author_type]")
    entity_email = request.form.get("author[entity_email]")

    if document_type is None or author_type is None or entity_email is None:
        return jsonify(
            {
                "error": "Missing required fields, either 'author' or 'document_type' is missing"
            }
        ), HTTPStatus.BAD_REQUEST

    urls = []
    for index, _ in enumerate(AVAILABLE_LANGUAGES):
        file = request.files.get(f"translations[{index}][file]")
        title = request.form.get(f"translations[{index}][title]")
        language_code = request.form.get(f"translations[{index}][language_code]")

        if file is None or title is None or language_code is None:
            return jsonify(
                {
                    "error": "Missing required fields, either 'file', 'title' or 'language_code"
                }
            ), HTTPStatus.BAD_REQUEST

        result = upload_file(
            file=file,
            file_name=f"{file.filename}",
            path=f"documents/{convert_iso_639_1_to_bcp_47(language_code)}",
            language_code=language_code,
            content_disposition="inline",
            content_type="application/pdf",
        )

        if not result:
            return jsonify(
                {"error": "Failed to upload file"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

        urls.append(result)

    id = create_item(
        author_table=Student,
        author_email=entity_email,
        item_table=Document,
        data={
            "document_type": document_type,
            "author": {"author_type": author_type, "entity_email": entity_email},
            "translations": [
                {
                    "url": urls[index],
                    "title": request.form.get(f"translations[{index}][title]"),
                    "language_code": convert_iso_639_1_to_bcp_47(
                        request.form.get(f"translations[{index}][language_code]")
                    ),
                }
                for index, _ in enumerate(AVAILABLE_LANGUAGES)
            ],
        },
        public=True,
    )

    if not id:
        return jsonify(
            {"error": "Failed to create item"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    return jsonify(
        {
            "id": id,
            "translations": [
                {
                    "url": urls[index],
                    "title": request.form.get(f"translations[{index}][title]"),
                    "language_code": convert_iso_639_1_to_bcp_47(
                        request.form.get(f"translations[{index}][language_code]")
                    ),
                }
                for index, _ in enumerate(AVAILABLE_LANGUAGES)
            ],
        }
    ), HTTPStatus.CREATED
