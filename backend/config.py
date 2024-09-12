"""
The configuration for the backend.
"""

from datetime import timedelta
import os

# App
PREFERRED_URL_SCHEME = (
    "https" if os.environ.get("FLASK_ENV", "development") == "production" else "http"
)
SESSION_COOKIE_SECURE = (
    True if os.environ.get("FLASK_ENV", "development") == "production" else False
)

# Database
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
SQLALCHEMY_ECHO = True if os.environ.get("SQLALCHEMY_ECHO") == "True" else False

# Security
SECRET_KEY = os.environ.get("SECRET_KEY")

# CSRF
WTF_CSRF_CHECK_DEFAULT = False
JWT_COOKIE_CSRF_PROTECT = False

# JWT
JWT_COOKIE_SECURE = (
    True if os.environ.get("FLASK_ENV", "development") == "production" else False
)
JWT_TOKEN_LOCATION = ["cookies"]
JWT_COOKIE_DOMAIN = (
    ".medieteknik.com"
    if os.environ.get("FLASK_ENV", "development") == "production"
    else "localhost"
)
JWT_SESSION_COOKIE = False
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

# OAuth
KTH_CLIENT_ID = os.environ.get("KTH_CLIENT_ID")
KTH_CLIENT_SECRET = os.environ.get("KTH_CLIENT_SECRET")
KTH_ACCESS_TOKEN_URL = "https://login.ug.kth.se/adfs/oauth2/token"
KTH_AUTHORIZE_URL = "https://login.ug.kth.se/adfs/oauth2/authorize"
KTH_API_BASE_URL = "https://app.kth.se/api/v.1.1"
KTH_DISCOVERY_URL = "https://login.ug.kth.se/adfs/.well-known/openid-configuration"

# OIDC
OIDC_OVERWRITE_REDIRECT_URI = "https://api.medieteknik.com/oidc"
OIDC_CLIENT_SECRETS = {
    "kth": {
        "client_id": KTH_CLIENT_ID,
        "client_secret": KTH_CLIENT_SECRET,
        "auth_uri": KTH_AUTHORIZE_URL,
        "token_uri": KTH_ACCESS_TOKEN_URL,
        "userinfo_uri": "https://login.ug.kth.se/adfs/userinfo",
        "issuer": "https://login.ug.kth.se/adfs",
        "redirect_uris": [
            "https://api.medieteknik.com/oidc",
        ],
    },
}
