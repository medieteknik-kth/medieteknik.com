"""
This module contains the core services of the application.
"""

from .author import get_author_from_email
from .student import (
    login,
    retrieve_extra_claims,
    assign_password,
    update,
    get_permissions,
)


__all__ = [
    "get_author_from_email",
    "login",
    "retrieve_extra_claims",
    "assign_password",
    "update",
    "get_permissions",
]
