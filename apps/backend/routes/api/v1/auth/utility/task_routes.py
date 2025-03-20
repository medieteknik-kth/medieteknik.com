"""
Task Routes (Protected), for GCP Cloud Tasks
API Endpoint: '/api/v1/tasks'
"""

from http import HTTPStatus
from flask import Blueprint, request
from decorators.google_oidc import verify_google_oidc_token
from services.utility.discord import send_discord_message


tasks_bp = Blueprint("tasks", __name__)


@tasks_bp.route("/schedule-news", methods=["POST"])
@verify_google_oidc_token("https://api.medieteknik.com")
def schedule_messages():
    data = request.get_json()
    success, message = send_discord_message(data)

    if not success:
        return {"error": message}, HTTPStatus.INTERNAL_SERVER_ERROR
    return {}, HTTPStatus.NO_CONTENT
