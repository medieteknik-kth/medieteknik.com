"""
Message Routes (Protected), for GCP Pub/Sub
API Endpoint: '/api/v1/message'
"""

import base64
import json
from http import HTTPStatus
from typing import Any, Dict, Tuple

from flask import Blueprint, request

from decorators.google_oidc import verify_google_oidc_token
from services.core.notifications import add_notification
from services.utility.discord import send_discord_message

message_bp = Blueprint("message", __name__)


@message_bp.route("/process-tasks", methods=["POST"])
@verify_google_oidc_token("https://api.medieteknik.com")
def process_tasks() -> Tuple[Dict[str, Any], int]:
    """
    Process deferred tasks from Pub/Sub.
    :return: Tuple[Dict[str, Any], int] - The response object and the status code.
    """

    if not request.is_json:
        return {"error": "Invalid request"}, HTTPStatus.NO_CONTENT

    try:
        envelope = request.get_json()

        if not envelope or "message" not in envelope:
            print("Envelope:", envelope)
            return {"error": "Invalid request"}, HTTPStatus.NO_CONTENT

        pubsub_message = envelope["message"]

        if "data" not in pubsub_message:
            print("Pub/Sub:", pubsub_message)
            return {"message": "No data!"}, HTTPStatus.NO_CONTENT

        message_data = json.loads(
            base64.b64decode(pubsub_message["data"]).decode("utf-8")
        )

        task_type = message_data.get("task_type")

        match task_type:
            case "test":
                print("Message data:", message_data)
                return {"message": "Test successful!"}, HTTPStatus.OK

            case "send_notification":
                add_notification(message_data)

                return {"message": "Notification added"}, HTTPStatus.OK
            case "send_discord_message":
                success, message = send_discord_message(message_data)

                if not success:
                    return {"error": message}, HTTPStatus.NO_CONTENT

                return {"message": "Discord message sent"}, HTTPStatus.OK

            case "upload_to_instagram":
                # upload_to_instagram(message_data)

                return {"message": "Uploaded to Instagram"}, HTTPStatus.OK

            case _:
                return {
                    "error": "Invalid task type, not retrying"
                }, HTTPStatus.NO_CONTENT

    except Exception as e:
        log_error(f"Error processing Pub/Sub message: {str(e)}")

        return {"error": str(e)}, HTTPStatus.NO_CONTENT  # Do not retry
