from http import HTTPStatus
from typing import Any, Dict, List
from flask import Blueprint, Response, jsonify, request
from decorators import nextjs_auth_required
from models.apps.rgbank import Statistics
from services.apps.rgbank import (
    get_student_statistic,
    get_committee_statistic,
    get_top_students,
    get_monthly_value_by_year,
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


# --- STUDENT STATISTICS --- #


@public_statistics_bp.route(
    "/student/<string:student_id>/year/<int:year>", methods=["GET"]
)
@nextjs_auth_required
def get_student_statistics_year(student_id: str, year: int):
    """Get statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_student_statistic(
        student_id, year=year, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@public_statistics_bp.route(
    "/student/<string:student_id>/year/<int:year>/month/<int:month>", methods=["GET"]
)
@nextjs_auth_required
def get_student_statistics_month(student_id: str, year: int, month: int):
    """Get statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_student_statistic(
        student_id=student_id, year=year, month=month, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@public_statistics_bp.route("/student/<string:student_id>/all_time", methods=["GET"])
@nextjs_auth_required
def get_student_statistics_all_time(student_id: str):
    """Get all-time statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics = get_student_statistic(
        student_id=student_id, provided_languages=[language]
    )

    if statistics is None:
        return {"message": "Statistics not found"}, 404

    return statistics


# --- TOP STUDENTS --- #


@public_statistics_bp.route("/students/top/year/<int:year>", methods=["GET"])
@nextjs_auth_required
def get_top_students_year(year: int):
    """Get statistics for all students."""

    top_students = get_top_students(year=year)

    if not top_students:
        return Response(status=HTTPStatus.NO_CONTENT)

    return top_students


@public_statistics_bp.route("/students/year/<int:year>", methods=["GET"])
@nextjs_auth_required
def get_students_year(year: int):
    """Get statistics for all students."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics: List[Statistics] = Statistics.query.filter(
        Statistics.student_id.isnot(None),
        Statistics.year == year,
        Statistics.month.is_(None),
    ).all()

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(
        [stat.to_dict(provided_languages=[language]) for stat in statistics]
    ), HTTPStatus.OK


@public_statistics_bp.route(
    "/students/top/year/<int:year>/month/<int:month>", methods=["GET"]
)
@nextjs_auth_required
def get_top_students_month(year: int, month: int):
    """Get statistics for all students."""
    top_students = get_top_students(year=year, month=month)

    if not top_students:
        return Response(status=HTTPStatus.NO_CONTENT)

    return top_students


@public_statistics_bp.route(
    "/students/year/<int:year>/month/<int:month>", methods=["GET"]
)
@nextjs_auth_required
def get_students_month(year: int, month: int):
    """Get statistics for all students."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    statistics: List[Statistics] = Statistics.query.filter(
        Statistics.student_id.isnot(None),
        Statistics.year == year,
        Statistics.month == month,
    ).all()

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(
        [stat.to_dict(provided_languages=[language]) for stat in statistics]
    ), HTTPStatus.OK


@public_statistics_bp.route("/students/top/all_time", methods=["GET"])
@nextjs_auth_required
def get_top_students_all_time():
    """Get all-time statistics for all students."""
    top_students = get_top_students()

    if not top_students:
        return Response(status=HTTPStatus.NO_CONTENT)

    return top_students


@public_statistics_bp.route("/students/over_time/year/<int:year>", methods=["GET"])
@nextjs_auth_required
def get_students_over_time(year: int):
    """Get all-time statistics for all students."""
    # Get each student's statistics for every month in the given year
    statistics: List[Dict[str, Any]] | None = get_monthly_value_by_year(year=year)

    if not statistics:
        return Response(status=HTTPStatus.NO_CONTENT)

    return jsonify(statistics), HTTPStatus.OK


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
