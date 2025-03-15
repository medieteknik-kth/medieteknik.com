"""
This module contains the core services of the application.
"""

from .author import get_author_from_email

from .student import login
from .student import assign_password
from .student import update

from .notifications import add_notification
from .notifications import retrieve_notifications
from .notifications import subscribe_to_notifications


__all__ = [
    "get_author_from_email",
    "login",
    "assign_password",
    "update",
    "add_notification",
    "retrieve_notifications",
    "subscribe_to_notifications",
]
