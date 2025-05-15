"""
The main application.
"""

import logging
import os
import secrets

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from rich.logging import RichHandler
from starlette.middleware.sessions import SessionMiddleware
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware

from config import Settings
from routes import register_v1_routes
from utility import oauth

# Logging config
rich_handler = RichHandler(
    rich_tracebacks=True,
    tracebacks_width=100,
    tracebacks_code_width=None,
    tracebacks_extra_lines=3,
    tracebacks_show_locals=True,
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

app = FastAPI(
    title="Medieteknik API",
    description="API for Medieteknik",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://www.medieteknik.com",
        # Allow all subdomains of medieteknik.com
        r"^https:\/\/.*\.medieteknik\.com$",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-CSRF-Token"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=86400,
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "*.medieteknik.com",
    ],
)

app.add_middleware(
    middleware_class=GZipMiddleware,
    minimum_size=1024,  # Compress responses larger than 1KB
    compresslevel=6,  # Compression level (1-9)
)
app.add_middleware(SessionMiddleware, secret_key=Settings.SECRET_KEY)

if Settings.ENV != "development":
    app.add_middleware(
        ProxyHeadersMiddleware,
        trusted_hosts=[
            "localhost",
            "*.medieteknik.com",
        ],
    )

    app.add_middleware(HTTPSRedirectMiddleware)


# Authorization
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


if __name__ == "__main__":
    if os.environ.get("ENV") == "development":
        app.run(debug=True)
    else:
        app.run()
