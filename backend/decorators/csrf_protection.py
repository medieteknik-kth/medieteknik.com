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

    :param f: The function to wrap.
    :type f: FunctionType
    :return: The wrapped function.
    :rtype: FunctionType
    """

    @wraps(f)
    def wrap(*args, **kwargs):
        """
        Wrapper function for the CSRF protection decorator.

        :param *args: The arguments passed to the function.
        :type *args: tuple
        :param **kwargs: The keyword arguments passed to the function.
        :type **kwargs: dict
        :return: The response from the wrapped function, or a boolean depending on the CSRF validation.
        :rtype: Response | bool
        """

        if not request:
            raise ValueError(
                "Request object is missing! Make sure you're using the decorator in a endpoint."
            )

        if request.metod == "OPTIONS":
            return f(*args, **kwargs)

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
