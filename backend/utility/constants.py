"""
A utility module that contains constants used in the backend.
"""

import enum
from typing import List

DEFAULT_LANGUAGE_CODE = "sv-SE"
AVAILABLE_LANGUAGES: List[str] = [DEFAULT_LANGUAGE_CODE, "en-GB"]

API_VERSION = "v1"
PUBLIC_PATH = f"/api/{API_VERSION}/public"
PROTECTED_PATH = f"/api/{API_VERSION}"


class ROUTES(enum.Enum):
    """
    Enum representing the available API routes.

    Attributes:
        DYNAMIC: The route for dynamic content.
        STUDENTS: The route for students.
        COMMITTEES: The route for committees.
        COMMITTEE_CATEGORIES: The route for committee categories.
        COMMITTEE_POSITIONS: The route for committee positions.
        EVENTS: The route for events.
        NEWS: The route for news.
        ALBUMS: The route for albums.
        DOCUMENTS: The route for documents.
        LANGUAGES: The route for languages.
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
