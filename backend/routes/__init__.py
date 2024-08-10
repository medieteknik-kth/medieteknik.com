"""
Routes for the backend.

All routes are registered here via the `register_routes` function.
"""

from datetime import datetime, timedelta
from flask import Flask, jsonify, make_response, request, session, url_for
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
)
from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.core.student import Student, StudentMembership
from services.core.student import get_permissions
from utility.constants import API_VERSION, PROTECTED_PATH, PUBLIC_PATH, ROUTES
from flask_wtf.csrf import generate_csrf
from utility.authorization import oauth


def register_routes(app: Flask):
    """
    Register all routes for the backend.

    Args:
        app (Flask): The Flask app.
    """
    from .public.committee_routes import (
        public_committee_bp,
        public_committee_category_bp,
        public_committee_position_bp,
    )
    from .public.calendar_routes import public_calendar_bp
    from .public.dynamic_routes import public_dynamic_routes_bp
    from .public.general_routes import public_bp
    from .public.item_routes import (
        public_news_bp,
        public_events_bp,
        public_documents_bp,
        public_albums_bp,
    )
    from .public.student_routes import public_student_bp
    from .calendar_routes import calendar_bp
    from .committee_routes import committee_bp
    from .author_routes import author_bp
    from .news_routes import news_bp
    from .event_routes import events_bp
    from .document_routes import documents_bp
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
    app.register_blueprint(calendar_bp, url_prefix=f"{PROTECTED_PATH}/calendar")
    app.register_blueprint(
        committee_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEES.value}"
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
            response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
            response.headers.add(
                "Access-Control-Allow-Headers",
                "Content-Type,Authorization,X-CSRF-Token",
            )
            response.headers.add("Access-Control-Allow-Credentials", "true")
            response.headers.add(
                "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
            )
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

                access_token = create_access_token(identity=student, fresh=False)
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
        if "csrf_token" not in session:
            session["csrf_token"] = generate_csrf()
        return jsonify({"token": session["csrf_token"]})

    @app.route("/oauth/kth/login")
    def kth_login():
        """
        Login route.
        """
        redirect_uri = url_for("auth", _external=True)

        if not oauth.kth:
            return "OAuth not configured", 500

        return oauth.kth.authorize_redirect("https://api.medieteknik.com/oidc")

    @app.route("/auth")
    def auth():
        """
        Auth route.
        """
        if not oauth.kth:
            return "OAuth not configured", 500

        token = oauth.kth.authorize_access_token()
        user = oauth.kth.parse_id_token(token)
        session["user"] = user
        return token
