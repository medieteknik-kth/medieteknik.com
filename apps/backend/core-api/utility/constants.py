"""
A utility module that contains constants used in the backend.
"""

import enum
from typing import List

DEFAULT_LANGUAGE_CODE = "en-GB"
AVAILABLE_LANGUAGES: List[str] = [DEFAULT_LANGUAGE_CODE, "sv-SE"]

API_VERSION = "v1"
PUBLIC_PATH = f"/api/{API_VERSION}/public"
PROTECTED_PATH = f"/api/{API_VERSION}"


class ROUTES(enum.Enum):
    """
    Enum representing the available API routes. Should be used to avoid hardcoding the routes, and to ensure consistency.

    ALBUMS: The albums route
    DYNAMIC: The dynamic route
    STUDENTS: The students route
    COMMITTEES: The committees route
    COMMITTEE_CATEGORIES: The committee categories route
    COMMITTEE_POSITIONS: The committee positions route
    EVENTS: The events route
    NEWS: The news route
    MEDIA: The media route
    DOCUMENTS: The documents route
    LANGUAGES: The languages route
    """

    ALBUMS = "albums"
    DYNAMIC = "dynamic"
    STUDENTS = "students"
    COMMITTEES = "committees"
    COMMITTEE_CATEGORIES = "committee_categories"
    COMMITTEE_POSITIONS = "committee_positions"
    EVENTS = "events"
    NEWS = "news"
    MEDIA = "media"
    DOCUMENTS = "documents"
    LANGUAGES = "languages"
