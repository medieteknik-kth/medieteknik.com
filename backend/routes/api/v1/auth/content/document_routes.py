"""
Document Routes (Protected)
API Endpoint: '/api/v1/documents'
"""

from datetime import date
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from http import HTTPStatus
from typing import List
from decorators.auditable import audit
from models.committees import Committee, CommitteePosition
from models.content import Document, DocumentTranslation
from models.core import Student, StudentMembership, Author
from models.utility.audit import EndpointCategory
from services.content import create_item
from utility import (
    AVAILABLE_LANGUAGES,
    upload_file,
    delete_file,
    convert_iso_639_1_to_bcp_47,
    db,
)


documents_bp = Blueprint("documents", __name__)


@documents_bp.route("/", methods=["POST"])
@jwt_required()
@audit(
    endpoint_category=EndpointCategory.DOCUMENT,
    additional_info="Uploaded a new document",
)
def create_document() -> Response:
    """
    Creates a new document
        :return: Response - The response object, 500 if it fails to upload the files, 400 if no data is provided, 201 if successful
    """

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
            timedelta=None,
            content_type="application/pdf",
        )

        if not result:
            return jsonify(
                {"error": "Failed to upload file"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

        urls.append(result)

    author_table = None
    if author_type.upper() == "STUDENT":
        author_table = Student
    elif author_type.upper() == "COMMITTEE":
        author_table = Committee
    elif author_type.upper() == "COMMITTEE_POSITION":
        author_table = CommitteePosition
    else:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

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

    committee: Committee = Committee.query.filter_by(email=email).first_or_404()
    setattr(committee, "total_documents", committee.total_documents + 1)
    db.session.commit()

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


@documents_bp.route("/<string:document_id>/pin", methods=["PUT"])
@jwt_required()
@audit(
    endpoint_category=EndpointCategory.DOCUMENT,
    additional_info="Pinned a document",
)
def pin_document(document_id: str) -> Response:
    """
    Pins a document
        :param document_id: str - The document id
        :return: Response - The response object, 501 if the author type is not supported, 404 if the document is not found, 401 if the student is not authorized, 204 if successful
    """

    student_id = get_jwt_identity()

    document: Document = Document.query.filter_by(
        document_id=document_id
    ).first_or_404()

    author: Author = Author.query.filter_by(author_id=document.author_id).first_or_404()

    if author.committee_id:
        membership = (
            StudentMembership.query.join(
                CommitteePosition,
                StudentMembership.committee_position_id
                == CommitteePosition.committee_position_id,
            )
            .filter(
                CommitteePosition.committee_id == author.committee_id,
                StudentMembership.student_id == student_id,
                StudentMembership.termination_date.is_(None),
            )
            .first()
        )

        if not membership:
            return jsonify({}), HTTPStatus.UNAUTHORIZED
    else:
        return jsonify({}), HTTPStatus.NOT_IMPLEMENTED

    document.is_pinned = not document.is_pinned
    db.session.commit()

    return jsonify({}), HTTPStatus.NO_CONTENT


@documents_bp.route("/<string:document_id>", methods=["DELETE"])
@jwt_required()
@audit(
    endpoint_category=EndpointCategory.DOCUMENT,
    additional_info="Deleted a document",
)
def delete_document(document_id: str) -> Response:
    """
    Deletes a document
        :param document_id: str - The document id
        :return: Response - The response object, 500 if it fails to delete the file, 404 if the document is not found, 401 if the student is not authorized, 204 if successful
    """

    student_id = get_jwt_identity()

    document: Document = Document.query.filter_by(
        document_id=document_id
    ).first_or_404()

    author: Author = Author.query.filter_by(author_id=document.author_id).first_or_404()

    if author.committee_id:
        membership = (
            StudentMembership.query.join(
                CommitteePosition,
                StudentMembership.committee_position_id
                == CommitteePosition.committee_position_id,
            )
            .filter(
                CommitteePosition.committee_id == author.committee_id,
                StudentMembership.student_id == student_id,
                StudentMembership.termination_date.is_(None),
            )
            .first()
        )

        if not membership:
            return jsonify({}), HTTPStatus.UNAUTHORIZED
    else:
        return jsonify({}), HTTPStatus.NOT_IMPLEMENTED

    translations: List[DocumentTranslation] = DocumentTranslation.query.filter_by(
        document_id=str(document_id)
    ).all()

    if len(translations) == 0:
        return jsonify(
            {"error": "Document translation not found"}
        ), HTTPStatus.NOT_FOUND

    db.session.begin()
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
