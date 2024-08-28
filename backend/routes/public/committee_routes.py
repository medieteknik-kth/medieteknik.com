"""
Committee Routes (Public)
API Endpoint: '/api/v1/public/committees'
"""

from typing import List
from flask import Blueprint, request, jsonify
from models.committees.committee_position import CommitteePosition
from services.committees.public import (
    get_all_committee_categories,
    get_all_committees,
    get_committee_by_title,
    get_all_committee_members,
    CommitteeSettings,
    CommitteeCategorySettings,
)
from services.committees.public.committee_category import (
    get_committee_category_by_title,
)
from utility.translation import retrieve_languages

public_committee_category_bp = Blueprint("public_committee_category", __name__)
public_committee_bp = Blueprint("public_committee", __name__)


@public_committee_category_bp.route("/", methods=["GET"])
def get_committee_categories():
    """Retrieves all committee categories"""
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committee_categories(provided_languages))


@public_committee_category_bp.route(
    "/<string:committee_category_title>", methods=["GET"]
)
def get_committee_category_by_name(committee_category_title: str):
    """Retrieves a committee by title"""

    provided_languages = retrieve_languages(request.args)
    include_committees = request.args.get("committees", False, type=bool)

    return jsonify(
        get_committee_category_by_title(
            committee_category_title,
            provided_languages,
            CommitteeCategorySettings(include_committees),
        )
    )


@public_committee_bp.route("/", methods=["GET"])
def get_committees():
    """Retrieves all committees"""
    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committees(provided_languages))


@public_committee_bp.route("/<string:committee_title>", methods=["GET"])
def get_committee_by_name(committee_title: str):
    """Retrieves a committee by title

    Args:
        committee_title (str): Committee title
    """
    provided_languages = retrieve_languages(request.args)
    include_positions = request.args.get("include_positions", False, type=bool)

    committee = get_committee_by_title(
        committee_title,
        CommitteeSettings(include_positions=include_positions),
    )

    if not committee:
        return jsonify({})

    committee_dict = committee.to_dict(provided_languages)

    if not committee_dict:
        return jsonify({})

    if include_positions:
        committee_positions: List[CommitteePosition] = (
            CommitteePosition.query.filter_by(committee_id=committee.committee_id).all()
        )

        committee_dict["positions"] = [
            position.to_dict(provided_languages) for position in committee_positions
        ]

    return jsonify(committee_dict)


@public_committee_bp.route("/<string:committee_title>/members", methods=["GET"])
def get_committee_members(committee_title: str):
    """Retrieves all committee members

    Args:
        committee_title (str): Committee title
    """
    provided_languages = retrieve_languages(request.args)
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    committee = get_committee_by_title(title=committee_title)

    if not committee:
        return jsonify([])

    return jsonify(
        get_all_committee_members(
            committee=committee,
            provided_languages=provided_languages,
            page=page,
            per_page=per_page,
        )
    )
