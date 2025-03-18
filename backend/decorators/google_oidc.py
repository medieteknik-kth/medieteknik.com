from http import HTTPStatus
from os import environ
from flask import request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests
from functools import wraps
from utility.logger import log_error


def verify_google_oidc_token(audience):
    """
    Decorator to verify the Google OIDC token.
    :param audience: str - The audience of the token, the service account email.
    :return: function - The decorated function.
    """

    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            auth_header = request.headers.get("Authorization")

            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify(
                    {"error": "Unauthorized, missing token"}
                ), HTTPStatus.UNAUTHORIZED

            token = auth_header.split(" ")[1]

            try:
                # Verify the token
                request_adapter = requests.Request()
                decoded_token = id_token.verify_token(
                    id_token=token, request=request_adapter, audience=audience
                )

                if decoded_token.get("email") != environ.get("GOOGLE_SERVICE_ACCOUNT"):
                    return jsonify(
                        {"error": "Invalid service account!"}
                    ), HTTPStatus.FORBIDDEN

            except Exception as e:
                log_error(f"Error verifying token: {e}")
                return jsonify(
                    {"error": "Unauthorized, invalid token"}
                ), HTTPStatus.UNAUTHORIZED

            return f(*args, **kwargs)

        return decorated_function

    return decorator
