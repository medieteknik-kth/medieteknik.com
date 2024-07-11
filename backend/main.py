"""
The main application.
"""

from datetime import datetime, timedelta
import os

from flask import Flask, jsonify, url_for, session, request, make_response
from flask_cors import CORS
from flask_jwt_extended import (
    create_access_token,
    get_jwt,
    get_jwt_identity,
    set_access_cookies,
)
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import generate_csrf
from utility.database import db
from utility.constants import API_VERSION, ROUTES
from utility.authorization import jwt, oauth, oidc
from utility.csrf import csrf
from routes import register_routes

app = Flask(__name__)
app.config.from_object("config")

# Enable CORS
CORS(
    app=app,
    supports_credentials=True,
    origins=["http://localhost:3000", "https://medieteknik.com"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
    expose_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    max_age=86400,
)

db.init_app(app)

# CSRF protection
csrf.init_app(app)

# Rate limiting for API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["1000 per day", "500 per hour"],
    storage_uri=os.environ.get("REDIS_URL", "memory://"),
)

# Authorization
jwt.init_app(app)
oauth.init_app(app)
oauth.register(
    "kth",
    kwargs={
        "scope": "openid email",
        "access type": "offline",
        "response type": "token",
    },
)
oauth.register(
    "google",
    kwargs={
        "scope": "openid email profile",
        "access type": "offline",
        "response type": "code",
    },
)

# OIDC
# oidc.init_app(app)

# Register routes (blueprints)
register_routes(app)


@app.before_request
def handle_preflight():
    """
    Handle CORS preflight requests.
    """
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add(
            "Access-Control-Allow-Headers", "Content-Type,Authorization,X-CSRF-Token"
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
            access_token = create_access_token(identity=get_jwt_identity())
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


@app.route("/csrf-token")
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


if __name__ == "__main__":
    app.run(debug=True)
