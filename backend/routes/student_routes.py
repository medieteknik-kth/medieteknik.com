import json
from typing import Any
from flask import Blueprint, jsonify, make_response, request
from flask_jwt_extended import jwt_required, current_user
from services.content.student import login, assign_password

student_bp = Blueprint("student", __name__)


@student_bp.route("/login", methods=["POST"])
def student_login():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    data: dict[str, Any] = json.loads(json.dumps(data))

    return login(data)


@student_bp.route("/logout", methods=["POST"])
def student_logout():
    response = make_response(jsonify({}), 200)
    response.headers["Set-Cookie"] = (
        "access_token_cookie=; HttpOnly; SameSite=Strict; Max-Age=0; Domain=localhost; Path=/api/v1/;"
    )
    return response


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
@jwt_required()
def get_student_callback():
    return jsonify(current_user.to_dict(False)), 200
