"""
The main application.
"""

import logging
import os
import secrets
import flask
import sqlalchemy
import werkzeug
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
from utility import db, jwt, oauth, csrf
from routes import register_v1_routes
from rich.logging import RichHandler


# Logging config
rich_handler = RichHandler(
    rich_tracebacks=True,
    tracebacks_width=100,
    tracebacks_code_width=None,
    tracebacks_extra_lines=3,
    tracebacks_show_locals=True,
    # Disable suppression temporarily to test
    tracebacks_suppress=[sqlalchemy, flask, werkzeug],
    show_time=False,
    show_level=False,
    show_path=False,
    markup=True,
)

logging.basicConfig(
    level=logging.INFO,
    format="[{asctime}] [bold red]{levelname}[/] {message}",
    style="{",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[rich_handler],
)

app = Flask(__name__)
app.config.from_object("config")

# Enable proxy support
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Enable CORS
CORS(
    app=app,
    supports_credentials=True,
    origins=[
        "http://localhost:3000",
        "https://www.medieteknik.com",
        # Allow all subdomains of medieteknik.com
        r"^https:\/\/.*\.medieteknik\.com$",
    ],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
    expose_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    vary_header=True,
    max_age=86400,
    automatic_options=True,
)

db.init_app(app)

# CSRF protection
csrf.init_app(app)

# Rate limiting for API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["1000/day", "300/hour", "10/second"],
    storage_uri=os.environ.get("REDIS_URL", "memory://"),
    strategy="fixed-window",
)

# Authorization
jwt.init_app(app)
oauth.init_app(app)
oauth.register(
    name="kth",
    client_id=app.config["KTH_CLIENT_ID"],
    client_secret=app.config["KTH_CLIENT_SECRET"],
    access_token_url=app.config["KTH_ACCESS_TOKEN_URL"],
    authorize_url=app.config["KTH_AUTHORIZE_URL"],
    server_metadata_url=app.config["KTH_DISCOVERY_URL"],
    authorize_redirect_uri="https://api.medieteknik.com/oidc",
    client_kwargs={
        "scope": "openid email",
        "access type": "offline",
        "response type": "code",
        "nonce": lambda: secrets.token_urlsafe(32),
    },
)

# Register routes (blueprints)
register_v1_routes(app)

werkzeug_logger = logging.getLogger("werkzeug")
werkzeug_logger.handlers.clear()
werkzeug_logger.addHandler(rich_handler)
werkzeug_logger.setLevel(logging.INFO)

app.logger.handlers.clear()
app.logger.addHandler(rich_handler)
app.logger.setLevel(logging.INFO)


# Reverse proxy
class ReverseProxied:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        environ["wsgi.url_scheme"] = "https"
        return self.app(environ, start_response)


if os.environ.get("FLASK_ENV") == "production":
    app.wsgi_app = ReverseProxied(app.wsgi_app)


if __name__ == "__main__":
    if os.environ.get("FLASK_ENV") == "development":
        app.run(debug=True)
    else:
        app.run()
