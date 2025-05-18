"""
Messages Service
"""

import enum
import json
from datetime import datetime
from os import environ
from typing import Any, Dict, List
from uuid import UUID
from utility.gc import publisher, topic_path
from utility.logger import log_error


class UuidDatetimeJSONEncoder(json.JSONEncoder):
    def default(self, o):
        # Handle UUID and datetime objects
        if isinstance(o, UUID):
            return str(o)
        if isinstance(o, datetime):
            return o.isoformat()
        return super().default(o)


class TopicType(enum.Enum):
    """Enum class for the topic types."""

    NEWS = 0
    EVENT = 1
    UPDATE = 2  # NOTE: Rarely used, should be done manually unless you can automate it


def send_discord_topic(type: TopicType, topic_data: Dict[str, Any]) -> None:
    """Send a Pub/Sub message to handle discord messages. See handle_discord_topic on how to handle the message.

    :param type: The topic type.
    :type type: TopicType
    :param topic_data: The topic data.
    :type topic_data: Dict[str, Any]
    """
    from services.utility.discord import send_discord_message

    if environ.get("DISCORD_WEBHOOK_URL") is None:
        return

    discord_task_data = {
        "task_type": "send_discord_message",
        "message_type": type.name,
        "message_data": {},
    }

    match type:
        case TopicType.NEWS:
            if (
                "url" not in topic_data
                or "author_name" not in topic_data
                or "news_id" not in topic_data
            ):
                log_error("Missing data (url, author_name or author_icon)")
                return

            discord_task_data["message_data"] = {
                "url": topic_data["url"],
                "news_id": topic_data["news_id"],
                "author": {
                    "name": topic_data["author_name"],
                },
            }

        case TopicType.EVENT:
            if (
                "title" not in topic_data
                or "description" not in topic_data
                or "location" not in topic_data
                or "start_date" not in topic_data
                or "end_date" not in topic_data
                or "author_name" not in topic_data
                or "author_url" not in topic_data
                or "event_id" not in topic_data
            ):
                log_error(
                    "Missing data (title, description, location, start_date, end_date, author_name, author_url or author_icon)",
                )
                return

            discord_task_data["message_data"] = {
                "event_id": topic_data["event_id"],
                "title": topic_data["title"],
                "description": topic_data["description"],
                "location": topic_data["location"],
                "start_date": topic_data["start_date"],
                "end_date": topic_data["end_date"],
                "author": {
                    "name": topic_data["author_name"],
                    "url": topic_data["author_url"],
                },
            }

        case TopicType.UPDATE:
            if (
                "title" not in topic_data
                or "timestamp" not in topic_data
                or "se_description" not in topic_data
                or "en_description" not in topic_data
            ):
                log_error(
                    "Missing data (title, timestamp, se_description or en_description)",
                )
                return

            discord_task_data["message_data"] = {
                "title": topic_data["title"],  # Should be 0.1.0
                "timestamp": topic_data[
                    "timestamp"
                ],  # Should be 2025-03-14T21:00:00.000Z
                "description": {
                    "se": topic_data["se_description"],
                    "en": topic_data["en_description"],
                },
            }

        case _:
            return

    message_data = json.dumps(discord_task_data, cls=UuidDatetimeJSONEncoder).encode(
        "utf-8"
    )

    if environ.get("ENV") == "production":
        try:
            publisher.publish(topic=topic_path, data=message_data)
        except Exception as e:
            print(f"Error: {e}")
    else:
        success, message = send_discord_message(discord_task_data)

        if not success:
            log_error(f"Failed to send Discord message: {message}")


def send_notification_topic(type: TopicType, topic_data: Dict[str, Any]) -> None:
    """Send a Pub/Sub message to handle notifications. See handle_notification_topic on how to handle the message.

    :param type: The topic type.
    :type type: TopicType
    :param topic_data: The topic data.
    :type topic_data: Dict[str, Any]
    """
    from services.core.notifications import add_notification

    if environ.get("DISCORD_WEBHOOK_URL") is None:
        return

    notification_data = {
        "task_type": "send_notification",
        "message_type": type.name,
        "message_data": {},
    }

    if "notification_type" not in topic_data or "translations" not in topic_data:
        log_error("Missing data (notification_type or notification_metadata)")
        return

    notification_type = topic_data["notification_type"]
    translations: List[Dict[str, Any]] = topic_data["translations"]
    notification_metadata = topic_data.get("metadata", None)
    committee_id = topic_data.get("committee_id", None)
    event_id = topic_data.get("event_id", None)
    news_id = topic_data.get("news_id", None)

    for translation in translations:
        if (
            "language_code" not in translation
            or "body" not in translation
            or "title" not in translation
            or "url" not in translation
        ):
            log_error("Missing data (language_code, title or message)")
            return

    notification_data["message_data"] = {
        "notification_type": notification_type,
        "translations": translations,
        "notification_metadata": notification_metadata,
        "committee_id": committee_id,
        "event_id": event_id,
        "news_id": news_id,
    }

    message_data = json.dumps(notification_data, cls=UuidDatetimeJSONEncoder).encode(
        "utf-8"
    )

    if environ.get("ENV") == "production":
        try:
            publisher.publish(topic=topic_path, data=message_data)
        except Exception as e:
            print(f"Error: {e}")
    else:
        success, message = add_notification(notification_data)

        if not success:
            log_error(f"Failed to add notification: {message}")
