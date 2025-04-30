from http import HTTPStatus
from typing import List
from flask import Blueprint, Response, jsonify, request
from decorators import nextjs_auth_required
from models.apps.rgbank import Statistics
from services.apps.rgbank import (
    get_committee_statistic,
)
from utility import DEFAULT_LANGUAGE_CODE

public_statistics_bp = Blueprint("public_statistics", __name__)


# --- GENERAL STATISTICS --- #


@public_statistics_bp.route("/years", methods=["GET"])
@nextjs_auth_required
def get_years():
    """Get all years with statistics."""
    all_possible_years = (
        Statistics.query.with_entities(Statistics.year)
        .filter(
            Statistics.year.isnot(None),
        )
        .distinct()
        .all()
    )
    all_possible_years = [year[0] for year in all_possible_years]
    return jsonify(all_possible_years), HTTPStatus.OK


# --- COMMITTEE STATISTICS --- #


@public_statistics_bp.route(
    "/committee/<string:committee_id>/year/<int:year>", methods=["GET"]
)
@nextjs_auth_required
def get_committee_statistics_year(committee_id: str, year: int):
    """Get statistics for a committee."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_committee_statistic(
        committee_id=committee_id, year=year, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@public_statistics_bp.route(
    "/committee/<string:committee_id>/year/<int:year>/month/<int:month>",
    methods=["GET"],
)
@nextjs_auth_required
def get_committee_statistics_month(committee_id: str, year: int, month: int):
    """Get statistics for a committee."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_committee_statistic(
        committee_id=committee_id, year=year, month=month, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@public_statistics_bp.route(
    "/committee/<string:committee_id>/all_time", methods=["GET"]
)
@nextjs_auth_required
def get_committee_statistics_all_time(committee_id: str):
    """Get all-time statistics for a committee."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_committee_statistic(
        committee_id=committee_id, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@public_statistics_bp.route("/commitees/year/<int:year>", methods=["GET"])
@nextjs_auth_required
def get_all_committees_year(year: int):
    """Get statistics for all committees."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics: List[Statistics] = Statistics.query.filter(
        Statistics.committee_id.isnot(None),
        Statistics.year == year,
        Statistics.month.is_(None),
    ).all()

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(
        [stat.to_dict(provided_languages=[language]) for stat in statistics]
    ), HTTPStatus.OK


@public_statistics_bp.route(
    "/commitees/year/<int:year>/month/<int:month>", methods=["GET"]
)
@nextjs_auth_required
def get_all_committees_month(year: int, month: int):
    """Get statistics for all committees."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics: List[Statistics] = Statistics.query.filter(
        Statistics.committee_id.isnot(None),
        Statistics.year == year,
        Statistics.month == month,
    ).all()

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(
        [stat.to_dict(provided_languages=[language]) for stat in statistics]
    ), HTTPStatus.OK


@public_statistics_bp.route("/commitees/all_time", methods=["GET"])
@nextjs_auth_required
def get_all_committees_all_time():
    """Get all-time statistics for all committees."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics: List[Statistics] = Statistics.query.filter(
        Statistics.committee_id.isnot(None), Statistics.is_all_time.is_(True)
    ).all()

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(
        [stat.to_dict(provided_languages=[language]) for stat in statistics]
    ), HTTPStatus.OK
