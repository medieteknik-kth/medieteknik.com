"""
Student Routes (Protected)
API Endpoint: '/api/v1/students'
"""

import json
from flask import Blueprint, Response, jsonify, make_response, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    current_user,
    set_access_cookies,
    unset_jwt_cookies,
)
from http import HTTPStatus
from typing import Any
from sqlalchemy import func, or_
from decorators import csrf_protected
from models.committees import Committee, CommitteePosition
from models.core import Profile, Student, StudentMembership
from services.core import login, get_permissions, update
from utility import delete_file, upload_file, retrieve_languages, db

student_bp = Blueprint("student", __name__)


@student_bp.route("/login", methods=["POST"])
@csrf_protected
def student_login() -> Response:
    """
    Logs in a student
        :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 200 if successful
    """

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    provided_languages = retrieve_languages(request.args)

    data: dict[str, Any] = json.loads(json.dumps(data))

    return login(data=data, provided_languages=provided_languages)


@student_bp.route("/", methods=["PUT"])
@csrf_protected
@jwt_required()
def update_student() -> Response:
    """
    Updates a student
        :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 200 if successful
    """

    student_id = get_jwt_identity()
    student: Student | None = Student.query.filter_by(
        student_id=student_id
    ).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED

    return update(
        request=request,
        student=student,
    )


@student_bp.route("/profile", methods=["PUT", "GET"])
@jwt_required()
def update_profile() -> Response:
    """
    Updates the student profile
        :return: Response - The response object, 404 if the profile doesn't exist, 401 if the credentials are invalid, 400 if no data is provided, 201 if created (PUT), 200 if successful (GET)
    """

    student_id = get_jwt_identity()
    student: Student | None = Student.query.filter_by(
        student_id=student_id
    ).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED

    if request.method == "GET":
        profile = Profile.query.filter_by(student_id=student_id).one_or_404()

        return jsonify(profile.to_dict()), HTTPStatus.OK

    data = request.get_json()

    if not data:
        return jsonify({"error": "Invalid data"}), HTTPStatus.BAD_REQUEST

    data_dict: dict[str, Any] = json.loads(json.dumps(data))

    profile = Profile.query.filter_by(student_id=student_id).one_or_none()

    facebook_url = data_dict.get("facebook_url")
    instagram_url = data_dict.get("instagram_url")
    linkedin_url = data_dict.get("linkedin_url")

    if facebook_url and not facebook_url.startswith("https://www.facebook.com/"):
        return jsonify({"error": "Invalid Facebook URL"}), HTTPStatus.BAD_REQUEST
    if instagram_url and not instagram_url.startswith("https://www.instagram.com/"):
        return jsonify({"error": "Invalid Instagram URL"}), HTTPStatus.BAD_REQUEST
    if linkedin_url and not linkedin_url.startswith("https://www.linkedin.com/"):
        return jsonify({"error": "Invalid LinkedIn URL"}), HTTPStatus.BAD_REQUEST

    if not profile or not isinstance(profile, Profile):
        profile = Profile(student_id=student_id, **data_dict)
        db.session.add(profile)
    else:
        for key, value in data_dict.items():
            if not hasattr(profile, key):
                continue
            if value == "" or value is None:
                continue
            setattr(profile, key, value)

    db.session.commit()
    return jsonify(profile.to_dict()), HTTPStatus.CREATED


@student_bp.route("/reception", methods=["PUT"])
@csrf_protected
@jwt_required()
def update_reception() -> Response:
    """
    Updates the student reception profile picture
        :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 201 if successful
    """

    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED

    reception_image = request.files.get("reception_image")
    reception_name = request.form.get("reception_name")

    if not reception_image:
        return jsonify({"error": "Invalid data"}), HTTPStatus.BAD_REQUEST

    file_extension = reception_image.filename.split(".")[-1]

    if getattr(student, "reception_profile_picture_url"):
        delete_file(
            getattr(student, "reception_profile_picture_url"),
        )

    result = upload_file(
        file=reception_image,
        file_name=f"{student.student_id}.{file_extension}",
        path="profile/reception",
    )

    if not result:
        return jsonify({"error": "Failed to upload"}), HTTPStatus.BAD_REQUEST

    setattr(student, "reception_profile_picture_url", result)
    setattr(student, "reception_name", reception_name)

    db.session.commit()

    return jsonify({"url": result}), HTTPStatus.CREATED


@student_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token() -> Response:
    """
    Refreshes the student token
        :return: Response - The response object, 401 if the credentials are invalid, 200 if successful
    """

    student_id = get_jwt_identity()
    student = Student.query.filter_by(student_id=student_id).one_or_none()
    provided_languages = retrieve_languages(request.args)

    if not student:
        return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED

    permissions_and_role = get_permissions(getattr(student, "student_id"))

    committees = []
    committee_positions = []
    student_memberships = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        or_(
            StudentMembership.termination_date == None,  # noqa
            StudentMembership.termination_date > func.now(),
        ),
    ).all()

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
            "role": permissions_and_role.get("role"),
            "permissions": permissions_and_role.get("permissions"),
        }
    )
    access_token = create_access_token(identity=student, fresh=False)
    set_access_cookies(response=response, encoded_access_token=access_token)
    response.status_code = HTTPStatus.OK
    return response


@student_bp.route("/logout", methods=["POST"])
def student_logout() -> Response:
    """
    Logs out a student
        :return: Response - The response object, 200 if successful
    """

    response = make_response()
    unset_jwt_cookies(response)
    response.status_code = HTTPStatus.OK
    return response


@student_bp.route("/permissions", methods=["GET"])
@jwt_required(fresh=True)
def get_student_permissions() -> Response:
    """
    Retrieves the student permissions
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity()
    return jsonify(get_permissions(student_id)), HTTPStatus.OK


@student_bp.route("/me", methods=["GET"])
@jwt_required()
def get_student_callback() -> Response:
    """
    Retrieves the student information
        :return: Response - The response object, 404 if the student doesn't exist, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    student_id = get_jwt_identity()

    student = Student.query.get_or_404(student_id)

    permissions_and_role = get_permissions(getattr(student, "student_id"))

    committees = []
    committee_positions = []
    student_memberships = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        or_(
            StudentMembership.termination_date == None,  # noqa
            StudentMembership.termination_date > func.now(),
        ),
    ).all()

    for membership in student_memberships:
        position = CommitteePosition.query.get_or_404(membership.committee_position_id)

        if not position.committee_id:
            continue

        committee: Committee = Committee.query.get_or_404(position.committee_id)

        committee_dict = committee.to_dict(provided_languages=provided_languages)

        if committee_dict in committees:
            continue

        committees.append(committee_dict)
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
    ), HTTPStatus.OK
