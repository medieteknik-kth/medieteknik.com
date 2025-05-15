"""
Module for decorators.
==========

This module contains decorators for various functionalities such as CSRF protection, Google OIDC token verification, and Next.js authentication.

Decorators:
 * `csrf_protected` - Protects routes from CSRF attacks.
 * `verify_google_oidc_token` - Verifies Google OIDC tokens for authentication.
 * `nextjs_auth_required` - Ensures that the request is authenticated by the Next.js server.
"""

from .csrf_protection import csrf_protected
from .google_oidc import verify_google_oidc_token
from .jwt import get_jwt_identity, get_student, jwt_required
from .nextjs_auth import nextjs_auth_required

__all__ = [
    "csrf_protected",
    "verify_google_oidc_token",
    "jwt_required",
    "get_student",
    "get_jwt_identity",
    "nextjs_auth_required",
]
