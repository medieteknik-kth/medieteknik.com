"""
Tasks Service
"""

import json
from datetime import datetime, timedelta, timezone
from os import environ
from utility import tasks, parent
from google.cloud import tasks_v2
from google.protobuf import timestamp_pb2


def schedule_news(
    news_id: str, author_name: str, url: str, delay_seconds=60
) -> tasks_v2.Task:
    """Schedules a news message to be sent to Discord.
    :param news_id: The news ID.
    :type news_id: str
    :param author_name: The author name.
    :type author_name: str
    :param url: The URL.
    :type url: str
    :param delay_seconds: The delay in seconds, defaults to 60s.
    :type delay_seconds: int
    :return: The response.
    :rtype: tasks_v2.Task
    """
    endpoint_url = "https://api.medieteknik.com/api/v1/tasks/schedule-news"
    aud = "https://api.medieteknik.com"

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
                    "message_type": "news",
                    "message_data": {
                        "news_id": news_id,
                        "url": url,
                        "author": {"name": author_name},
                    },
                }
            ).encode(),
            oidc_token=tasks_v2.OidcToken(
                service_account_email=environ.get("GOOGLE_SERVICE_ACCOUNT_EMAIL"),
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
    print(response)
    return response
