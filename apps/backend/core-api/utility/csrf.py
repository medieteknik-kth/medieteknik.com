"""
Utility functions for CSRF protection.
"""

from http import HTTPStatus

from fastapi import Header, HTTPException, Request

from utility.session import CookieSession


def validate_csrf(
    request: Request,
    csrf_token: str,
    header_csrf_token=Header(..., alias="X-CSRF-Token"),
) -> bool:
    """
    Validates CSRF tokens via the X-CSRF-Token header, the session CSRF token, and the given CSRF token.

    :param csrf_token: The CSRF token to validate
    :type csrf_token: str
    :return: True if the CSRF token is valid, otherwise a response with an error message
    :rtype: Response | bool
    """
    session = CookieSession(request)
    session_csrf_token = session.get("csrf_token")

    if not session_csrf_token:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST, detail="No Session CSRF Token"
        )

    if not csrf_token or not header_csrf_token:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="No Provided CSRF Token",
        )

    if csrf_token != header_csrf_token:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail="Invalid Header CSRF Token",
        )

    if csrf_token != session_csrf_token:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail="Invalid Session CSRF Token",
        )

    return True
