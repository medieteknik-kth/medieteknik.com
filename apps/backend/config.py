"""
The configuration for the backend. Contains the environment variables and settings for the application.
"""

import os
from datetime import timedelta

# App
FLASK_ENV = os.environ.get("FLASK_ENV", "development")
PREFERRED_URL_SCHEME = (
    "https" if os.environ.get("FLASK_ENV") == "production" else "http"
)
SESSION_COOKIE_SECURE = True if os.environ.get("FLASK_ENV") == "production" else False

# Database
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
SQLALCHEMY_ECHO = True if os.environ.get("SQLALCHEMY_ECHO") == "True" else False

# Security
SECRET_KEY = os.environ.get("SECRET_KEY")

# CSRF
WTF_CSRF_CHECK_DEFAULT = False
JWT_COOKIE_CSRF_PROTECT = False

# JWT
JWT_COOKIE_SECURE = True if os.environ.get("FLASK_ENV") == "production" else False
JWT_TOKEN_LOCATION = ["cookies"]
JWT_COOKIE_DOMAIN = (
    ".medieteknik.com" if os.environ.get("FLASK_ENV") == "production" else "localhost"
)
JWT_SESSION_COOKIE = False
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

# OAuth
KTH_CLIENT_ID = os.environ.get("KTH_CLIENT_ID")
KTH_CLIENT_SECRET = os.environ.get("KTH_CLIENT_SECRET")
KTH_ACCESS_TOKEN_URL = "https://login.ug.kth.se/adfs/oauth2/token"
KTH_AUTHORIZE_URL = "https://login.ug.kth.se/adfs/oauth2/authorize"
KTH_API_BASE_URL = "https://app.kth.se/api/v.1.1"
KTH_DISCOVERY_URL = "https://login.ug.kth.se/adfs/.well-known/openid-configuration"
