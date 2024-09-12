"""
Document Routes (Protected)
API Endpoint: '/api/v1/documents'
"""

from datetime import date
from http import HTTPStatus
from typing import Any, Dict, List
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content.author import Author
from models.content.document import Document, DocumentTranslation
from models.core.permissions import Permissions, Role
from models.core.student import Student
from services.content.item import create_item
from utility.constants import AVAILABLE_LANGUAGES
from utility.gc import upload_file, delete_file
from utility.translation import convert_iso_639_1_to_bcp_47
from utility.database import db


documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/", methods=["POST"])
@jwt_required()
def create_document():
    document_type = request.form.get("document_type")
    author_type = request.form.get("author[author_type]")
    email = request.form.get("author[email]")

    if document_type is None or author_type is None or email is None:
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

        current_year = date.today().strftime("%Y")
        current_month = date.today().strftime("%m")
        result = upload_file(
            file=file,
            file_name=f"{file.filename}",
            path=f"documents/{convert_iso_639_1_to_bcp_47(language_code)}/{current_year}/{current_month}",
            language_code=language_code,
            content_disposition="inline",
            content_type="application/pdf",
        )

        if not result:
            return jsonify(
                {"error": "Failed to upload file"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

        urls.append(result)

    author_table = None
    if author_type == "STUDENT":
        author_table = Student
    elif author_type == "COMMITTEE":
        author_table = Committee
    elif author_type == "COMMITTEE_POSITION":
        author_table = CommitteePosition
    else:
        return jsonify({"error": "Invalid author type"}), 400

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), 400

    id = create_item(
        author_table=author_table,
        email=email,
        item_table=Document,
        data={
            "document_type": document_type,
            "author": {"author_type": author_type, "email": email},
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


@documents_bp.route("/<string:document_id>", methods=["DELETE"])
@jwt_required()
def delete_document(document_id: str):
    student_id = get_jwt_identity()
    claims = get_jwt()
    permissions: Dict[str, Any] | None = claims.get("permissions")
    role: List[str] | None = claims.get("role")

    if not permissions or not role:
        return jsonify({}), HTTPStatus.UNAUTHORIZED

    # Check ownership
    author = Author.query.filter_by(student_id=student_id).first()
    # TODO: Check committee ownership

    if author is None:
        # Check if the user is allowed to delete any document
        if (
            Permissions.ITEMS_DELETE.value not in permissions.get("student")
            and Role.ADMIN.value not in role
        ):
            return jsonify({}), HTTPStatus.UNAUTHORIZED
    document: Document = Document.query.filter_by(
        document_id=document_id
    ).first_or_404()

    translations: List[DocumentTranslation] = DocumentTranslation.query.filter_by(
        document_id=str(document_id)
    ).all()

    if len(translations) == 0:
        return jsonify(
            {"error": "Document translation not found"}
        ), HTTPStatus.NOT_FOUND

    for translation in translations:
        result = delete_file(translation.url)

        if not result:
            db.session.rollback()
            return jsonify(
                {"error": "Failed to delete file"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR
    for translation in translations:
        db.session.delete(translation)

    db.session.flush()

    db.session.delete(document)
    db.session.commit()

    return jsonify({}), HTTPStatus.NO_CONTENT
