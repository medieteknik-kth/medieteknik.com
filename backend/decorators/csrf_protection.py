"""
CSRF Protection

Decorator for CSRF protection.
"""

from functools import wraps
from http import HTTPStatus
from utility.csrf import validate_csrf

from flask import Response, jsonify, request


def csrf_protected(f):
    """
    Decorator for CSRF protection. Validates the CSRF token in the request from either a JSON or Form.

    Args:
        f: The function to be wrapped with CSRF protection.

    Returns:
        The wrapped function that checks for CSRF token validity before calling the original function.
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        if not request:
            raise ValueError(
                "Request object is missing! Make sure you're using the decorator in a endpoint."
            )

        csrf_token: str = ""
        # Check if the request is JSON or a Form
        if not request.is_json:
            csrf_token = request.form.get("csrf_token")
        else:
            csrf_token = request.get_json().get("csrf_token")

        if not csrf_token:
            return jsonify({"error": "CSRF token is missing"}), HTTPStatus.BAD_REQUEST
        result: Response | bool = validate_csrf(csrf_token)

        if isinstance(result, bool) and result is True:
            return f(*args, **kwargs)
        return result

    return wrap
