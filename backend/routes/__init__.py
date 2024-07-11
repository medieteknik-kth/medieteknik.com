"""
Routes for the backend.

All routes are registered here via the `register_routes` function.
"""

from flask import Flask
from utility.constants import PROTECTED_PATH, PUBLIC_PATH, ROUTES


def register_routes(app: Flask):
    from .public.committee_routes import (
        public_committee_bp,
        public_committee_category_bp,
        public_committee_position_bp,
    )
    from .public.calendar_routes import calendar_bp
    from .public.dynamic_routes import public_dynamic_routes_bp
    from .public.general_routes import public_bp
    from .public.item_routes import (
        public_news_bp,
        public_events_bp,
        public_documents_bp,
        public_albums_bp,
    )
    from .public.student_routes import public_student_bp
    from .committee_routes import committee_bp
    from .author_routes import author_bp
    from .item_routes import news_bp, events_bp, documents_bp, albums_bp
    from .student_routes import student_bp

    # Public Routes
    app.register_blueprint(public_bp, url_prefix=f"{PUBLIC_PATH}")
    app.register_blueprint(
        public_dynamic_routes_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.DYNAMIC.value}"
    )
    app.register_blueprint(
        public_committee_category_bp,
        url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEE_CATEGORIES.value}",
    )
    app.register_blueprint(calendar_bp, url_prefix=f"{PUBLIC_PATH}/calendar")
    app.register_blueprint(
        public_committee_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEES.value}"
    )
    app.register_blueprint(
        public_committee_position_bp,
        url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}",
    )
    app.register_blueprint(
        public_student_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.STUDENTS.value}"
    )
    app.register_blueprint(
        public_news_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.NEWS.value}"
    )
    app.register_blueprint(
        public_events_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.EVENTS.value}"
    )
    app.register_blueprint(
        public_documents_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.DOCUMENTS.value}"
    )
    app.register_blueprint(
        public_albums_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.ALBUMS.value}"
    )

    # Protected Routes
    app.register_blueprint(news_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.NEWS.value}")
    app.register_blueprint(
        events_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.EVENTS.value}"
    )
    app.register_blueprint(
        documents_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.DOCUMENTS.value}"
    )
    app.register_blueprint(
        albums_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.ALBUMS.value}"
    )
    app.register_blueprint(
        committee_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEES.value}"
    )
    app.register_blueprint(author_bp, url_prefix=f"{PROTECTED_PATH}/authors")
    app.register_blueprint(
        student_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.STUDENTS.value}"
    )
