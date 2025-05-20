"""
Discord Service, used to send messages to Discord channels via webhooks.
"""

from datetime import datetime
from http import HTTPStatus
from typing import Any, Dict, Tuple

import requests
from fastapi import logger
from sqlmodel import Session

from config import Settings
from models.utility.discord import DiscordMessages
from services.utility.messages import TopicType


def send_discord_message(
    session: Session, message_data: Dict[str, Any]
) -> Tuple[bool, str]:
    """
    Sends a Discord message based on the message data.

    Args:
        message_data (Dict[str, Any]): The message data containing the message type and data.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """
    webhook_url = Settings.DISCORD_WEBHOOK_URL

    if not webhook_url:
        return False, "No Discord webhook URL found!"

    message_type = message_data.get("message_type").upper()
    data = message_data.get("message_data")

    if not message_type or not data:
        return False, "Invalid message data!"

    match message_type:
        case TopicType.NEWS.name:
            return send_discord_news(
                session=session, webhook_url=webhook_url, data=data
            )

        case TopicType.EVENT.name:
            return send_discord_event(
                session=session, webhook_url=webhook_url, data=data
            )

        case TopicType.UPDATE.name:
            return send_discord_update(webhook_url=webhook_url, data=data)

        case _:
            return False, "Invalid message type!"

    return False, "Unknown error!"


def send_discord_news(
    session: Session, webhook_url: str, data: Dict[str, Any]
) -> Tuple[bool, str]:
    """
    Sends a Discord message for news.

    Args:
        webhook_url (str): The Discord webhook URL.
        data (Dict[str, Any]): The data containing the news information.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """
    message = {
        "content": f"<@&1348359211846733876> {data.get('url')}",
        "embeds": None,
        "username": data["author"]["name"],
        "attachments": [],
    }

    try:
        response = requests.post(f"{webhook_url}?wait=true", json=message)

        if response.status_code != HTTPStatus.OK:
            return False, f"Failed to send Discord message: {response.text}"

        response_json = response.json()
        message_id = response_json.get("id")

        if not message_id:
            return False, "Failed to get message ID!"

        session.add(
            DiscordMessages(message_id=str(message_id), news_id=data["news_id"])
        )
        session.commit()
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def send_discord_event(
    session: Session, webhook_url: str, data: Dict[str, Any]
) -> Tuple[bool, str]:
    """
    Sends a Discord message for an event.

    Args:
        webhook_url (str): The Discord webhook URL.
        data (Dict[str, Any]): The data containing the event information.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """

    def format_date(date_str: str) -> str:
        date = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return f"<t:{int(date.timestamp())}:F>"

    formatted_start_date = format_date(str(data["start_date"]))
    formatted_end_date = format_date(str(data["end_date"]))

    message = {
        "content": "<@&1348359211846733876>",
        "embeds": [
            {
                "title": data["title"],
                "description": data["description"],
                "color": 16436245,
                "fields": [
                    {
                        "name": "Plats",
                        "value": data["location"],
                        "inline": True,
                    },
                    {
                        "name": "Start Datum",
                        "value": str(formatted_start_date),
                        "inline": True,
                    },
                    {
                        "name": "Avslutnings Datum",
                        "value": str(formatted_end_date),
                        "inline": True,
                    },
                ],
                "author": {
                    "name": data["author"]["name"],
                    "url": data["author"]["url"],
                },
            }
        ],
        "attachments": [],
    }

    try:
        response = requests.post(
            f"{webhook_url}?wait=true",
            json=message,
        )

        if response.status_code != HTTPStatus.OK:
            return False, f"Failed to send Discord message: {response.text}"

        response_json = response.json()
        logger.logger.error(response_json)
        message_id = response_json.get("id")

        if not message_id:
            return False, "Failed to get message ID!"

        session.add(
            DiscordMessages(message_id=str(message_id), event_id=data["event_id"])
        )
        session.commit()

    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def send_discord_update(webhook_url: str, data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Sends a Discord message for an update, will rarely be used.

    Args:
        webhook_url (str): The Discord webhook URL.
        data (Dict[str, Any]): The data containing the update information.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """
    message = {
        "content": f"**[Medieteknik](https://www.medieteknik.com/)** | v{data['title']}",
        "embeds": [
            {
                "title": ":flag_se: Svenska",
                "description": data["description"]["sv"],
                "url": f"https://www.medieteknik.com/sv/updates/{data['title']}",
                "color": 16436245,
                "footer": {
                    "text": "Uppdaterad",
                },
                "timestamp": data["timestamp"],
            },
            {
                "title": ":flag_gb: English",
                "description": data["description"]["en"],
                "url": f"https://www.medieteknik.com/en/updates/{data['title']}",
                "color": 16436245,
                "footer": {
                    "text": "Updated",
                },
                "timestamp": data["timestamp"],
            },
        ],
        "attachments": [],
    }

    try:
        response = requests.post(webhook_url, json=message)

        if response.status_code != HTTPStatus.NO_CONTENT:
            return False, f"Failed to send Discord message: {response.text}"
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def delete_discord_message(message_id: str) -> Tuple[bool, str]:
    """
    Deletes a Discord message.

    Args:
        message_id (str): The ID of the message to delete.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """
    webhook_url = Settings.DISCORD_WEBHOOK_URL
    try:
        response = requests.delete(f"{webhook_url}/messages/{message_id}")

        if response.status_code != HTTPStatus.NO_CONTENT:
            return False, f"Failed to delete Discord message: {response.text}"
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message deleted!"
