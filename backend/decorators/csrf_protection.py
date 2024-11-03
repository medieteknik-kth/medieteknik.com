"""
CSRF Protection

Decorator for CSRF protection.
"""

from flask import Response, jsonify, request
from functools import wraps
from http import HTTPStatus
from types import FunctionType
from utility.csrf import validate_csrf


def csrf_protected(f: FunctionType) -> FunctionType:
    """
    Decorator for CSRF protection. Validates the CSRF token in the request from either a JSON or Form.
        :param f: function - The function to wrap.
        :return: function - The wrapped function.
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        """
        Wrapper function for the CSRF protection decorator.
            :param args: tuple - The arguments passed to the function.
            :param kwargs: dict - The keyword arguments passed to the function.
            :return: Response | bool - The response from the wrapped function, or a boolean depending on the CSRF validation.
        """

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
