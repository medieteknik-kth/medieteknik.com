"""
Next.js authentication decorators, used for specific routes
"""

from http import HTTPStatus
from os import environ

from fastapi import Header, HTTPException


def nextjs_auth_required(authorization: str = Header(..., alias="Authorization")):
    """Decorator to check if the request is authenticated by the Next.js server."""

    if not authorization:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Authorization header is missing",
        )

    key = authorization.split(" ")[1] if " " in authorization else authorization

    if not key:
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Token is missing",
        )
    if key != environ.get("NEXTJS_AUTHORIZATION_KEY"):
        raise HTTPException(
            status_code=HTTPStatus.UNAUTHORIZED,
            detail="Invalid token",
        )
