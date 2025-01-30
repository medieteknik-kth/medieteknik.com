"""
v1 API Routes.

All routes are registered here via the `register_routes` function.
"""

import os
import secrets
import urllib
from http import HTTPStatus
from datetime import datetime, timedelta
from flask import Flask, jsonify, make_response, request, session, url_for
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
    set_refresh_cookies,
    create_refresh_token,
)
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.student import Student, StudentMembership
from services.utility.auth import (
    get_student_authorization,
    get_student_committee_details,
)
from utility.constants import API_VERSION, PROTECTED_PATH, PUBLIC_PATH, ROUTES
from flask_wtf.csrf import generate_csrf
from utility.authorization import oauth
from utility.database import db


def register_v1_routes(app: Flask):
    """
    Register all routes for the backend.

    Args:
        app (Flask): The Flask app.
    """
    # Public Routes
    from .public import (
        public_committee_bp,
        public_committee_category_bp,
        public_committee_position_bp,
        public_calendar_bp,
        public_bp,
        public_album_bp,
        public_news_bp,
        public_events_bp,
        public_media_bp,
        public_documents_bp,
        public_student_bp,
    )

    # Protected Routes
    from .auth import (
        committee_bp,
        committee_position_bp,
        news_bp,
        events_bp,
        documents_bp,
        media_bp,
        album_bp,
        calendar_bp,
        student_bp,
    )

    # Public Routes
    app.register_blueprint(public_bp, url_prefix=f"{PUBLIC_PATH}")
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
            if os.environ.get("FLASK_ENV") == "development":
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
    def add_headers(response: Response):
        response.headers["Content-Security-Policy"] = (
            "default-src none; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; object-src 'none';"
        )
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "same-origin"
        if os.environ.get("FLASK_ENV") == "development":
            response.headers["Strict-Transport-Security"] = (
                "max-age=31536000; includeSubDomains; preload"
            )
        return response

    @app.after_request
    def refresh_jwt(response: Response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now(timezone.utc)
            remember = session.get("remember", False)

            target_timestamp = (
                datetime.timestamp(now + timedelta(minutes=30))
                if not remember
                else datetime.timestamp(now + timedelta(days=1))
            )
            if target_timestamp > exp_timestamp:
                student_id = get_jwt_identity()

                student = Student.query.filter_by(student_id=student_id).one_or_none()

                if not student:
                    return jsonify({"error": "Invalid credentials"}), 401

                permissions, role = get_student_authorization(student)
                committees, committee_positions = get_student_committee_details(
                    student=student
                )

                response = jsonify(
                    {
                        "student": student.to_dict(),
                        "permissions": permissions,
                        "role": role,
                        "committees": committees,
                        "committee_positions": committee_positions,
                    }
                )
                additional_claims = {
                    "permissions": permissions,
                    "role": role,
                }
                access_token = create_access_token(
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
        try:
            token = oauth.kth.authorize_access_token()
        except Exception as e:
            app.logger.error(f"OIDC authorization error: {str(e)}")
            return jsonify(
                {"error": "An internal error has occurred."}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

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

        response = make_response({"student": student.to_dict(is_public_route=False)})
        additional_claims = {
            "permissions": {},
            "role": "",
        }
        try:
            permissions, role = get_student_authorization(student)
            committees, committee_positions = get_student_committee_details(
                student=student
            )
            additional_claims = {
                "permissions": permissions,
                "role": role,
            }

            response = make_response(
                {
                    "student": student.to_dict(is_public_route=False),
                    "permissions": permissions,
                    "role": role,
                    "committees": committees,
                    "committee_positions": committee_positions,
                }
            )
        except Exception as e:
            app.logger.error(f"Error retrieving extra claims: {str(e)}")

        response.status_code = 302
        set_access_cookies(
            response=response,
            encoded_access_token=create_access_token(
                identity=student,
                fresh=timedelta(minutes=30),
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
