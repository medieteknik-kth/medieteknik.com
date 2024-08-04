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
from typing import Any, Dict
from models.content.author import Author, AuthorType
from models.core.permissions import StudentPermission
from models.core.student import Student
from utility.database import db
from utility.gc import delete_file, upload_file


def login(data: Dict[str, Any]):
    """
    Login function that validates the user's credentials and generates an access token.

    Args:
        data (Dict[str, Any]): A dictionary containing user data with "email" and "password" keys.

    Returns:
        dict: A dictionary containing the "access_token" if the login is successful, otherwise None.

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
        ), 401

    if not check_password_hash(getattr(student, "password_hash"), password):
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        ), 401

    permissions_and_role = get_permissions(getattr(student, "student_id"))
    additional_claims = {
        "role": permissions_and_role.get("role"),
        "permissions": permissions_and_role.get("permissions"),
    }

    response = make_response(student.to_dict(is_public_route=False))
    response.status_code = 200
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


def change_password(data: Dict[str, Any]):
    """ """

    email = data.get("email")
    password = data.get("password")

    if email is None or password is None:
        return None

    student = Student.query.filter_by(email=email).first()

    if student is None:
        return None

    if not check_password_hash(student.password_hash, password):
        return None

    setattr(student, "password_hash", generate_password_hash(password))

    db.session.commit()

    return True


def assign_password(data: Dict[str, Any]):
    """ """

    email = data.get("email")
    password = data.get("password")

    if email is None or password is None:
        return None

    student = Student.query.filter_by(email=email).first()

    if student is None:
        return None

    setattr(student, "password_hash", generate_password_hash(password))

    db.session.commit()

    return True


def update(request: Request, student: Student) -> Response:
    """
    Updates the student's profile picture and password.

    Args:
        request (Request): The request object.
        student (Student): The student object.

    Returns:
        response (Response): The response object.

    """

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
            file_name=f"{student.student_id}.{file_extension}",
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


def get_permissions(student_id: str) -> Dict[str, Any]:
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


def get_student(token: str):
    if token == "" or token is None:
        return None

    return Student.query.filter_by(student_id=token).first()
