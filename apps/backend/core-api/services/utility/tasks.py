"""
Tasks Service
"""

import json
from datetime import datetime, timedelta, timezone
from os import environ

from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2

from utility import parent, tasks


def schedule_news(
    news_id: any, author_name: str, url: str, delay_seconds=60
) -> tasks_v2.Task:
    """
    Schedule a task to send a Discord message with news information.

    Args:
        news_id (str): The ID of the news item.
        author_name (str): The name of the author.
        url (str): The URL of the news item.
        delay_seconds (int): Delay in seconds before the task is executed.

    Returns:
        tasks_v2.Task: The created task object.
    """
    endpoint_url = "https://api.medieteknik.com/api/v1/tasks/schedule-news"
    aud = "https://api.medieteknik.com"

    # Mainly for UUIDs
    if not isinstance(news_id, str):
        news_id = str(news_id)

    timestamp = timestamp_pb2.Timestamp()
    timestamp.FromDatetime(
        datetime.now(tz=timezone.utc) + timedelta(seconds=int(delay_seconds))
    )

    task = tasks_v2.Task(
        http_request=tasks_v2.HttpRequest(
            http_method=tasks_v2.HttpMethod.POST,
            url=endpoint_url,
            headers={"Content-Type": "application/json"},
            body=json.dumps(
                {
                    "task_type": "send_discord_message",
                    "message_type": "NEWS",
                    "message_data": {
                        "news_id": news_id,
                        "url": url,
                        "author": {"name": author_name},
                    },
                }
            ).encode(),
            oidc_token=tasks_v2.OidcToken(
                service_account_email=environ.get("GOOGLE_SERVICE_ACCOUNT"),
                audience=aud,
            ),
        ),
        schedule_time=timestamp,
    )

    response = tasks.create_task(
        tasks_v2.CreateTaskRequest(
            parent=parent,
            task=task,
        )
    )
    return response
