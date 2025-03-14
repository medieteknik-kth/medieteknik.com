"""
The main application.
"""

import logging
import os
import secrets
import sys
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from werkzeug.middleware.proxy_fix import ProxyFix
from utility import db, jwt, oauth, csrf
from routes import register_v1_routes

# Logging config
logging.basicConfig(
    level=logging.INFO,  # Change to DEBUG if needed
    format="[%(asctime)s] [%(levelname)s] %(caller_module)s#%(caller_function)s@%(caller_lineno)d: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)

app = Flask(__name__)
app.config.from_object("config")

# Enable proxy support
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Enable CORS
CORS(
    app=app,
    supports_credentials=True,
    origins=["http://localhost:3000", "https://www.medieteknik.com"],
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

app.logger.setLevel(logging.INFO)
werkzeug_logger = logging.getLogger("werkzeug")
werkzeug_logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)
werkzeug_logger.addHandler(handler)


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
