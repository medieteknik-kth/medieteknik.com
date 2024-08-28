"""
Committee Position Routes
API Endpoint: '/api/v1/committee_positions'
"""

from http import HTTPStatus
import json
from typing import Any, Dict, List
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from models.committees.committee_position import (
    CommitteePosition,
    CommitteePositionCategory,
    CommitteePositionRecruitment,
    CommitteePositionRecruitmentTranslation,
    CommitteePositionTranslation,
    CommitteePositionsRole,
)
from models.core.student import Student, StudentMembership
from services.committees.public.committee import get_committee_by_title
from utility.database import db
from utility.constants import AVAILABLE_LANGUAGES
from utility.translation import convert_iso_639_1_to_bcp_47


committee_position_bp = Blueprint("committee_position", __name__)


@committee_position_bp.route("/", methods=["POST"])
@jwt_required()
def create_committee_position():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON provided"}), 400

    data: Dict[str, Any] = json.loads(json.dumps(data))

    email = data.get("email")
    category: CommitteePositionCategory = data.get("category")
    weight = data.get("weight")
    translations: List[Dict[str, Any]] = data.get("translations")
    committee_title = data.get("committee_title")

    if not category or not weight or not translations or not committee_title:
        return jsonify({"error": "No data provided"}), 400

    committee = get_committee_by_title(committee_title)

    if not committee:
        return jsonify({"error": "Committee not found"}), 404

    new_position = CommitteePosition(
        email=email if email else None,
        category=category,
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
            return jsonify({"error": "No translation data provided"}), 400

        if language_code not in AVAILABLE_LANGUAGES:
            return jsonify({"error": "Language code not supported"}), 400

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
def assign_student_to_committee_position():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No JSON provided"}), 400

    data: Dict[str, Any] = json.loads(json.dumps(data))

    students: List[Dict[str, Any]] = data.get("students")

    if not students:
        return jsonify({"error": "No data provided"}), 400

    for student in students:
        student_email = student.get("student_email")

        if not student_email:
            return jsonify({"error": "No student id provided"}), 400

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
                ), 404
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
def soft_delete_committee_position(committee_position_id):
    committee_position: CommitteePosition | None = CommitteePosition.query.filter_by(
        committee_position_id=committee_position_id
    ).one_or_none()

    if not committee_position or not isinstance(committee_position, CommitteePosition):
        return jsonify({"error": "Committee position not found"}), 404

    if committee_position.base:
        return jsonify({"error": "Cannot delete base committee position"}), 400

    setattr(committee_position, "active", False)

    db.session.commit()

    return jsonify({}), HTTPStatus.OK


@committee_position_bp.route(
    "/<string:committee_position_id>/recruit", methods=["POST"]
)
@jwt_required()
def recruit_for_position(committee_position_id):
    committee_position = CommitteePosition.query.filter_by(
        committee_position_id=committee_position_id
    ).one_or_none()

    if not committee_position:
        return jsonify({"error": "Committee position not found"}), 404

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: Dict[str, Any] = json.loads(json.dumps(data))

    start_date = data.get("start_date")
    end_date = data.get("end_date")
    translations: List[Dict[str, Any]] = data.get("translations")

    if not start_date or not end_date or not translations:
        return jsonify({"error": "No data provided"}), 400

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
            return jsonify({"error": "No translation data provided"}), 400

        if language_code not in AVAILABLE_LANGUAGES:
            return jsonify({"error": "Language code not supported"}), 400

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
