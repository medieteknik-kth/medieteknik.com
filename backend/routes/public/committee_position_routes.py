"""
Public Committee Position Routes
API Endpoint: '/api/v1/public/committee_positions'
"""

from typing import List
from flask import Blueprint, jsonify, request
from sqlalchemy import func
from models.committees.committee import Committee
from models.committees.committee_position import (
    CommitteePosition,
    CommitteePositionRecruitment,
)
from services.committees.public.committee import get_committee_by_title
from services.committees.public.committee_position import (
    get_committee_position_by_title,
)
from utility.translation import retrieve_languages


public_committee_position_bp = Blueprint("public_committee_position", __name__)


@public_committee_position_bp.route("/", methods=["GET"])
def get_all_positions():
    """Retrieves all committee positions"""
    position_type = request.args.get(
        "type", type=str, default="committee"
    )  # Possible values: committee, independent
    provided_languages = retrieve_languages(request.args)

    committee_positions = []
    if position_type == "committee":
        committee_positions: List[CommitteePosition] = CommitteePosition.query.filter(
            CommitteePosition.committee_id != None,  # noqa
            CommitteePosition.base != True,  # noqa
            CommitteePosition.role != "MEMBER",
        ).all()
    elif position_type == "independent":
        committee_positions: List[CommitteePosition] = CommitteePosition.query.filter(
            CommitteePosition.committee_id == None  # noqa
        ).all()

    return jsonify(
        [
            position.to_dict(provided_languages=provided_languages, include_parent=True)
            for position in committee_positions
        ]
    )


@public_committee_position_bp.route("/recruiting", methods=["GET"])
def get_all_committee_positions_recruitment():
    """Retrieves all committee positions with recruitment"""
    provided_languages = retrieve_languages(request.args)
    committee_name = request.args.get("committee", type=str, default="all")

    recruitments: List[CommitteePositionRecruitment] = []

    if committee_name == "all":
        recruitments = CommitteePositionRecruitment.query.filter(
            CommitteePositionRecruitment.start_date <= func.now(),
            CommitteePositionRecruitment.end_date >= func.now(),
        ).all()
        return jsonify(
            [
                recruitment_dict
                for recruitment in recruitments
                if (
                    recruitment_dict := recruitment.to_dict(
                        provided_languages=provided_languages
                    )
                )
                is not None
            ]
        )

    found_committee: Committee | None = get_committee_by_title(
        committee_name,
    )
    if not found_committee:
        return jsonify([])

    recruitments = (
        CommitteePositionRecruitment.query.filter(
            CommitteePositionRecruitment.start_date <= func.now(),
            CommitteePositionRecruitment.end_date >= func.now(),
        )
        .join(CommitteePosition)
        .filter(CommitteePosition.committee_id == found_committee.committee_id)
        .all()
    )

    recruitment_dicts = [
        recruitment_dict
        for recruitment in recruitments
        if (
            recruitment_dict := recruitment.to_dict(
                provided_languages=provided_languages
            )
        )
        is not None
    ]

    return jsonify(recruitment_dicts)


@public_committee_position_bp.route("/<string:position_title>", methods=["GET"])
def get_committee_position_by_name(position_title: str):
    """Retrieves a committee position by title

    Args:
        position_title (str): Committee position title
    """
    provided_languages = retrieve_languages(request.args)

    return jsonify(
        get_committee_position_by_title(
            provided_languages=provided_languages, title=position_title
        )
    )
