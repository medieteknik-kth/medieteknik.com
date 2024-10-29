"""
Routes for the backend.

All routes are registered here via the `register_routes` function.
"""

import os
import secrets
from datetime import datetime, timedelta
import urllib.parse
from flask import Flask, jsonify, make_response, request, session, url_for
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    create_refresh_token,
)
import urllib
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.student import Student, StudentMembership
from services.core.student import get_permissions, retrieve_extra_claims
from utility.constants import API_VERSION, PROTECTED_PATH, PUBLIC_PATH, ROUTES
from flask_wtf.csrf import generate_csrf
from utility.authorization import oauth
from utility.database import db


def register_routes(app: Flask):
    """
    Register all routes for the backend.

    Args:
        app (Flask): The Flask app.
    """
    from .public.committee_routes import (
        public_committee_bp,
        public_committee_category_bp,
    )
    from .public.committee_position_routes import public_committee_position_bp
    from .public.calendar_routes import public_calendar_bp
    from .public.dynamic_routes import public_dynamic_routes_bp
    from .public.general_routes import public_bp
    from .public.album_routes import public_album_bp
    from .public.item_routes import (
        public_news_bp,
        public_events_bp,
    )
    from .public.media_routes import public_media_bp
    from .public.document_routes import public_documents_bp
    from .public.student_routes import public_student_bp
    from .calendar_routes import calendar_bp
    from .committee_routes import committee_bp
    from .committee_position_routes import committee_position_bp
    from .author_routes import author_bp
    from .news_routes import news_bp
    from .event_routes import events_bp
    from .document_routes import documents_bp
    from .media_routes import media_bp
    from .album_routes import album_bp
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
    app.register_blueprint(public_calendar_bp, url_prefix=f"{PUBLIC_PATH}/calendar")
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
        public_media_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.MEDIA.value}"
    )
    app.register_blueprint(
        public_album_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.ALBUMS.value}"
    )

    # Protected Routes
    app.register_blueprint(calendar_bp, url_prefix=f"{PROTECTED_PATH}/calendar")
    app.register_blueprint(
        committee_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEES.value}"
    )
    app.register_blueprint(
        committee_position_bp,
        url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}",
    )
    app.register_blueprint(news_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.NEWS.value}")
    app.register_blueprint(
        events_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.EVENTS.value}"
    )
    app.register_blueprint(
        documents_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.DOCUMENTS.value}"
    )
    app.register_blueprint(
        media_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.MEDIA.value}"
    )
    app.register_blueprint(
        album_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.ALBUMS.value}"
    )
    app.register_blueprint(author_bp, url_prefix=f"{PROTECTED_PATH}/authors")
    app.register_blueprint(
        student_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.STUDENTS.value}"
    )

    @app.before_request
    def handle_preflight():
        """
        Handle CORS preflight requests.
        """
        if request.method == "OPTIONS":
            response = make_response()
            if os.environ.get("FLASK_ENV", "development") == "development":
                response.headers.add(
                    "Access-Control-Allow-Origin", "http://localhost:3000"
                )
            else:
                response.headers.add(
                    "Access-Control-Allow-Origin", "https://www.medieteknik.com"
                )
            response.headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization,X-CSRF-Token",
            )
            response.headers.add("Access-Control-Allow-Credentials", "true")
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
            )
            response.status_code = 200
            return response

    @app.after_request
    def refresh_jwt(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if exp_timestamp <= target_timestamp:
                student_id = get_jwt_identity()

                student = Student.query.filter_by(student_id=student_id).one_or_none()

                if not student:
                    return jsonify({"error": "Invalid credentials"}), 401

                permissions_and_role = get_permissions(getattr(student, "student_id"))

                committees = []
                committee_positions = []
                student_memberships = StudentMembership.query.filter_by(
                    student_id=student.student_id
                ).all()

                for membership in student_memberships:
                    position = CommitteePosition.query.get(
                        membership.committee_position_id
                    )
                    if not position or not isinstance(position, CommitteePosition):
                        continue

                    committee = Committee.query.get(position.committee_id)
                    if not committee or not isinstance(committee, Committee):
                        continue

                    committees.append(committee.to_dict())
                    committee_positions.append(position.to_dict(is_public_route=False))

                response = jsonify(
                    {
                        "student": student.to_dict(),
                        "permissions": permissions_and_role.get("permissions"),
                        "role": permissions_and_role.get("role"),
                        "committees": committees,
                        "committee_positions": committee_positions,
                    }
                )
                additional_claims = {
                    "role": permissions_and_role.get("role"),
                    "permissions": permissions_and_role.get("permissions"),
                }

                access_token = create_access_token(
                    identity=student, fresh=False, additional_claims=additional_claims
                )
                set_access_cookies(response, access_token)

        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            pass

        return response

    # Non-Specific Routes
    @app.route("/")
    def index():
        """
        Index route.
        """
        title = f"Medieteknik.com API {API_VERSION}, see documentation at /docs"
        avaliable_routes = [
            f"""
                            <span style='text-transform: lowercase;'>
                                api/{API_VERSION}/{route.value}
                            </span> <br />"""
            for route in (ROUTES)
        ]
        return f'<h1>{title}</h1><p>Avaliable routes:</p>{''.join(avaliable_routes)}'

    @app.route("/api/v1/csrf-token")
    def get_csrf_token():
        token = session.get("csrf_token")
        if not token:
            new_token = generate_csrf()
            session["csrf_token"] = new_token
            return jsonify({"token": new_token})
        return jsonify({"token": token})

    @app.route("/auth")
    def auth():
        """
        Auth route.
        """
        nonce = secrets.token_urlsafe(32)

        return_url = request.args.get("return_url", type=str, default="/")
        return_url = urllib.parse.quote(return_url)
        session["return_url"] = return_url
        session["oauth_nonce"] = nonce

        redirect_uri = url_for(endpoint="oidc_auth", _external=True)
        return oauth.kth.authorize_redirect(redirect_uri, nonce=nonce)

    @app.route("/oidc")
    def oidc_auth():
        """
        OIDC route.
        """
        token = oauth.kth.authorize_access_token()

        if not token:
            return jsonify({"error": "Invalid credentials"}), 401

        nonce = session.pop("oauth_nonce", None)

        student_data = oauth.kth.parse_id_token(token, nonce=nonce)

        if not student_data:
            return jsonify({"error": "Invalid credentials"}), 401

        session["student"] = student_data

        if not student_data.get("username"):
            return jsonify({"error": "Invalid response"}), 401

        student_email = student_data.get("username") + "@kth.se"

        student = Student.query.filter_by(email=student_email).one_or_none()

        if not student:
            student = Student(
                email=student_email,
                first_name=student_email,
                password_hash="",
            )

            db.session.add(student)
            db.session.commit()

        permissions_and_role, additional_claims, committees, committee_positions = (
            retrieve_extra_claims(student=student)
        )
        response = make_response(
            {
                "student": student.to_dict(is_public_route=False),
                "committees": committees,
                "committee_positions": committee_positions,
                "permissions": permissions_and_role.get("permissions"),
                "role": permissions_and_role.get("role"),
            }
        )

        response.status_code = 302
        set_access_cookies(
            response=response,
            encoded_access_token=create_access_token(
                identity=student,
                fresh=timedelta(minutes=20),
                additional_claims=additional_claims,
            ),
            max_age=timedelta(hours=1),
        )
        set_refresh_cookies(
            response=response,
            encoded_refresh_token=create_refresh_token(identity=student),
            max_age=timedelta(days=30).seconds,
        )
        return_url = session.pop("return_url", default=None)
        if return_url:
            response.headers.add("Location", f"https://www.medieteknik.com{return_url}")
        else:
            response.headers.add("Location", "https://www.medieteknik.com")
        return response
