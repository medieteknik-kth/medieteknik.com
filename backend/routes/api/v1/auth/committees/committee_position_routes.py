"""
Committee Position Routes
API Endpoint: '/api/v1/committee_positions'
"""

import json
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt, get_jwt_identity, jwt_required
from http import HTTPStatus
from sqlalchemy import func
from typing import Any, Dict, List
from models.committees import (
    CommitteePosition,
    CommitteePositionRecruitment,
    CommitteePositionRecruitmentTranslation,
    CommitteePositionTranslation,
    CommitteePositionsRole,
)
from models.core import Student, StudentMembership
from services.committees.public import get_committee_by_title
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import convert_iso_639_1_to_bcp_47


committee_position_bp = Blueprint("committee_position", __name__)


@committee_position_bp.route("/", methods=["POST"])
@jwt_required()
def create_committee_position() -> Response:
    """
    Creates a new committee position
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON provided"}), HTTPStatus.BAD_REQUEST

    data: Dict[str, Any] = json.loads(json.dumps(data))

    email = data.get("email")
    category: str = data.get("category")
    weight = data.get("weight")
    translations: List[Dict[str, Any]] = data.get("translations")
    committee_title = data.get("committee_title")

    if not category or not weight or not translations or not committee_title:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    committee = get_committee_by_title(committee_title)

    if not committee:
        return jsonify({"error": "Committee not found"}), HTTPStatus.NOT_FOUND

    new_position = CommitteePosition(
        email=email if email else None,
        category=None if category == "NONE" else category.replace(" ", "_").upper(),
        weight=weight,
        active=True,
        role=CommitteePositionsRole.COMMITTEE.value,
        committee_id=committee.committee_id,
    )

    db.session.add(new_position)

    db.session.flush()

    for translation in translations:
        title = translation.get("title")
        description = translation.get("description")
        language_code = convert_iso_639_1_to_bcp_47(translation.get("language_code"))

        if not title or not description or not language_code:
            return jsonify(
                {"error": "No translation data provided"}
            ), HTTPStatus.BAD_REQUEST

        if language_code not in AVAILABLE_LANGUAGES:
            return jsonify(
                {"error": "Language code not supported"}
            ), HTTPStatus.BAD_REQUEST

        db.session.add(
            CommitteePositionTranslation(
                title=title,
                description=description,
                language_code=language_code,
                committee_position_id=new_position.committee_position_id,
            )
        )

    db.session.commit()

    return jsonify(
        {"committee_position_id": new_position.committee_position_id}
    ), HTTPStatus.CREATED


@committee_position_bp.route("/assign", methods=["POST", "DELETE"])
@jwt_required()
def assign_student_to_committee_position() -> Response:
    """
    Assigns a student to a committee position
        :return: Response - The response object, 400 if no data is provided, 404 if the student or committee position is not found, 200 if successful
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON provided"}), HTTPStatus.BAD_REQUEST

    data: Dict[str, Any] = json.loads(json.dumps(data))

    students: List[Dict[str, Any]] = data.get("students")

    if not students:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    for student in students:
        student_email = student.get("student_email")

        if not student_email:
            return jsonify({"error": "No student id provided"}), HTTPStatus.BAD_REQUEST

        student = Student.query.filter_by(email=student_email).one_or_404()

        if request.method == "DELETE":
            membership = StudentMembership.query.filter_by(
                student_id=student.student_id,
            ).one_or_none()

            if membership:
                setattr(membership, "termination_date", func.now())
        else:
            committee_position_id = data.get("position_id")
            committee_position = CommitteePosition.query.filter_by(
                committee_position_id=committee_position_id
            ).one_or_none()

            if not committee_position:
                return jsonify(
                    {"error": "Student or committee position not found"}
                ), HTTPStatus.NOT_FOUND
            membership = StudentMembership(
                student_id=student.student_id,
                committee_position_id=committee_position.committee_position_id,
                initiation_date=func.now(),
            )
            db.session.add(membership)

    db.session.commit()

    return jsonify({}), HTTPStatus.OK


@committee_position_bp.route("/<string:committee_position_id>", methods=["DELETE"])
@jwt_required()
def soft_delete_committee_position(committee_position_id) -> Response:
    """
    Soft deletes a committee position.
        :param committee_position_id: str - The committee position id
        :return: Response - The response object, 404 if the committee position is not found, 400 if the committee position is a base position, 200 if successful
    """

    committee_position: CommitteePosition | None = CommitteePosition.query.filter_by(
        committee_position_id=committee_position_id
    ).one_or_404(description="Committee position not found")

    if committee_position.base:
        return jsonify(
            {"error": "Cannot delete base committee position"}
        ), HTTPStatus.BAD_REQUEST

    setattr(committee_position, "active", False)

    db.session.commit()

    return jsonify({}), HTTPStatus.OK


@committee_position_bp.route(
    "/<string:committee_position_id>/recruit", methods=["POST", "DELETE"]
)
@jwt_required()
def recruit_for_position(committee_position_id) -> Response:
    """
    Recruits for a committee position, both creating and deleting recruitment
        :param committee_position_id: str - The committee position id
        :return: Response - The response object, 403 if the student is not part of the committee, 400 if no data is provided, 404 if the committee position is not found, 200 if successful
    """

    committee_position = CommitteePosition.query.filter_by(
        committee_position_id=committee_position_id
    ).first_or_404()
    student_id = get_jwt_identity()
    claims = get_jwt()
    is_admin = claims.get("role") == "ADMIN"
    student_membership: List[StudentMembership] = StudentMembership.query.filter_by(
        student_id=student_id,
    ).all()

    for membership in student_membership:
        if (
            membership.committee_position.committee_id
            == committee_position.committee_id
            or is_admin
        ):
            break
        else:
            return jsonify(
                {"error": "Student not part of committee"}
            ), HTTPStatus.FORBIDDEN

    if request.method == "DELETE":
        recruitment: CommitteePositionRecruitment = (
            CommitteePositionRecruitment.query.filter_by(
                committee_position_id=committee_position.committee_position_id
            ).first_or_404()
        )

        recruitment.end_date = func.now()
        db.session.commit()

        return jsonify({}), HTTPStatus.OK

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    data: Dict[str, Any] = json.loads(json.dumps(data))

    start_date = data.get("start_date")
    end_date = data.get("end_date")
    translations: List[Dict[str, Any]] = data.get("translations")

    if not start_date or not end_date or not translations:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    recruitment = CommitteePositionRecruitment(
        start_date=start_date,
        end_date=end_date,
        committee_position_id=committee_position.committee_position_id,
    )

    db.session.add(recruitment)
    db.session.flush()

    for translation in translations:
        link_url = translation.get("link")
        description = translation.get("description")
        language_code = convert_iso_639_1_to_bcp_47(translation.get("language_code"))

        if not link_url or not description or not language_code:
            return jsonify(
                {"error": "No translation data provided"}
            ), HTTPStatus.BAD_REQUEST

        if language_code not in AVAILABLE_LANGUAGES:
            return jsonify(
                {"error": "Language code not supported"}
            ), HTTPStatus.BAD_REQUEST

        db.session.add(
            CommitteePositionRecruitmentTranslation(
                link_url=link_url,
                description=description,
                language_code=language_code,
                committee_position_recruitment_id=recruitment.committee_position_recruitment_id,
            )
        )

    db.session.commit()

    return jsonify(
        {"committee_position_id": committee_position.committee_position_id}
    ), HTTPStatus.OK
