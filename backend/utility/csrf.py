"""
Utility functions for CSRF protection.
"""

from http import HTTPStatus
from flask import Response, jsonify, make_response, request, session
from flask_wtf.csrf import CSRFProtect

csrf = CSRFProtect()


def validate_csrf(csrf_token) -> Response | bool:
    """
    Validates CSRF tokens via the X-CSRF-Token header, the session CSRF token, and the given CSRF token.

    Args:
        csrf_token: The CSRF token to validate.

    Returns:
        True if the CSRF token is valid, or a Flask Response if the CSRF token is invalid.
    """
    header_csrf_token = request.headers.get("X-CSRF-Token")
    session_csrf_token = session.get("csrf_token")

    if not session_csrf_token:
        response = make_response(jsonify({"message": "No Session CSRF Token"}))
        response.status_code = HTTPStatus.BAD_REQUEST
        return response

    if not csrf_token or not header_csrf_token:
        response = make_response(jsonify({"message": "No Provided CSRF Token"}))
        response.status_code = HTTPStatus.BAD_REQUEST
        return response

    if csrf_token != header_csrf_token:
        response = make_response(
            jsonify(
                {
                    "message": "Invalid Header CSRF Token",
                    "csrf_token": csrf_token,
                    "header_csrf_token": header_csrf_token,
                }
            )
        )
        response.status_code = HTTPStatus.FORBIDDEN
        return response

    if csrf_token != session_csrf_token:
        response = make_response(
            jsonify(
                {
                    "message": "Invalid Session CSRF Token",
                    "csrf_token": csrf_token,
                    "session_csrf_token": session_csrf_token,
                }
            )
        )
        response.status_code = HTTPStatus.FORBIDDEN
        return response

    return True
