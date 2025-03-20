"""
Scheduler Routes (Protected), for GCP Cloud Scheduler
API Endpoint: '/api/v1/scheduler'
"""

import os
import zoneinfo
from datetime import datetime, timedelta
from http import HTTPStatus
from typing import List
from flask import Blueprint
from decorators.google_oidc import verify_google_oidc_token
from models.content.event import Event, EventTranslation
from models.core.notifications import NotificationSubscription, NotificationPreferences
from services.core.notifications import send_notification
from utility.logger import log_error


scheduler_bp = Blueprint("scheduler", __name__)


def check():
    if not os.environ.get("VAPID_PRIVATE_KEY"):
        return {
            "error": "VAPID_PRIVATE_KEY is not set."
        }, HTTPStatus.INTERNAL_SERVER_ERROR

    if not os.environ.get("FERNET_KEY"):
        return {"error": "FERNET_KEY is not set."}, HTTPStatus.INTERNAL_SERVER_ERROR

    notifications: List[NotificationSubscription] = NotificationSubscription.query.all()

    events_within_23h: List[Event] = Event.query.filter(
        Event.start_date >= datetime.now(),
        Event.start_date <= datetime.now() + timedelta(days=1) - timedelta(minutes=1),
    ).all()

    for notification in notifications:
        if not notification.push_enabled:
            continue

        notification_preferences: NotificationPreferences | None = (
            NotificationPreferences.query.filter_by(
                student_id=notification.student_id
            ).first()
        )

        if not notification_preferences or not isinstance(
            notification_preferences, NotificationPreferences
        ):
            continue

        language = notification.language

        for event in events_within_23h:
            # If user's committee preferences do not include event notifications for the event's committee, skip.
            committee_id = getattr(event.author, "committee_id", None)
            if not committee_id:
                continue

            log_error(f"commitee_id: {committee_id}")

            committee_pref = next(
                (
                    pref
                    for pref in notification_preferences.committees
                    if str(pref.get("committee_id")) == str(committee_id)
                    and pref.get("event")
                ),
                None,
            )
            log_error(f"committee_pref: {committee_pref}")
            if not committee_pref:
                continue

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
            success, message = send_notification(
                data={
                    "title": translation.title,
                    "body": f"Starts at {
                        # Convert to local time
                        event.start_date.astimezone(
                            zoneinfo.ZoneInfo(user_iana_timezone)
                        )
                    }",
                    "tag": f"event-{str(event.event_id)}",
                    "primaryKey": str(event.event_id),
                    "url": "https://www.medieteknik.com/bulletin",
                },
                subscription=notification,
            )
            if not success:
                return {"error": message}, HTTPStatus.INTERNAL_SERVER_ERROR

    return {}, HTTPStatus.OK


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
