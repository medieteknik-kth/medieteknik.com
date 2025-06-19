from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from services.apps.rgbank import (
    get_student_statistic,
)
from utility import DEFAULT_LANGUAGE_CODE

statistics_bp = Blueprint("statistics", __name__)


@statistics_bp.route("/year/<int:year>", methods=["GET"])
@jwt_required()
def get_student_statistics_year(year: int):
    """Get statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    student_id = get_jwt_identity()

    statistics = get_student_statistic(
        student_id=student_id, year=year, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@statistics_bp.route("/year/<int:year>/month/<int:month>", methods=["GET"])
@jwt_required()
def get_student_statistics_month(year: int, month: int):
    """Get statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    student_id = get_jwt_identity()

    statistics = get_student_statistic(
        student_id=student_id, year=year, month=month, provided_languages=[language]
    )

    if statistics is None:
        return jsonify({"message": "Statistics not found"}), HTTPStatus.NOT_FOUND

    return statistics


@statistics_bp.route("/all_time", methods=["GET"])
@jwt_required()
def get_student_statistics_all_time():
    """Get all-time statistics for a student."""
    language = request.args.get("language", type=str, default=DEFAULT_LANGUAGE_CODE)

    student_id = get_jwt_identity()

    statistics = get_student_statistic(
        student_id=student_id, provided_languages=[language]
    )

    if statistics is None:
        return {"message": "Statistics not found"}, 404

    return statistics
