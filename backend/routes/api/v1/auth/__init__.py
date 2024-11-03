"""
API v1 Auth Blueprints
"""

from .committees.committee_routes import committee_bp

from .committees.committee_position_routes import committee_position_bp

from .content.news_routes import news_bp

from .content.event_routes import events_bp

from .content.document_routes import documents_bp

from .content.media_routes import media_bp

from .content.album_routes import album_bp

from .core.calendar_routes import calendar_bp

from .core.student_routes import student_bp

from .core.author_routes import author_bp

__all__ = [
    "album_bp",
    "author_bp",
    "calendar_bp",
    "committee_bp",
    "committee_position_bp",
    "documents_bp",
    "events_bp",
    "media_bp",
    "news_bp",
    "student_bp",
]
