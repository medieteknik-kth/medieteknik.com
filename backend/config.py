"""
The configuration for the backend.
"""

from datetime import timedelta
import os

SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
SQLALCHEMY_ECHO = True

SECRET_KEY = os.environ.get("SECRET_KEY", "secret")

WTF_CSRF_CHECK_DEFAULT = False

JWT_COOKIE_SECURE = False
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
JWT_TOKEN_LOCATION = ["cookies", "headers"]
JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

KTH_CLIENT_ID = os.environ.get("KTH_CLIENT_ID")
KTH_CLIENT_SECRET = os.environ.get("KTH_CLIENT_SECRET")
KTH_ACCESS_TOKEN_URL = "https://login.ug.kth.se/adfs/oauth2/token"
KTH_AUTHORIZE_URL = "https://login.ug.kth.se/adfs/oauth2/authorize"
KTH_API_BASE_URL = "https://app.kth.se/api/v.1.1"

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET")


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
    "google": {
        "client_id": GOOGLE_CLIENT_ID,
        "client_secret": GOOGLE_CLIENT_SECRET,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "userinfo_uri": "https://www.googleapis.com/oauth2/v3/userinfo",
        "issuer": "https://accounts.google.com",
        "redirect_uris": [
            "https://api.medieteknik.com/oidc",
        ],
    },
}
OIDC_CALLBACK_ROUTE = "/oidc"
