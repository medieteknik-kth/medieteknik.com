"""
Student Routes (Protected)
API Endpoint: '/api/v1/students'
"""

import json
from http import HTTPStatus
from typing import Any
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    current_user,
    set_access_cookies,
    unset_jwt_cookies,
)
from decorators import csrf_protected
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.student import Student, StudentMembership
from services.core.student import login, assign_password, get_permissions, update
from utility.translation import retrieve_languages

student_bp = Blueprint("student", __name__)


@student_bp.route("/login", methods=["POST"])
@csrf_protected
def student_login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    provided_languages = retrieve_languages(request.args)

    data: dict[str, Any] = json.loads(json.dumps(data))

    return login(data=data, provided_languages=provided_languages)


@student_bp.route("/", methods=["PUT"])
@csrf_protected
@jwt_required(refresh=True)
def update_student():
    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), 401

    return update(
        request=request,
        student=student,
    )


@student_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()
    provided_languages = retrieve_languages(request.args)

    if not student:
        return jsonify({"error": "Invalid credentials"}), 401

    claims = get_jwt()
    role = claims.get("role")
    permissions = claims.get("permissions")

    committees = []
    committee_positions = []
    student_memberships = StudentMembership.query.filter_by(student_id=student_id).all()

    for membership in student_memberships:
        position = CommitteePosition.query.get(membership.committee_position_id)
        if not position or not isinstance(position, CommitteePosition):
            continue

        committee = Committee.query.get(position.committee_id)
        if not committee or not isinstance(committee, Committee):
            continue

        committees.append(committee.to_dict(provided_languages=provided_languages))
        committee_positions.append(
            position.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )

    response = make_response(
        {
            "student": student.to_dict(is_public_route=False),
            "committees": committees,
            "committee_positions": committee_positions,
            "role": role,
            "permissions": permissions,
        }
    )
    access_token = create_access_token(identity=student, fresh=False)
    set_access_cookies(response=response, encoded_access_token=access_token)
    response.status_code = HTTPStatus.OK
    return response


@student_bp.route("/logout", methods=["POST"])
def student_logout():
    response = make_response()
    unset_jwt_cookies(response)
    response.status_code = HTTPStatus.OK
    return response


@student_bp.route("/permissions", methods=["GET"])
@jwt_required(fresh=True)
def get_student_permissions():
    student_id = get_jwt_identity()
    return get_permissions(student_id)


# TODO: Remove Later
@student_bp.route(rule="/reset", methods=["POST"])
def reset_password():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: dict[str, Any] = json.loads(json.dumps(data))

    result = assign_password(data)

    if result is None:
        return jsonify({"error": "Invalid credentials"}), 401

    return jsonify(result), 200


@student_bp.route("/me", methods=["GET"])
@jwt_required()
def get_student_callback():
    provided_languages = retrieve_languages(request.args)
    student_id = get_jwt_identity()

    student = Student.query.get(student_id)

    if not student or not isinstance(student, Student):
        return jsonify({}), 404

    permissions_and_role = get_permissions(getattr(student, "student_id"))

    committees = []
    committee_positions = []
    student_memberships = StudentMembership.query.filter_by(student_id=student_id).all()

    for membership in student_memberships:
        position = CommitteePosition.query.get(membership.committee_position_id)
        if not position or not isinstance(position, CommitteePosition):
            continue

        committee = Committee.query.get(position.committee_id)
        if not committee or not isinstance(committee, Committee):
            continue

        committees.append(committee.to_dict(provided_languages=provided_languages))
        committee_positions.append(
            position.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )

    return jsonify(
        {
            "student": current_user.to_dict(is_public_route=False),
            "role": permissions_and_role.get("role"),
            "permissions": permissions_and_role.get("permissions"),
            "committees": committees,
            "positions": committee_positions,
        }
    ), 200
