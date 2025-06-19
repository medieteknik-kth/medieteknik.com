"""
Discord Service
"""

import requests
from datetime import datetime
from http import HTTPStatus
from os import environ
from typing import Any, Dict, Tuple
from models.utility.discord import DiscordMessages
from services.utility.messages import TopicType
from utility import db, log_error


def send_discord_message(message_data: Dict[str, Any]) -> Tuple[bool, str]:
    """Handles the Discord message data and sends the message to the Discord webhook.

    :param message_data: The message data.
    :type message_data: Dict[str, Any]
    :return: The success status and the message.
    :rtype: Tuple[bool, str]
    """
    webhook_url = environ.get("DISCORD_WEBHOOK_URL")

    if not webhook_url:
        return False, "No Discord webhook URL found!"

    message_type = message_data.get("message_type").upper()
    data = message_data.get("message_data")

    if not message_type or not data:
        return False, "Invalid message data!"

    match message_type:
        case TopicType.NEWS.name:
            return send_discord_news(webhook_url, data)

        case TopicType.EVENT.name:
            return send_discord_event(webhook_url, data)

        case TopicType.UPDATE.name:
            return send_discord_update(webhook_url, data)

        case _:
            return False, "Invalid message type!"

    return False, "Unknown error!"


def send_discord_news(webhook_url: str, data: Dict[str, Any]) -> Tuple[bool, str]:
    """Sends a Discord message for a news article.

    :param webhook_url: The Discord webhook URL.
    :type webhook_url: str
    :param data: The data.
    :type data: Dict[str, Any]
    :return: The success status and the message.
    :rtype: Tuple[bool, str]
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

        db.session.add(
            DiscordMessages(message_id=str(message_id), news_id=data["news_id"])
        )
        db.session.commit()
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def send_discord_event(webhook_url: str, data: Dict[str, Any]) -> Tuple[bool, str]:
    """Sends a Discord message for an event.

    :param webhook_url: The Discord webhook URL.
    :type webhook_url: str
    :param data: The data.
    :type data: Dict[str, Any]
    :return: The success status and the message.
    :rtype: Tuple[bool, str]
    """

    def format_date(date_str: str) -> str:
        """Formats the date string to a Discord timestamp.

        :param date_str: The date string.
        :type date_str: str
        :return: The formatted date string.
        :rtype: str
        """
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
        log_error(response_json)
        message_id = response_json.get("id")

        if not message_id:
            return False, "Failed to get message ID!"

        db.session.add(
            DiscordMessages(message_id=str(message_id), event_id=data["event_id"])
        )
        db.session.commit()

    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def send_discord_update(webhook_url: str, data: Dict[str, Any]) -> Tuple[bool, str]:
    """Sends a Discord message for an update, will rarely be used, to send updates you should do it manually.

    :param webhook_url: The Discord webhook URL.
    :type webhook_url: str
    :param data: The data.
    :type data: Dict[str, Any]
    :return: The success status and the message.
    :rtype: Tuple[bool, str]
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

        if response.status_code != 204:
            return False, f"Failed to send Discord message: {response.text}"
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message sent!"


def delete_discord_message(message_id: str) -> Tuple[bool, str]:
    """Deletes a Discord message.

    :param message_id: The message ID.
    :type message_id: str
    :return: The success status and the message.
    :rtype: Tuple[bool, str]
    """
    webhook_url = environ.get("DISCORD_WEBHOOK_URL")
    try:
        response = requests.delete(f"{webhook_url}/messages/{message_id}")

        if response.status_code != HTTPStatus.NO_CONTENT:
            return False, f"Failed to delete Discord message: {response.text}"
    except Exception as e:
        return False, f"Error: {e}"

    return True, "Discord message deleted!"
