"""
The main application.
"""

import os
from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from utility.database import db
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

if __name__ == "__main__":
    app.run(debug=True)
