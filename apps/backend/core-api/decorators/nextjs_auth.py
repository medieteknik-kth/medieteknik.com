"""
Next.js authentication decorators, used for specific routes
"""

from functools import wraps
from os import environ
from flask import request, jsonify
from http import HTTPStatus


def nextjs_auth_required(f):
    """Decorator to check if the request is authenticated by the Next.js server."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify(
                {"error": "Authorization header is missing"}
            ), HTTPStatus.UNAUTHORIZED

        key = token.split(" ")[1] if " " in token else token
        if not key:
            return jsonify({"error": "Token is missing"}), HTTPStatus.UNAUTHORIZED

        if key != environ.get("NEXTJS_AUTHORIZATION_KEY"):
            return jsonify({"error": "Invalid token"}), HTTPStatus.UNAUTHORIZED

        return f(*args, **kwargs)

    return decorated_function
