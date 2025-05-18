"""
Task Routes (Protected), for GCP Cloud Tasks
API Endpoint: '/api/v1/tasks'
"""

from http import HTTPStatus

from fastapi import APIRouter, Depends, HTTPException, Request, Response, logger

from config import Settings
from decorators.google_oidc import verify_google_audience_token
from routes.api.deps import SessionDep
from services.utility.discord import send_discord_message

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "/tasks",
    tags=["Committees"],
)


@router.post("/schedule-news")
def schedule_messages(
    session: SessionDep,
    request: Request,
    _=Depends(verify_google_audience_token(audience="https://api.medieteknik.com")),
):
    data = request.get_json()
    success, message = send_discord_message(session=session, message_data=data)

    if not success:
        logger.logger.exception("Failed to send message to Discord: %s", message)
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="Failed to send message to Discord",
        )

    return Response(
        content="Message scheduled successfully",
        status_code=HTTPStatus.OK,
    )
