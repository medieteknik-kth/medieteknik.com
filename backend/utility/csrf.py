from http import HTTPStatus
from flask import jsonify, request, session
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()


def validate_csrf(csrf_token):
    header_csrf_token = request.headers.get("X-CSRF-Token")
    session_csrf_token = session.get("csrf_token")

    if not session_csrf_token:
        return jsonify(
            {"message": "Session CSRF Token Missing"}
        ), HTTPStatus.BAD_REQUEST

    if not csrf_token or not header_csrf_token:
        return jsonify({"message": "No Provided CSRF Token"}), HTTPStatus.BAD_REQUEST

    if csrf_token != header_csrf_token:
        return jsonify({"message": "Invalid CSRF Token"}), HTTPStatus.FORBIDDEN

    if csrf_token != session_csrf_token:
        return jsonify({"message": "Invalid CSRF Token"}), HTTPStatus.FORBIDDEN

    return True
