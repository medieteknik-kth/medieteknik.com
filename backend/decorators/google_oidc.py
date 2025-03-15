from http import HTTPStatus
from flask import request, jsonify
from google.auth import jwt
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
                return jsonify({"error": "Unauthorized"}), HTTPStatus.UNAUTHORIZED

            token = auth_header.split(" ")[1]

            try:
                # Verify the token
                request_adapter = requests.Request()
                decoded_token = jwt.decode(token, request_adapter, audience=audience)

                if (
                    decoded_token.get("email")
                    != "medieteknik@medieteknik.iam.gserviceaccount.com"
                ):
                    return jsonify(
                        {"error": "Invalid service account!"}
                    ), HTTPStatus.FORBIDDEN

            except Exception as e:
                log_error(f"Error verifying token: {e}")
                return jsonify({"error": "Unauthorized"}), HTTPStatus.UNAUTHORIZED

            return f(*args, **kwargs)

        return decorated_function

    return decorator
