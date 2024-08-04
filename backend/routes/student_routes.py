from datetime import timedelta
from http import HTTPStatus
import json
from typing import Any
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    current_user,
    set_access_cookies,
    set_refresh_cookies,
    unset_jwt_cookies,
)
from decorators import csrf
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.student import Student, StudentMembership
from services.core.student import login, assign_password, get_permissions
from utility.gc import delete_file, upload_file
from utility.translation import retrieve_languages
from werkzeug.security import check_password_hash
from utility.database import db

student_bp = Blueprint("student", __name__)


@student_bp.route("/login", methods=["POST"])
@csrf
def student_login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: dict[str, Any] = json.loads(json.dumps(data))

    return login(data)


@student_bp.route("/", methods=["PUT"])
@csrf
@jwt_required(refresh=True)
def update_student():
    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), 401

    profile_picture = request.files.get("profile_picture")
    currentPassword = request.form.get("current_password")
    newPassword = request.form.get("new_password")

    if not currentPassword:
        return jsonify({"error": "No current password provided"}), 400

    if not check_password_hash(getattr(student, "password_hash"), currentPassword):
        return jsonify({"error": "Invalid current password"}), 400

    file_extension = profile_picture.filename.split(".")[-1]

    if profile_picture:
        # Delete previous image if it exists
        if getattr(student, "profile_picture_url"):
            delete_file(
                getattr(student, "profile_picture_url"),
            )

        result = upload_file(
            file=profile_picture,
            file_name=f"{student_id}.{file_extension}",
            path="profile",
        )

        setattr(student, "profile_picture_url", result)

    if newPassword:
        result = assign_password({"email": student.email, "password": newPassword})
        if not result:
            return jsonify({"error": "Failed to update password"}), 500

    db.session.commit()
    response = make_response()
    permissions_and_role = get_permissions(getattr(student, "student_id"))
    additional_claims = {
        "role": permissions_and_role.get("role"),
        "permissions": permissions_and_role.get("permissions"),
    }
    access_token = create_access_token(
        identity=student, fresh=True, additional_claims=additional_claims
    )
    refresh_token = create_refresh_token(
        identity=student, expires_delta=timedelta(days=30)
    )
    set_access_cookies(
        response=response, encoded_access_token=access_token, max_age=timedelta(hours=1)
    )

    set_refresh_cookies(response=response, encoded_refresh_token=refresh_token)

    response.status_code = HTTPStatus.OK
    return response


@student_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token():
    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()

    if not student:
        return jsonify({"error": "Invalid credentials"}), 401

    response = make_response()
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


# TODO: Remove Later?
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
@jwt_required(fresh=True)
def get_student_callback():
    language_code = retrieve_languages(request.args)
    student_id = get_jwt_identity()

    student = Student.query.get(student_id)

    if not student or not isinstance(student, Student):
        return jsonify({}), 404

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

        committees.append(committee.to_dict(provided_languages=language_code))
        committee_positions.append(
            position.to_dict(provided_languages=language_code, is_public_route=False)
        )

    return jsonify(
        {
            "student": current_user.to_dict(False),
            "role": role,
            "permissions": permissions,
            "committees": committees,
            "positions": committee_positions,
        }
    ), 200
