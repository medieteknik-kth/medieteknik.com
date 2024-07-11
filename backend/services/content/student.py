from datetime import timedelta
from flask import Response, jsonify, make_response, request, session
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, set_access_cookies
from typing import Any, Dict
from models.core.student import Student
from utility.csrf import validate_csrf
from utility.database import db


def login(data: Dict[str, Any]):
    """
    Login function that validates the user's credentials and generates an access token.

        Parameters:
            data (Dict[str, Any]): A dictionary containing user data with "email" and "password" keys.
        Returns:
            dict: A dictionary containing the "access_token" if the login is successful, otherwise None.

    """
    email = data.get("email")
    password = data.get("password")
    csrf_token = data.get("csrf_token")

    validate_csrf(csrf_token)

    if email is None or password is None:
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        )

    student = Student.query.filter_by(email=email).first()

    if student is None:
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        ), 401

    if not check_password_hash(student.password_hash, password):
        return jsonify(
            {
                "message": "Invalid credentials",
            }
        ), 401
    response = make_response({"message": "Login successful"})
    response.status_code = 200
    set_access_cookies(
        response, create_access_token(identity=student), max_age=timedelta(hours=1)
    )

    return response


def change_password(data: Dict):
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


def assign_password(data: Dict):
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


def get_student(token: str):
    if token is None:
        return None

    return Student.query.filter_by(student_id=token).first()
