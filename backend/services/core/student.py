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

    permissions_and_role, additional_claims, committees, committee_positions = (
        retrieve_extra_claims(provided_languages, student)
    )

    response = make_response(
        {
            "student": student.to_dict(is_public_route=False),
            "committees": committees,
            "committee_positions": committee_positions,
            "permissions": permissions_and_role.get("permissions"),
            "role": permissions_and_role.get("role"),
        }
    )
    response.status_code = HTTPStatus.OK
    set_access_cookies(
        response=response,
        encoded_access_token=create_access_token(
            identity=student,
            fresh=timedelta(minutes=20),
            additional_claims=additional_claims,
        ),
        max_age=timedelta(hours=1),
    )
    set_refresh_cookies(
        response=response,
        encoded_refresh_token=create_refresh_token(identity=student),
        max_age=timedelta(days=30).seconds,
    )

    return response


def retrieve_extra_claims(
    provided_languages: List[str] = AVAILABLE_LANGUAGES, student: Student | None = None
) -> tuple[Dict[str, Any], Dict[str, Any], List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Retrieves the student's permissions, role, committees, and committee positions, if they exist.
        :param provided_languages: List[str] - The list of languages that the user can view.
        :param student: Student - The student object.
        :return: Tuple[Dict[str, Any], Dict[str, Any], List[Dict[str, Any]], List[Dict[str, Any]]] - The permissions and role, additional claims, committees, and committee positions.
    """
    if student is None:
        return None
    permissions_and_role = get_permissions(getattr(student, "student_id"))
    additional_claims = {
        "role": permissions_and_role.get("role"),
        "permissions": permissions_and_role.get("permissions"),
    }

    committees = []
    committee_positions = []
    student_memberships = StudentMembership.query.filter_by(
        student_id=student.student_id
    ).all()

    for membership in student_memberships:
        position: CommitteePosition = CommitteePosition.query.get(
            membership.committee_position_id
        )

        if not position:
            continue

        committee_positions.append(
            position.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )

        committee: Committee = Committee.query.get(position.committee_id)

        if not committee:
            continue

        committee_dict = committee.to_dict(provided_languages=provided_languages)

        # Check if the committee already exists in the list
        if committee_dict in committees:
            continue

        committees.append(committee_dict)

    return permissions_and_role, additional_claims, committees, committee_positions


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


def get_permissions(student_id: str) -> Dict[str, Any]:
    """
    Gets the student's permissions and role.
        :param student_id: str - The student's ID.
        :return: Dict[str, Any] - The student's permissions and role.
    """
    all_permissions_and_role = {
        "role": None,
        "permissions": {},
    }

    author = Author.query.filter(
        Author.author_type == AuthorType.STUDENT.value,
        Author.student_id == student_id,
    ).first()

    if author and isinstance(author, Author):
        author_data = author.to_dict()
        if author_data:
            all_permissions_and_role["permissions"]["author"] = author_data.get(
                "resources"
            )

    student = Student.query.get(student_id)

    if student and isinstance(student, Student):
        permissions = StudentPermission.query.filter_by(student_id=student_id).first()

        if permissions and isinstance(permissions, StudentPermission):
            permission_data = permissions.to_dict()

            if permission_data:
                all_permissions_and_role["role"] = permission_data.get("role")
                all_permissions_and_role["permissions"]["student"] = (
                    permission_data.get("permissions")
                )

    return all_permissions_and_role
