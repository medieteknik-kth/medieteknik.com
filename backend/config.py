"""
The configuration for the backend.
"""

import os

SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
SQLALCHEMY_ECHO = True

KTH_CLIENT_ID = os.environ.get("KTH_CLIENT_ID")
KTH_CLIENT_SECRET = os.environ.get("KTH_CLIENT_SECRET")
KTH_ACCESS_TOKEN_URL = "https://login.ug.kth.se/adfs/oauth2/token"
KTH_AUTHORIZE_URL = "https://login.ug.kth.se/adfs/oauth2/authorize"
KTH_API_BASE_URL = "https://app.kth.se/api/v.1.1"

OIDC_CLIENT_SECRETS = {
    "web": {
        "client_id": KTH_CLIENT_ID,
        "client_secret": KTH_CLIENT_SECRET,
        "auth_uri": KTH_AUTHORIZE_URL,
        "token_uri": KTH_ACCESS_TOKEN_URL,
        "userinfo_uri": "https://login.ug.kth.se/adfs/userinfo",
        "issuer": "https://login.ug.kth.se/adfs",
        "redirect_uris": [
            "https://api.medieteknik.com/oidc",
        ],
    }
}
OIDC_CALLBACK_ROUTE = "/oidc"
