"""
CSRF Protection

Decorator for CSRF protection.
"""

from http import HTTPStatus
from typing import Any, Dict

from fastapi import Header, HTTPException, Request

from utility.csrf import validate_csrf


async def csrf_protected(
    request: Request,
    header: str = Header(..., alias="content-type"),
    csrf_header: str = Header(..., alias="X-CSRF-Token"),
):
    """
    Wrapper function for the CSRF protection decorator.

    :param *args: The arguments passed to the function.
    :type *args: tuple
    :param **kwargs: The keyword arguments passed to the function.
    :type **kwargs: dict
    :return: The response from the wrapped function, or a boolean depending on the CSRF validation.
    :rtype: Response | bool
    """

    if request.method == "OPTIONS":
        return None

    csrf_token: str = ""

    if header == "application/json":
        json_data: Dict[str, Any] = await request.json()
        csrf_token = json_data.get("csrf_token")
    else:
        try:
            form_data = await request.form()

            csrf_token = form_data.get("csrf_token")
        except Exception as e:
            raise HTTPException(
                status_code=HTTPStatus.UNSUPPORTED_MEDIA_TYPE,
                detail="CSRF Token verification failed! Unsupported media type.",
            ) from e

    if not csrf_token:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="CSRF token is missing! Please provide a CSRF token.",
        )
    result = validate_csrf(
        request=request, csrf_token=csrf_token, header_csrf_token=csrf_header
    )

    if result is not True:
        raise HTTPException(
            status_code=HTTPStatus.FORBIDDEN,
            detail="CSRF token verification failed! Invalid CSRF token.",
        )
