"""
Committee Routes (Public)
API Endpoint: '/api/v1/public/committees'
"""

from http import HTTPStatus
from typing import List
from flask import Blueprint, Response, request, jsonify
from models.committees import CommitteePosition
from services.committees.public import (
    get_all_committee_categories,
    get_all_committees,
    get_committee_by_title,
    get_all_committee_members,
    CommitteeSettings,
    CommitteeCategorySettings,
    get_committee_category_by_title,
)
from utility import retrieve_languages

public_committee_category_bp = Blueprint("public_committee_category", __name__)
public_committee_bp = Blueprint("public_committee", __name__)


@public_committee_category_bp.route("", methods=["GET"])
def get_committee_categories() -> Response:
    """
    Retrieves all committee categories
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committee_categories(provided_languages)), HTTPStatus.OK


@public_committee_category_bp.route(
    "/<string:committee_category_title>", methods=["GET"]
)
def get_committee_category_by_name(committee_category_title: str) -> Response:
    """
    Retrieves a committee by title
        :param committee_category_title: str - The title of the committee category
        :return: Response - The response object, 404 if the committee category is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    include_committees = request.args.get("committees", False, type=bool)

    result = get_committee_category_by_title(
        committee_category_title,
        provided_languages,
        CommitteeCategorySettings(include_committees),
    )
    if not result:
        return jsonify({}), HTTPStatus.NOT_FOUND

    return jsonify(result), HTTPStatus.OK


@public_committee_bp.route("", methods=["GET"])
def get_committees() -> Response:
    """
    Retrieves all committees
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    return jsonify(get_all_committees(provided_languages)), HTTPStatus.OK


@public_committee_bp.route("/<string:committee_title>", methods=["GET"])
def get_committee_by_name(committee_title: str) -> Response:
    """
    Retrieves a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 404 if the committee is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    include_positions = request.args.get("include_positions", False, type=bool)

    committee = get_committee_by_title(
        committee_title,
        CommitteeSettings(include_positions=include_positions),
    )

    if not committee:
        return jsonify({}), HTTPStatus.NOT_FOUND

    committee_dict = committee.to_dict(provided_languages)

    if not committee_dict:
        return jsonify({}), HTTPStatus.NOT_FOUND

    if include_positions:
        committee_positions: List[CommitteePosition] = (
            CommitteePosition.query.filter_by(committee_id=committee.committee_id).all()
        )

        committee_dict["positions"] = [
            position.to_dict(provided_languages) for position in committee_positions
        ]

    return jsonify(committee_dict), HTTPStatus.OK


@public_committee_bp.route("/<string:committee_title>/members", methods=["GET"])
def get_committee_members(committee_title: str) -> Response:
    """
    Retrieves all committee members for a committee by title
        :param committee_title: str - The title of the committee
        :return: Response - The response object, 200 if successful
    """

    snapshot_date = request.args.get("snapshot_date", None)
    officials = request.args.get("officials", False, type=bool)
    provided_languages = retrieve_languages(request.args)
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    committee = get_committee_by_title(title=committee_title)

    if not committee:
        return jsonify([])

    return jsonify(
        get_all_committee_members(
            committee=committee,
            date=snapshot_date,
            officials=officials,
            provided_languages=provided_languages,
            page=page,
            per_page=per_page,
        )
    ), HTTPStatus.OK
