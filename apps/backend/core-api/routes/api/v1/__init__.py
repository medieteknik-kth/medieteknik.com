"""
v1 API Routes.

All routes are registered here via the `register_routes` function.
"""

import json
import os
import secrets
from typing import Any
import urllib
from http import HTTPStatus
from datetime import datetime, timedelta, timezone
from flask import Flask, Response, jsonify, make_response, request, session, url_for
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_jwt_cookies,
)
from sqlalchemy import text
from decorators.csrf_protection import csrf_protected
from models.core.student import Student
from models.utility.auth import RevokedTokens
from services.apps.rgbank.auth_service import get_bank_account
from services.apps.rgbank.permission_service import attach_permissions
from services.core.student import login
from services.utility.auth import (
    get_student_authorization,
    get_student_committee_details,
)
from sqlalchemy.exc import SQLAlchemyError
from utility.constants import (
    API_VERSION,
    DEFAULT_FILTER,
    POSSIBLE_FILTERS,
    PROTECTED_PATH,
    PUBLIC_PATH,
    ROUTES,
)
from flask_wtf.csrf import generate_csrf
from utility.authorization import oauth
from utility.database import db
from utility.translation import retrieve_languages
from utility.authorization import jwt


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
        scheduler_bp,
        message_bp,
        tasks_bp,
    )

    from ..apps.rgbank import (
        account_bp,
        expense_domain_bp,
        public_expense_domain_bp,
        expense_bp,
        invoice_bp,
        rgbank_permissions_bp,
        statistics_bp,
        public_statistics_bp,
    )

    # Public Routes
    def register_public_routes():
        """Register all public routes."""
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
            public_documents_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.DOCUMENTS.value}"
        )
        app.register_blueprint(
            public_media_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.MEDIA.value}"
        )
        app.register_blueprint(
            public_album_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.ALBUMS.value}"
        )

    # Protected Routes
    def register_protected_routes():
        """Register all routes with the protected prefix, requiring authentication."""
        app.register_blueprint(calendar_bp, url_prefix=f"{PROTECTED_PATH}/calendar")
        app.register_blueprint(
            committee_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEES.value}"
        )
        app.register_blueprint(
            committee_position_bp,
            url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}",
        )
        app.register_blueprint(
            news_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.NEWS.value}"
        )
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
        app.register_blueprint(scheduler_bp, url_prefix=f"{PROTECTED_PATH}/scheduler")

        app.register_blueprint(message_bp, url_prefix=f"{PROTECTED_PATH}/messages")

        app.register_blueprint(tasks_bp, url_prefix=f"{PROTECTED_PATH}/tasks")

    # RGBank Routes
    def register_rgbank_routes():
        """ "Register all routes for the RGBank app."""
        app.register_blueprint(
            account_bp, url_prefix=f"{PROTECTED_PATH}/rgbank/account"
        )
        app.register_blueprint(
            expense_domain_bp,
            url_prefix=f"{PROTECTED_PATH}/rgbank/expense-domains",
        )
        app.register_blueprint(
            public_expense_domain_bp,
            url_prefix=f"{PUBLIC_PATH}/rgbank/expense-domains",
        )
        app.register_blueprint(
            expense_bp,
            url_prefix=f"{PROTECTED_PATH}/rgbank/expenses",
        )
        app.register_blueprint(
            invoice_bp,
            url_prefix=f"{PROTECTED_PATH}/rgbank/invoices",
        )
        app.register_blueprint(
            rgbank_permissions_bp,
            url_prefix=f"{PROTECTED_PATH}/rgbank/permissions",
        )
        app.register_blueprint(
            statistics_bp,
            url_prefix=f"{PROTECTED_PATH}/rgbank/statistics",
        )
        app.register_blueprint(
            public_statistics_bp,
            url_prefix=f"{PUBLIC_PATH}/rgbank/statistics",
        )

    register_public_routes()
    register_protected_routes()
    register_rgbank_routes()

    @app.after_request
    def add_headers(response: Response):
        response.headers["Content-Security-Policy"] = (
            "default-src none; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; object-src 'none';"
        )
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "same-origin"

        # If public route, set cache control to 10 minutes if not already set
        if request.path.startswith(f"{PUBLIC_PATH}") and not response.headers.get(
            "Cache-Control"
        ):
            response.headers["Cache-Control"] = "public, max-age=60"  # 1 minute
        elif request.path.startswith(f"{PROTECTED_PATH}") and not response.headers.get(
            "Cache-Control"
        ):
            response.headers["Cache-Control"] = (
                "private, no-store, no-cache, must-revalidate"
            )

        if os.environ.get("FLASK_ENV") != "development":
            response.headers["Strict-Transport-Security"] = (
                "max-age=3600; includeSubDomains;"
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
            # If the token is about to expire, refresh it
            if target_timestamp > exp_timestamp:
                student_id = get_jwt_identity()
                filter = session.get("filter", DEFAULT_FILTER)

                student: Student | None = Student.query.filter_by(
                    student_id=student_id
                ).one_or_none()

                if not student or not isinstance(student, Student):
                    return jsonify({"error": "Invalid credentials"}), 401

                permissions, role = get_student_authorization(student)
                committees, committee_positions = get_student_committee_details(
                    student=student
                )
                expiration = timedelta(hours=1) if not remember else timedelta(days=14)
                exp_unix = int((datetime.now() + expiration).timestamp())

                response_dict = {
                    "student": student.to_dict(is_public_route=False),
                    "permissions": permissions,
                    "role": role,
                    "committees": committees,
                    "committee_positions": committee_positions,
                    "expiration": exp_unix,
                }

                if filter == "rgbank":
                    attach_permissions(
                        committee_positions=committee_positions,
                        response_dict=response_dict,
                    )
                    response_dict["rgbank_bank_account"] = get_bank_account(
                        student_id=student.student_id
                    )

                response = jsonify(response_dict)

                access_token = create_access_token(
                    identity=student,
                    fresh=False,
                    expires_delta=expiration,
                    additional_claims=response_dict["rgbank_permissions"],
                )
                set_access_cookies(
                    response, access_token, max_age=expiration.total_seconds()
                )

        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            pass

        return response

    @jwt.invalid_token_loader
    def invalid_token_callback(error: str) -> Response:
        """
        Callback for invalid token.
        """
        response = make_response({"error": f"Invalid token: {error}"})
        unset_jwt_cookies(response)
        response.status_code = HTTPStatus.UNAUTHORIZED

        return response

    # Non-Specific Routes / Auth
    @app.route("/api/v1")
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
        return f"<h1>{title}</h1><p>Avaliable routes:</p>{''.join(avaliable_routes)}"

    @app.route("/api/v1/uptime")
    def uptime():
        """
        Uptime route.
        """
        return jsonify({"message": "OK"}), HTTPStatus.OK

    @app.route("/api/v1/health")
    def health():
        """
        Health route.
        """
        health_status = {"status": "healthy"}

        try:
            db.session.execute(text("SELECT 1"))
            health_status["database"] = "healthy"
        except SQLAlchemyError as e:
            health_status["status"] = "unhealthy"
            health_status["database"] = "unavailable"
            health_status["error"] = str(e)

        return jsonify(health_status), HTTPStatus.OK if health_status[
            "database"
        ] == "healthy" else HTTPStatus.SERVICE_UNAVAILABLE

    @app.route("/api/v1/csrf-token")
    def get_csrf_token() -> Response:
        token = session.get("csrf_token")
        if not token:
            new_token = generate_csrf()
            session["csrf_token"] = new_token
            return jsonify({"token": new_token})
        return jsonify({"token": token})

    @app.route("/api/v1/login", methods=["POST"])
    @csrf_protected
    def login_credentials() -> Response:
        """
        Logs in a student
            :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 200 if successful
        """
        filter = request.args.get(key="filter", default=DEFAULT_FILTER, type=str)

        if filter not in POSSIBLE_FILTERS:
            return jsonify({"error": "Invalid filter"}), HTTPStatus.BAD_REQUEST

        session["filter"] = filter

        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

        provided_languages = retrieve_languages(request.args)

        data: dict[str, Any] = json.loads(json.dumps(data))

        return login(data=data, provided_languages=provided_languages, filter=filter)

    @app.route("/api/v1/logout", methods=["DELETE"])
    @jwt_required()
    def logout() -> Response:
        """
        Logs out a student
            :return: Response - The response object, 200 if successful
        """

        token = get_jwt()
        jti = token["jti"]

        if not jti:
            return jsonify({"success": "No session to log out"}), HTTPStatus.OK

        revoked_token = RevokedTokens(
            jti=jti,
            originally_valid_until=datetime.fromtimestamp(token["exp"]),
        )
        response = make_response(
            jsonify({"success": "Successfully logged out", "jti": jti})
        )

        unset_jwt_cookies(response)

        db.session.add(revoked_token)
        db.session.commit()

        return response

    @app.route("/auth")
    def auth():
        """
        OAuth route for KTH login. First step in the OAuth flow. See the /oidc route for the second step.
        """
        nonce = secrets.token_urlsafe(32)
        filter = request.args.get(key="filter", default=DEFAULT_FILTER, type=str)

        if filter not in POSSIBLE_FILTERS:
            return jsonify({"error": "Invalid filter"}), HTTPStatus.BAD_REQUEST

        return_url = request.args.get("return_url", type=str, default="/")
        remember = request.args.get("remember", type=bool, default=False)
        return_url = urllib.parse.quote(return_url)
        session["filter"] = filter
        session["return_url"] = return_url
        session["remember"] = remember
        session["oauth_nonce"] = nonce

        redirect_uri = url_for(endpoint="oidc_auth", _external=True)
        return oauth.kth.authorize_redirect(redirect_uri, nonce=nonce)

    @app.route("/oidc")
    def oidc_auth() -> Response:
        """
        OIDC route for KTH login. Second step in the OAuth flow, after the /auth route.
        """
        try:
            token = oauth.kth.authorize_access_token()
        except Exception as e:
            app.logger.error(f"OIDC authorization error: {str(e)}")
            return jsonify(
                {
                    "error": "An internal server error has occurred. Contact an administrator."
                }
            ), HTTPStatus.INTERNAL_SERVER_ERROR

        if not token:
            return jsonify({"error": "Invalid credentials"}), 401

        remember = session.get("remember", False)
        nonce = session.pop("oauth_nonce", None)

        student_data = oauth.kth.parse_id_token(token, nonce=nonce)

        if not student_data:
            return jsonify({"error": "Invalid credentials"}), 401

        session["student"] = student_data

        if not student_data.get("username"):
            return jsonify({"error": "Invalid response"}), 401

        student_email = student_data.get("username") + "@kth.se"

        student = Student.query.filter_by(email=student_email).one_or_none()
        filter = session.get("filter", DEFAULT_FILTER)

        if not student:
            student = Student(
                email=student_email,
                first_name=student_email,
            )

            db.session.add(student)
            db.session.commit()

        response = make_response({"student": student.to_dict(is_public_route=False)})
        expiration = timedelta(hours=1) if not remember else timedelta(days=14)
        try:
            permissions, role = get_student_authorization(student)
            committees, committee_positions = get_student_committee_details(
                student=student
            )

            exp_unix = int((datetime.now() + expiration).timestamp())
            response_dict = {
                "student": student.to_dict(is_public_route=False),
                "permissions": permissions,
                "role": role,
                "committees": committees,
                "committee_positions": committee_positions,
                "expiration": exp_unix,
            }

            if filter == "rgbank":
                attach_permissions(
                    committee_positions=committee_positions,
                    response_dict=response_dict,
                )

            response = make_response(response_dict)
        except Exception as e:
            app.logger.error(f"Error retrieving extra claims: {str(e)}")

        response.status_code = 302
        set_access_cookies(
            response=response,
            encoded_access_token=create_access_token(
                identity=student,
                fresh=timedelta(minutes=30) if not remember else timedelta(days=7),
                additional_claims=response_dict["rgbank_permissions"],
                expires_delta=timedelta(hours=1)
                if not remember
                else timedelta(days=14),
            ),
            max_age=expiration.total_seconds(),
        )
        return_url = session.pop("return_url", default=None)
        if return_url:
            response.headers.add("Location", f"https://www.medieteknik.com{return_url}")
        else:
            response.headers.add("Location", "https://www.medieteknik.com")

        return response
