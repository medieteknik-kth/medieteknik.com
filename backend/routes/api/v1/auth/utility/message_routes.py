import base64
from http import HTTPStatus
import json
from typing import Any, Dict, Tuple
from flask import Blueprint, request

from decorators.google_oidc import verify_google_oidc_token
from services.core.notifications import add_notification
from utility.logger import log_error


message_bp = Blueprint("message", __name__)


@message_bp.route("/process-tasks", methods=["POST"])
@verify_google_oidc_token("https://api.medieteknik.com/")
def process_tasks() -> Tuple[Dict[str, Any], int]:
    """
    Process deferred tasks from Pub/Sub.
    :return: Tuple[Dict[str, Any], int] - The response object and the status code.
    """

    if not request.is_json:
        return {"error": "Invalid request"}, HTTPStatus.BAD_REQUEST

    try:
        envelope = request.get_json()

        if not envelope or "message" not in envelope:
            return {"error": "Invalid request"}, HTTPStatus.BAD_REQUEST

        pubsub_message = envelope["message"]

        if "data" not in pubsub_message:
            return {"message": "No data!"}, HTTPStatus.NO_CONTENT

        message_data = json.loads(
            base64.b64decode(pubsub_message["data"]).decode("utf-8")
        )

        task_type = message_data.get("task_type")

        match task_type:
            case "add_notification":
                # TODO: Add notification
                add_notification(message_data)

                return {"message": "Notification added"}, HTTPStatus.OK
            case "send_discord_message":
                # handle_discord_message(message_data)

                return {"message": "Discord message sent"}, HTTPStatus.OK
            case _:
                return {
                    "error": "Invalid task type, not retrying"
                }, HTTPStatus.NO_CONTENT

    except Exception as e:
        log_error(f"Error processing Pub/Sub message: {str(e)}")

        return {"error": str(e)}, HTTPStatus.BAD_REQUEST
