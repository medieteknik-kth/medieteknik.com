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
        if not request.is_json:
            return jsonify({"error": "Invalid request"}), HTTPStatus.BAD_REQUEST

        json: Dict[str, Any] = request.get_json()
        result = validate_csrf(json.get("csrf_token"))

        if result:
            return f(*args, **kwargs)
        return result

    return wrap
