"""
Scheduler Routes (Protected), for GCP Cloud Scheduler
API Endpoint: '/api/v1/scheduler'
"""

import json
import os
import time
import zoneinfo
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import List
from flask import Blueprint
from pywebpush import webpush, WebPushException
from decorators.google_oidc import verify_google_oidc_token
from models.content.event import Event, EventTranslation
from models.core.notifications import NotificationSubscription, NotificationPreferences
from urllib.parse import urlparse
from cryptography.fernet import Fernet
from utility.database import db


scheduler_bp = Blueprint("scheduler", __name__)


def check():
    if not os.environ.get("VAPID_PRIVATE_KEY"):
        return {
            "error": "VAPID_PRIVATE_KEY is not set."
        }, HTTPStatus.INTERNAL_SERVER_ERROR

    if not os.environ.get("FERNET_KEY"):
        return {"error": "FERNET_KEY is not set."}, HTTPStatus.INTERNAL_SERVER_ERROR

    notifications: List[NotificationSubscription] = (
        NotificationSubscription.query.filter_by(upcoming_events=True).all()
    )
    events_within_24h: List[Event] = Event.query.filter(
        Event.start_date >= datetime.now(),
        Event.start_date <= datetime.now() + timedelta(days=1),
    ).all()

    cipher = Fernet(os.environ.get("FERNET_KEY"))
    errors = []

    for notification in notifications:
        if not notification.push_enabled:
            continue

        notification_preferences = NotificationPreferences.query.filter_by(
            student_id=notification.student_id
        ).first()

        if not notification_preferences:
            continue

        language = notification.language

        for event in events_within_24h:
            translation_lookup = {
                translation.language_code: translation
                for translation in event.translations
            }
            translation: EventTranslation | None = translation_lookup.get(
                language.language_code
            )

            if not translation or not isinstance(translation, EventTranslation):
                continue

            user_iana_timezone = notification_preferences.iana_timezone
            try:
                parsed_url = urlparse(notification.endpoint)
                p256dh = cipher.decrypt(notification.p256dh.encode()).decode()
                auth = cipher.decrypt(notification.auth.encode()).decode()
                payload = {
                    "title": translation.title + " starts soon!",
                    "body": f"Starts at {
                        # Convert to local time
                        event.start_date.astimezone(
                            zoneinfo.ZoneInfo(user_iana_timezone)
                        )
                    }",
                    "tag": f"event-{event.event_id}",
                }

                result = webpush(
                    subscription_info={
                        "endpoint": notification.endpoint,
                        "keys": {
                            "p256dh": p256dh,
                            "auth": auth,
                        },
                    },
                    data=json.dumps(payload),
                    vapid_private_key=os.environ.get("VAPID_PRIVATE_KEY"),
                    ttl=3_600,  # 1 hour
                    vapid_claims={
                        "sub": "mailto:webmaster@medieteknik.com",
                        "aud": f"{parsed_url.scheme}://{parsed_url.netloc}",
                        # "aud": "http://localhost:3000",
                        "exp": int(time.time()) + 3_600,
                    },
                    headers={
                        "X-WNS-RequestForStatus": "true",
                    },
                )

                if result.status_code == 410 or result.status_code == 404:
                    print("Subscription is no longer valid, deleting...")
                    errors.append("Invalid subscription.")
                    db.session.delete(notification)
                    db.session.commit()

            except WebPushException as e:
                print(f"Error sending notification: {e}")
                errors.append("Error sending notification: " + str(e))
            except Exception as e:
                print(f"Error: {e}")
                errors.append("Error: " + str(e))
    return {
        "errors": errors,
    }, HTTPStatus.OK


@scheduler_bp.route("/upcoming_events", methods=["POST"])
@verify_google_oidc_token("https://api.medieteknik.com")
def check_upcoming_events():
    """
    Check for upcoming events and send notifications to subscribed users.
    """
    return check()


@scheduler_bp.route("/dev/upcoming_events", methods=["POST"])
def dev_check_upcoming_events():
    """
    Development endpoint for checking upcoming events.
    """
    if not os.environ.get("FLASK_ENV") == "development":
        return {
            "error": "This endpoint is only available in development mode."
        }, HTTPStatus.FORBIDDEN

    return check()
