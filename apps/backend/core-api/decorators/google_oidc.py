from http import HTTPStatus
from os import environ

from fastapi import HTTPException, Request
from google.auth.transport import requests
from google.oauth2 import id_token


def verify_google_audience_token(audience: str):
    def verify_google_oidc_token(request: Request):
        """
        Verify Google OIDC token for authentication.

        Args:
            request (Request): The FastAPI request object.
            audience (str): The audience for the token.
        Raises:
            HTTPException: If the token is invalid or missing.

        """

        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Unauthorized, missing token",
            )

        token = auth_header.split(" ")[1]

        try:
            # Verify the token
            request_adapter = requests.Request()
            decoded_token = id_token.verify_token(
                id_token=token, request=request_adapter, audience=audience
            )

            if decoded_token.get("email") != environ.get("GOOGLE_SERVICE_ACCOUNT"):
                raise HTTPException(
                    status_code=HTTPStatus.FORBIDDEN,
                    detail="Invalid service account!",
                )

        except Exception:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Unauthorized, invalid token",
            )

    return verify_google_oidc_token
