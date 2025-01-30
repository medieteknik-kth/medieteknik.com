"""
Student service that handles the student's login, permissions, and role.
"""

from datetime import timedelta
from http import HTTPStatus
from flask import Request, Response, jsonify, make_response
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token,
    set_refresh_cookies,
)
from typing import Any, Dict, List
from models.committees import Committee
from models.committees import CommitteePosition
from models.core import Author, AuthorType
from models.core import StudentPermission
from models.core import Student, StudentMembership
from models.core import Student
from services.utility.auth import (
    get_student_authorization,
    get_student_committee_details,
)
from utility.constants import AVAILABLE_LANGUAGES
from utility.database import db
from utility.gc import delete_file, upload_file


def login(
    data: Dict[str, Any], provided_languages: List[str] = AVAILABLE_LANGUAGES
) -> Response:
    """
    Login function that validates the user's credentials and generates an access token.
        :param data: Dict[str, Any] - The data containing the user's email and password.
        :param provided_languages: List[str] - The list of languages that the user can view.
        :return: Response - The response object containing the user's data and the access token.

    """
    email = data.get("email")
    password = data.get("password")

    if email is None or password is None:
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        )

    student = Student.query.filter_by(email=email).first()

    if student is None or not isinstance(student, Student):
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        ), HTTPStatus.UNAUTHORIZED

    if not check_password_hash(getattr(student, "password_hash"), password):
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        ), HTTPStatus.UNAUTHORIZED

    permissions, role = get_student_authorization(student)
    committees, committee_positions = get_student_committee_details(
        provided_languages=provided_languages, student=student
    )

    response = make_response(
        {
            "student": student.to_dict(is_public_route=False),
            "committees": committees,
            "committee_positions": committee_positions,
            "permissions": permissions,
            "role": role,
        }
    )
    response.status_code = HTTPStatus.OK
    set_access_cookies(
        response=response,
        encoded_access_token=create_access_token(
            identity=student,
            fresh=timedelta(minutes=20),
            additional_claims={
                "permissions": permissions,
                "role": role,
            },
        ),
        max_age=timedelta(hours=1),
    )
    set_refresh_cookies(
        response=response,
        encoded_refresh_token=create_refresh_token(identity=student),
        max_age=timedelta(days=30).seconds,
    )

    return response


def assign_password(data: Dict[str, Any]) -> bool:
    """
    Assigns a new password to the student.
        :param data: Dict[str, Any] - The data containing the student's email and password.
        :return: bool - True if the password was successfully updated, False otherwise.
    """

    email = data.get("email")
    password = data.get("password")

    if email is None or password is None:
        return False

    student = Student.query.filter_by(email=email).first()

    if student is None:
        return False

    setattr(student, "password_hash", generate_password_hash(password))

    db.session.commit()

    return True


def update(request: Request, student: Student) -> Response:
    """
    Updates the student's data, which includes the profile picture and password.
        :param request: Request - The request object.
        :param student: Student - The student object.
        :return: Response - The response object containing the updated student's data.

    """

    profile_picture = request.files.get("profile_picture")
    currentPassword = request.form.get("current_password")
    newPassword = request.form.get("new_password")

    if not profile_picture and not currentPassword and not newPassword:
        return jsonify(
            {"error": "At least one field is required"}
        ), HTTPStatus.BAD_REQUEST

    if newPassword:
        if not currentPassword:
            return jsonify(
                {"error": "Current password is required to change passwords"}
            ), HTTPStatus.BAD_REQUEST

    file_extension = profile_picture.filename.split(".")[-1]

    if profile_picture:
        # Delete previous image if it exists
        if getattr(student, "profile_picture_url"):
            delete_file(
                getattr(student, "profile_picture_url"),
            )

        file_content = profile_picture.read()

        if len(file_content) > 5 * 1024 * 1024:
            return jsonify({"error": "File size is too large"}), HTTPStatus.BAD_REQUEST

        profile_picture.seek(0)

        result = upload_file(
            file=profile_picture,
            file_name=f"{student.student_id}.{file_extension}",
            content_type=f"image/{file_extension if file_extension != 'jpg' else 'jpeg'}",
            timedelta=None,
            path="profile",
        )

        setattr(student, "profile_picture_url", result)

    if newPassword:
        if not currentPassword:
            return jsonify(
                {"error": "Current password is required"}
            ), HTTPStatus.BAD_REQUEST

        if not check_password_hash(getattr(student, "password_hash"), currentPassword):
            return jsonify(
                {"error": "Invalid current password"}
            ), HTTPStatus.BAD_REQUEST

        result = assign_password({"email": student.email, "password": newPassword})
        if not result:
            return jsonify(
                {"error": "Failed to update password"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

    db.session.commit()
    response = make_response()
    permissions, role = get_student_authorization(student)
    additional_claims = {
        "permissions": permissions,
        "role": role,
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
