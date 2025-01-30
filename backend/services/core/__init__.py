"""
This module contains the core services of the application.
"""

from .author import get_author_from_email
from .student import (
    login,
    assign_password,
    update,
)


__all__ = [
    "get_author_from_email",
    "login",
    "assign_password",
    "update",
]
