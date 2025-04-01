"""
Student Routes (Protected)
API Endpoint: '/api/v1/students'
"""

import json
from flask import Blueprint, Response, jsonify, make_response, request
from flask_jwt_extended import (
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from http import HTTPStatus
from typing import Any, Dict
from decorators import csrf_protected
from models.core import Profile, Student
from services.core import update, retrieve_notifications, subscribe_to_notifications
from services.utility.auth import (
    get_student_authorization,
    get_student_committee_details,
)
from utility import delete_file, upload_file, retrieve_languages, db
from utility.translation import convert_iso_639_1_to_bcp_47

student_bp = Blueprint("student", __name__)


@student_bp.route("", methods=["PUT"])
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

    if (
        not reception_image and not reception_name
    ):  # At least one of the fields is empty
        return jsonify(
            {"error": "At least one field must be specified"}
        ), HTTPStatus.BAD_REQUEST

    if reception_image:
        file_extension = reception_image.filename.split(".")[-1]

        if getattr(student, "reception_profile_picture_url"):
            delete_file(
                getattr(student, "reception_profile_picture_url"),
            )

        result = upload_file(
            file=reception_image,
            file_name=f"{student.student_id}.{file_extension}",
            content_type=f"image/{file_extension if file_extension != 'jpg' else 'jpeg'}",
            timedelta=None,
            path="profile/reception",
        )

        if not result:
            return jsonify({"error": "Failed to upload"}), HTTPStatus.BAD_REQUEST

        setattr(student, "reception_profile_picture_url", result)

    if reception_name:
        setattr(student, "reception_name", reception_name)

    db.session.commit()

    return jsonify({"message": "Updated"}), HTTPStatus.CREATED


@student_bp.route("/permissions", methods=["GET"])
@jwt_required(fresh=True)
def get_student_permissions() -> Response:
    """
    Retrieves the student permissions
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity()
    student: Student = Student.query.get_or_404(student_id)
    permissions, role = get_student_authorization(student)
    return jsonify(
        {
            "permissions": permissions,
            "role": role,
        }
    ), HTTPStatus.OK


@student_bp.route("/me", methods=["GET"])
@jwt_required(optional=True)
def get_student_callback() -> Response:
    """
    Retrieves the student information
        :return: Response - The response object, 404 if the student doesn't exist, 200 if successful
    """

    def unauthorized_response():
        access_cookie = request.cookies.get("access_token_cookie")
        response = make_response({"message": "Unauthorized"})

        if access_cookie:
            response.set_cookie(
                "access_token_cookie",
                value="",
                expires=0,
                httponly=True,
                secure=True,
                samesite="None",
            )

        response.status_code = HTTPStatus.UNAUTHORIZED
        return response

    provided_languages = retrieve_languages(request.args)

    student_id: str | None = get_jwt_identity()
    jwt = get_jwt()

    if not student_id or not jwt:
        return jsonify({"message": "Unauthorized"}), HTTPStatus.UNAUTHORIZED

    expiration = jwt["exp"]

    student: Student = Student.query.get_or_404(student_id)

    permissions, role = get_student_authorization(student)

    committees, committee_positions = get_student_committee_details(
        provided_languages=provided_languages, student=student
    )

    student_dict = student.to_dict(is_public_route=False)

    json_response = jsonify(
        {
            "student": student_dict,
            "committees": committees,
            "committee_positions": committee_positions,
            "permissions": permissions,
            "role": role,
            "expiration": expiration,
        },
    )

    return json_response, HTTPStatus.OK


@student_bp.route("/notifications", methods=["GET", "POST"])
@jwt_required()
def update_notifications() -> Response:
    """
    Updates the student notifications
        :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 200 if successful
    """

    language = request.args.get("language", "en")
    language = convert_iso_639_1_to_bcp_47(language)

    student_id = get_jwt_identity()
    student: Student | None = Student.query.filter_by(
        student_id=student_id
    ).one_or_none()

    if not student or not isinstance(student, Student):
        return jsonify({"error": "Invalid credentials"}), HTTPStatus.UNAUTHORIZED

    if request.method == "GET":
        return retrieve_notifications(student_id, language)
    else:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid data"}), HTTPStatus.BAD_REQUEST

        data_dict: Dict[str, Any] = json.loads(json.dumps(data))

        return subscribe_to_notifications(
            data_dict=data_dict,
            student_id=student_id,
            language=language,
        )
