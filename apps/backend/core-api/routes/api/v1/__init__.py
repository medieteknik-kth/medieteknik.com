"""
v1 API Routes.

All routes are registered here via the `register_routes` function.
"""

import os
import secrets
import urllib
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from typing import Annotated, Any, Dict

import msgspec
from fastapi import Depends, FastAPI, HTTPException, Query, Request, Response, logger
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlmodel import select, text

from config import Settings
from decorators.csrf_protection import csrf_protected
from decorators.jwt import get_jwt_identity, jwt_required
from dto.core.student import LoginDTO
from errors.InvalidJWTToken import InvalidJWTTokenException
from models.core.student import Student
from models.utility.auth import RevokedTokens
from routes.api.deps import SessionDep
from services.apps.rgbank.permission_service import attach_permissions
from services.core.student import login
from services.utility.auth import (
    get_student_authorization,
    get_student_committee_details,
)
from utility.authorization import oauth
from utility.constants import (
    DEFAULT_FILTER,
    DEFAULT_LANGUAGE_CODE,
    POSSIBLE_FILTERS,
    PROTECTED_PATH,
    PUBLIC_PATH,
    ROUTES,
)
from utility.jwt import create_jwt, decode_jwt, revoke_jwt


def register_v1_routes(app: FastAPI):
    """
    Register all routes for the backend.

    Args:
        app (Flask): The Flask app.
    """
    # Public Routes

    # Protected Routes
    from .auth import (
        album_bp,
        calendar_bp,
        committee_bp,
        committee_position_bp,
        documents_bp,
        events_bp,
        media_bp,
        message_bp,
        news_bp,
        scheduler_bp,
        student_bp,
        tasks_bp,
    )
    from .public import (
        public_album_bp,
        public_bp,
        public_calendar_bp,
        public_committee_bp,
        public_committee_category_bp,
        public_committee_position_bp,
        public_documents_bp,
        public_media_bp,
        public_news_bp,
        public_student_bp,
    )

    # Public Routes
    def register_public_routes():
        """Register all public routes."""
        app.register_blueprint(public_bp, url_prefix=f"{PUBLIC_PATH}")
        app.register_blueprint(
            public_committee_category_bp,
            url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEE_CATEGORIES.value}",
        )
        app.register_blueprint(public_calendar_bp, url_prefix=f"{PUBLIC_PATH}/calendar")
        app.register_blueprint(
            public_committee_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEES.value}"
        )
        app.register_blueprint(
            public_committee_position_bp,
            url_prefix=f"{PUBLIC_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}",
        )
        app.register_blueprint(
            public_student_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.STUDENTS.value}"
        )
        app.register_blueprint(
            public_news_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.NEWS.value}"
        )
        app.register_blueprint(
            public_documents_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.DOCUMENTS.value}"
        )
        app.register_blueprint(
            public_media_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.MEDIA.value}"
        )
        app.register_blueprint(
            public_album_bp, url_prefix=f"{PUBLIC_PATH}/{ROUTES.ALBUMS.value}"
        )

    # Protected Routes
    def register_protected_routes():
        """Register all routes with the protected prefix, requiring authentication."""
        app.register_blueprint(calendar_bp, url_prefix=f"{PROTECTED_PATH}/calendar")
        app.register_blueprint(
            committee_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEES.value}"
        )
        app.register_blueprint(
            committee_position_bp,
            url_prefix=f"{PROTECTED_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}",
        )
        app.register_blueprint(
            news_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.NEWS.value}"
        )
        app.register_blueprint(
            events_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.EVENTS.value}"
        )
        app.register_blueprint(
            documents_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.DOCUMENTS.value}"
        )
        app.register_blueprint(
            media_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.MEDIA.value}"
        )
        app.register_blueprint(
            album_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.ALBUMS.value}"
        )
        app.register_blueprint(
            student_bp, url_prefix=f"{PROTECTED_PATH}/{ROUTES.STUDENTS.value}"
        )
        app.register_blueprint(scheduler_bp, url_prefix=f"{PROTECTED_PATH}/scheduler")

        app.register_blueprint(message_bp, url_prefix=f"{PROTECTED_PATH}/messages")

        app.register_blueprint(tasks_bp, url_prefix=f"{PROTECTED_PATH}/tasks")

    # RGBank Routes
    def register_rgbank_routes():
        """Register all routes with the rgbank prefix"""
        from ..apps.rgbank import (
            account_router,
            expense_domain_router,
            expense_router,
            invoice_router,
            public_expense_domain_router,
            public_statistics_router,
            rgbank_permissions_router,
            statistics_router,
        )

        app.include_router(
            router=account_router,
        )
        app.include_router(
            router=expense_domain_router,
        )
        app.include_router(
            router=expense_router,
        )
        app.include_router(
            router=invoice_router,
        )
        app.include_router(
            router=rgbank_permissions_router,
        )
        app.include_router(
            router=public_expense_domain_router,
        )
        app.include_router(
            router=public_statistics_router,
        )
        app.include_router(
            router=statistics_router,
        )

    # Register all routes
    register_public_routes()
    register_protected_routes()
    register_rgbank_routes()

    @app.middleware("http")
    async def add_headers(request: Request):
        response: Response = Response()
        response.headers["Content-Security-Policy"] = (
            "default-src none; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; font-src 'self'; frame-src 'self'; object-src 'none';"
        )
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "same-origin"

        # If public route, set cache control to 10 minutes if not already set
        if request.path.startswith(f"{PUBLIC_PATH}") and not response.headers.get(
            "Cache-Control"
        ):
            response.headers["Cache-Control"] = "public, max-age=60"  # 1 minute
        elif request.path.startswith(f"{PROTECTED_PATH}") and not response.headers.get(
            "Cache-Control"
        ):
            response.headers["Cache-Control"] = (
                "private, no-store, no-cache, must-revalidate"
            )

        if os.environ.get("ENV") != "development":
            response.headers["Strict-Transport-Security"] = (
                "max-age=3600; includeSubDomains;"
            )
        return response

    @app.middleware("http")
    async def refresh_jwt(session: SessionDep, request: Request, call_next):
        response: Response = await call_next(request)
        jwt_token = request.cookies.get(Settings.JWT_COOKIE_NAME)

        if not jwt_token:
            return response

        try:
            jwt = decode_jwt(
                token=jwt_token,
                session=session,
            )
            exp_timestamp = jwt["exp"]
            now = datetime.now(timezone.utc)
            remember = request.session.get("remember", False)

            target_timestamp = (
                datetime.timestamp(now + timedelta(minutes=30))
                if not remember
                else datetime.timestamp(now + timedelta(days=1))
            )
            # If the token is about to expire, refresh it
            if target_timestamp > exp_timestamp:
                student_id = get_jwt_identity(jwt)
                filter = request.session.get("filter", DEFAULT_FILTER)

                student = session.exec(
                    select(Student).where(Student.student_id == student_id)
                ).one_or_none()

                if not student:
                    raise HTTPException(
                        status_code=HTTPStatus.UNAUTHORIZED,
                        detail="Invalid student",
                    )
                expiration = timedelta(hours=1) if not remember else timedelta(days=14)
                _, committee_positions = get_student_committee_details(student=student)

                response_dict = {}

                if filter == "rgbank":
                    attach_permissions(
                        committee_positions=committee_positions,
                        response_dict=response_dict,
                    )

                jwt_token = create_jwt(
                    subject=student.student_id,
                    expires_delta=expiration,
                    additional_claims=response_dict["rgbank_permissions"]
                    if filter == "rgbank"
                    else None,
                )

                response.set_cookie(
                    key=Settings.JWT_COOKIE_NAME,
                    domain=Settings.JWT_COOKIE_DOMAIN,
                    httponly=True,
                    secure=Settings.JWT_COOKIE_SECURE,
                    expires=timedelta(hours=1) if not remember else timedelta(days=14),
                    samesite="strict",
                    path="/",
                    value=jwt_token,
                    max_age=expiration.total_seconds(),
                )

        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original respone
            pass

        return response

    @app.exception_handler(InvalidJWTTokenException)
    async def invalid_token_callback(
        request: Request, exc: InvalidJWTTokenException
    ) -> Response:
        """
        Callback for invalid token.
        """
        response = JSONResponse(
            content={"message": f"{exc.message}"},
        )
        response.delete_cookie(
            key=Settings.JWT_COOKIE_NAME,
            domain=Settings.JWT_COOKIE_DOMAIN,
            httponly=True,
            secure=Settings.JWT_COOKIE_SECURE,
            samesite="strict",
            path="/",
        )
        response.status_code = HTTPStatus.UNAUTHORIZED

        return response

    @app.exception_handler(msgspec.ValidationError)
    async def validation_exception_handler(request, exc):
        return JSONResponse(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY, content={"detail": str(exc)}
        )

    # Non-Specific Routes / Auth

    @app.get(
        "/api/v1/uptime",
        status_code=HTTPStatus.OK,
    )
    def uptime():
        """
        Uptime route.
        """
        return JSONResponse(
            status_code=HTTPStatus.OK,
            content={"status": "ok"},
        )

    @app.get(
        "/api/v1/health",
        responses={
            HTTPStatus.OK: {"description": "Healthy"},
            HTTPStatus.INTERNAL_SERVER_ERROR: {"description": "Unhealthy"},
        },
    )
    async def health(session: SessionDep):
        """
        Health route.
        """
        health_status = {"status": "healthy"}

        try:
            session.exec(text("SELECT 1"))
            health_status["database"] = "healthy"
        except Exception as e:
            health_status["status"] = "unhealthy"
            health_status["database"] = "unavailable"
            health_status["error"] = str(e)

        return JSONResponse(
            content=health_status,
            status_code=HTTPStatus.OK
            if health_status["status"] == "healthy"
            else HTTPStatus.INTERNAL_SERVER_ERROR,
        )

    @app.get(
        "/api/v1/csrf-token",
        response_model=BaseModel({"token": str}),
    )
    async def get_csrf_token(request: Request):
        token = request.session.get("csrf_token")
        if not token:
            new_token = secrets.token_urlsafe(32)
            request.session["csrf_token"] = new_token
            return new_token
        return token

    @app.post(
        "/api/v1/login",
        responses={
            HTTPStatus.UNAUTHORIZED: {"description": "Invalid credentials"},
            HTTPStatus.BAD_REQUEST: {"description": "No data provided"},
            HTTPStatus.OK: {"description": "Logged in"},
        },
    )
    async def login_credentials(
        request: Request,
        data: LoginDTO,
        filter: Annotated[str, Query(title="App Filter")] = "app",
        language: Annotated[
            str | None, Query(title="Language")
        ] = DEFAULT_LANGUAGE_CODE,
        _=Depends(csrf_protected),
    ):
        """
        Logs in a student
            :return: Response - The response object, 401 if the credentials are invalid, 400 if no data is provided, 200 if successful
        """

        if filter not in POSSIBLE_FILTERS:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Invalid filter. Possible filters: rgbank, app",
            )

        request.session["filter"] = filter

        return login(data=data, provided_languages=[language], filter=filter)

    @app.delete(
        "/api/v1/logout",
        responses={
            HTTPStatus.OK: {"description": "No token to revoke"},
            HTTPStatus.NO_CONTENT: {"description": "Token revoked"},
        },
    )
    async def logout(
        session: SessionDep,
        jwt: Dict[str, Any] = Depends(jwt_required),
        _=Depends(csrf_protected),
    ):
        """
        Logs out a student
            :return: Response - The response object, 200 if successful
        """

        jti = jwt["jti"]

        if not jti:
            return Response(
                status_code=HTTPStatus.OK,
                content="No token to revoke",
            )

        revoked_token = RevokedTokens(
            jti=jti,
            originally_valid_until=datetime.fromtimestamp(jwt["exp"]),
        )

        revoke_jwt(token=jwt, session=session)

        session.add(revoked_token)
        session.commit()

        return Response(
            status_code=HTTPStatus.NO_CONTENT,
        )

    @app.get(
        "/auth",
        responses={
            HTTPStatus.BAD_REQUEST: {"description": "No data provided"},
            HTTPStatus.OK: {"description": "Logged in"},
        },
    )
    def auth(
        request: Request,
        filter: Annotated[str, Query(title="App Filter")] = "app",
        remember: Annotated[bool, Query(title="Remember Me")] = False,
        return_url: Annotated[str, Query(title="Return URL")] = "/",
    ):
        """
        OAuth route for KTH login. First step in the OAuth flow. See the /oidc route for the second step.
        """
        nonce = secrets.token_urlsafe(32)

        if filter not in POSSIBLE_FILTERS:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Invalid filter. Possible filters: rgbank, app",
            )

        return_url = urllib.parse.quote(return_url)
        request.session["filter"] = filter
        request.session["return_url"] = return_url
        request.session["remember"] = remember
        request.session["oauth_nonce"] = nonce

        redirect_uri = request.url_for(
            "oidc",
            _external=True,
        )
        return oauth.kth.authorize_redirect(redirect_uri, nonce=nonce)

    @app.get("/oidc")
    def oidc(
        session: SessionDep,
        request: Request,
    ) -> Response:
        """
        OIDC route for KTH login. Second step in the OAuth flow, after the /auth route.
        """
        try:
            token = oauth.kth.authorize_access_token()
        except Exception as e:
            logger.logger.error(f"OIDC authorization error: {str(e)}")
            raise HTTPException(
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
                detail="Authorization failed",
            )

        if not token:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Invalid credentials",
            )

        remember = request.session.get("remember", False)
        nonce = request.session.pop("oauth_nonce", None)

        student_data = oauth.kth.parse_id_token(token, nonce=nonce)

        if not student_data:
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Invalid credentials",
            )

        request.session["student"] = student_data

        if not student_data.get("username"):
            raise HTTPException(
                status_code=HTTPStatus.UNAUTHORIZED,
                detail="Invalid credentials",
            )

        student_email = student_data.get("username") + "@kth.se"

        student = session.exec(
            select(Student).where(Student.email == student_email)
        ).one_or_none()

        if not student:
            student = Student(
                email=student_email,
                first_name=student_email,
            )

            session.add(student)
            session.commit()
            session.refresh(student)

        filter = request.session.get("filter", DEFAULT_FILTER)

        response = JSONResponse()
        expiration = timedelta(hours=1) if not remember else timedelta(days=14)
        try:
            permissions, role = get_student_authorization(student)
            committees, committee_positions = get_student_committee_details(
                student=student
            )

            exp_unix = int((datetime.now() + expiration).timestamp())
            response_dict = {
                "student": student,
                "permissions": permissions,
                "role": role,
                "committees": committees,
                "committee_positions": committee_positions,
                "expiration": exp_unix,
            }

            if filter == "rgbank":
                attach_permissions(
                    committee_positions=committee_positions,
                    response_dict=response_dict,
                )
        except Exception as e:
            app.logger.error(f"Error retrieving extra claims: {str(e)}")

        response.status_code = HTTPStatus.FOUND
        response.body = jsonable_encoder(response_dict)
        response.headers["Content-Type"] = "application/json"
        jwt_token = create_jwt(
            subject=student.student_id,
            expires_delta=expiration,
            additional_claims=response_dict["rgbank_permissions"]
            if filter == "rgbank"
            else None,
        )

        response.set_cookie(
            key=Settings.JWT_COOKIE_NAME,
            domain=Settings.JWT_COOKIE_DOMAIN,
            httponly=True,
            secure=Settings.JWT_COOKIE_SECURE,
            expires=timedelta(hours=1) if not remember else timedelta(days=14),
            samesite="strict",
            path="/",
            value=jwt_token,
            max_age=expiration.total_seconds(),
        )

        return_url = session.pop("return_url", default=None)
        if return_url:
            response.headers.append(
                "Location", f"https://www.medieteknik.com{return_url}"
            )
        else:
            response.headers.append("Location", "https://www.medieteknik.com")

        return response
