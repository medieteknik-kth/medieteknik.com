"""
Utility functions for CSRF protection.
"""

from http import HTTPStatus
from flask import Response, jsonify, make_response, request, session
from flask_wtf.csrf import CSRFProtect

# The CSRF protection object, should be initialized in the application factory and used in the application context.
csrf = CSRFProtect()


def validate_csrf(csrf_token: str) -> Response | bool:
    """
    Validates CSRF tokens via the X-CSRF-Token header, the session CSRF token, and the given CSRF token.

        :param csrf_token: str - The CSRF token to validate
        :return: Response | bool - The response if the CSRF token is invalid, True otherwise
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
