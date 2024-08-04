from functools import wraps
from http import HTTPStatus
from typing import Any, Dict
from utility.csrf import validate_csrf

from flask import jsonify, request


def csrf(f):
    """
    Decorator for CSRF protection. Validates the CSRF token in the request JSON.

    Args:
        f: The function to be wrapped with CSRF protection.

    Returns:
        The wrapped function that checks for CSRF token validity before calling the original function.
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        csrf_token = ""
        if not request.is_json:
            csrf_token = request.form.get("csrf_token")
        else:
            csrf_token = request.get_json().get("csrf_token")

        if not csrf_token:
            return jsonify({"error": "CSRF token is missing"}), HTTPStatus.BAD_REQUEST
        result = validate_csrf(csrf_token)

        if result:
            return f(*args, **kwargs)
        return result

    return wrap
