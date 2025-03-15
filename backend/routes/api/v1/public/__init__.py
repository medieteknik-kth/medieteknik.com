"""
API v1 Public Blueprints
"""

from .committees.committee_routes import public_committee_bp
from .committees.committee_routes import public_committee_category_bp

from .committees.committee_position_routes import public_committee_position_bp


from .common.general_routes import public_bp

from .content.album_routes import public_album_bp

from .content.document_routes import public_documents_bp

from .content.news_routes import public_news_bp

from .content.event_routes import public_events_bp

from .content.media_routes import public_media_bp

from .core.calendar_routes import public_calendar_bp

from .core.student_routes import public_student_bp

__all__ = [
    "public_bp",
    "public_album_bp",
    "public_calendar_bp",
    "public_committee_bp",
    "public_committee_category_bp",
    "public_committee_position_bp",
    "public_documents_bp",
    "public_events_bp",
    "public_media_bp",
    "public_news_bp",
    "public_student_bp",
]
