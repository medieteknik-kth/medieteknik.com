"""
The configuration for the backend. Contains the environment variables and settings for the application.
"""

import os
from datetime import timedelta

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_ROUTE_PREFIX: str = "/api/v1"

    # App
    ENV = os.environ.get("ENV", "development")
    PREFERRED_URL_SCHEME = "https" if ENV == "production" else "http"
    SESSION_COOKIE_SECURE = True if ENV == "production" else False
    RECEPTION_MODE = os.environ.get("RECEPTION_MODE") == "True"

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    SQLALCHEMY_ECHO = os.environ.get("SQLALCHEMY_ECHO") == "True"

    # Security
    SECRET_KEY = os.environ.get("SECRET_KEY")

    # CSRF
    WTF_CSRF_CHECK_DEFAULT = False
    JWT_COOKIE_CSRF_PROTECT = False

    # Session
    SESSION_COOKIE_NAME = "session"

    # JWT
    JWT_COOKIE_SECURE = ENV == "production"
    JWT_COOKIE_NAME = "access_token_cookie"
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_DOMAIN = ".medieteknik.com" if ENV == "production" else None
    JWT_SESSION_COOKIE = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)

    # OAuth
    KTH_CLIENT_ID = os.environ.get("KTH_CLIENT_ID")
    KTH_CLIENT_SECRET = os.environ.get("KTH_CLIENT_SECRET")
    KTH_ACCESS_TOKEN_URL = "https://login.ug.kth.se/adfs/oauth2/token"
    KTH_AUTHORIZE_URL = "https://login.ug.kth.se/adfs/oauth2/authorize"
    KTH_API_BASE_URL = "https://app.kth.se/api/v.1.1"
    KTH_DISCOVERY_URL = "https://login.ug.kth.se/adfs/.well-known/openid-configuration"


settings = Settings()
