"""
Public Document Routes
API Endpoint: '/api/v1/public/documents'
"""

from datetime import datetime, timedelta
from http import HTTPStatus
from flask import Blueprint, jsonify, request
from sqlalchemy import or_

from models.content.document import Document, DocumentTranslation
from services.content.public.item import get_item_by_url
from utility.translation import retrieve_languages


public_documents_bp = Blueprint("public_documents", __name__)


@public_documents_bp.route("/", methods=["GET"])
def get_documents() -> dict:
    """Retrieves all documents

    Returns:
        list[dict]: List of documents
    """
    provided_languages = retrieve_languages(request.args)
    status = request.args.get("status", type=str, default="active")
    search = request.args.get("search", type=str, default=None)
    documents_pagination = None

    if search:
        documents_pagination = (
            Document.query.order_by(Document.created_at.desc())
            .join(
                DocumentTranslation,
                DocumentTranslation.document_id == Document.document_id,
            )
            .filter(
                DocumentTranslation.title.ilike(f"%{search}%"),
                Document.is_public == True,  # noqa: E712
            )
            .paginate(per_page=30, max_per_page=30)
        )

    if status == "active" and not search:
        documents_pagination = (
            Document.query.order_by(
                Document.is_pinned.desc(), Document.created_at.desc()
            )
            .filter(
                Document.is_public == True,  # noqa: E712
                or_(
                    Document.created_at >= datetime.now() - timedelta(days=365),
                    Document.is_pinned == True,  # noqa: E712
                ),
            )
            .paginate(per_page=30, max_per_page=30)
        )
    elif status == "archived" and not search:
        documents_pagination = (
            Document.query.order_by(Document.created_at.desc())
            .filter(
                Document.is_public == True,  # noqa: E712
                Document.created_at < datetime.now() - timedelta(days=365),
                Document.is_pinned == False,  # noqa: E712
            )
            .paginate(per_page=30, max_per_page=30)
        )

    documents = documents_pagination.items
    document_dict = [
        document_dict
        for document in documents
        if (
            document_dict := document.to_dict(
                is_public_route=True, provided_languages=provided_languages
            )
        )
        is not None
    ]

    return jsonify(
        {
            "items": document_dict,
            "page": documents_pagination.page,
            "per_page": documents_pagination.per_page,
            "total_pages": documents_pagination.pages,
            "total_items": documents_pagination.total,
        }
    ), HTTPStatus.OK


@public_documents_bp.route("/<string:url>", methods=["GET"])
def get_documents_by_url(url: str) -> dict:
    """Retrieves a document item by URL

    Args:
        url (str): Document URL

    Returns:
        dict: Document item
    """
    provided_languages = retrieve_languages(request.args)

    item = get_item_by_url(url, Document, provided_languages)

    if not item:
        return jsonify({}), 404

    item: Document = item

    return jsonify(item)
