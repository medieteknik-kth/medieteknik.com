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
from models.committees.committee import CommitteeTranslation
from models.content.event import Event, EventTranslation
from models.core.notifications import (
    NotificationSubscription,
    NotificationPreferences,
    Notifications,
    SentNotifications,
)
from services.core.notifications import send_notification
from services.utility.messages import (
    TopicType,
    send_discord_topic,
)
from utility import log_error, db


scheduler_bp = Blueprint("scheduler", __name__)


def send_general_message():
    if not os.environ.get("VAPID_PRIVATE_KEY"):
        return {
            "error": "VAPID_PRIVATE_KEY is not set."
        }, HTTPStatus.INTERNAL_SERVER_ERROR

    if not os.environ.get("FERNET_KEY"):
        return {"error": "FERNET_KEY is not set."}, HTTPStatus.INTERNAL_SERVER_ERROR

    events_sent = []
    language = "sv-SE"

    sent_notifications: List[SentNotifications] = SentNotifications.query.all()

    notifications: List[Notifications] = Notifications.query.filter(
        Notifications.event_id != None,  # noqa: E711
        Notifications.notification_id.notin_(
            [
                sent_notification.notification_id
                for sent_notification in sent_notifications
            ]
        ),
    )

    events_within_7d: List[Event] = Event.query.filter(
        Event.event_id.in_([notification.event_id for notification in notifications]),
        Event.start_date >= datetime.now(),
        Event.start_date <= datetime.now() + timedelta(days=7) - timedelta(minutes=1),
    ).all()

    for event in events_within_7d:
        translation_lookup = {
            translation.language_code: translation for translation in event.translations
        }
        translation: EventTranslation | None = translation_lookup.get(language)

        committee_id = getattr(event.author, "committee_id", None)
        if not committee_id:
            continue

        committee_translation: CommitteeTranslation | None = (
            CommitteeTranslation.query.filter(
                CommitteeTranslation.committee_id == committee_id,
                CommitteeTranslation.language_code == language,
            ).first()
        )
        if not committee_translation or not isinstance(
            committee_translation, CommitteeTranslation
        ):
            continue

        # Adjust the start and end dates to IANA Stockholm timezone
        adjusted_start_date = event.start_date.astimezone(
            zoneinfo.ZoneInfo("Europe/Stockholm")
        )
        adjusted_end_date = event.end_date.astimezone(
            zoneinfo.ZoneInfo("Europe/Stockholm")
        )

        send_discord_topic(
            type=TopicType.EVENT,
            topic_data={
                "title": translation.title,
                "description": translation.description,
                "location": event.location,
                "start_date": adjusted_start_date,
                "end_date": adjusted_end_date,
                "author_name": committee_translation.title,
                "author_url": f"https://www.medieteknik.com/chapter/committees/{committee_translation.title.lower()}",
                "event_id": event.event_id,
            },
        )

        events_sent.append(event.event_id)

    return events_sent


def send_language_message():
    if not os.environ.get("VAPID_PRIVATE_KEY"):
        return {
            "error": "VAPID_PRIVATE_KEY is not set."
        }, HTTPStatus.INTERNAL_SERVER_ERROR

    if not os.environ.get("FERNET_KEY"):
        return {"error": "FERNET_KEY is not set."}, HTTPStatus.INTERNAL_SERVER_ERROR

    events_sent = []

    subscriptions: List[NotificationSubscription] = NotificationSubscription.query.all()

    sent_notifications: List[SentNotifications] = SentNotifications.query.all()

    notifications: List[Notifications] = Notifications.query.filter(
        Notifications.event_id != None,  # noqa: E711
        Notifications.notification_id.notin_(
            [
                sent_notification.notification_id
                for sent_notification in sent_notifications
            ]
        ),
    )

    events_within_7d: List[Event] = Event.query.filter(
        Event.event_id.in_([notification.event_id for notification in notifications]),
        Event.start_date >= datetime.now(),
        Event.start_date <= datetime.now() + timedelta(days=7) - timedelta(minutes=1),
    ).all()

    for subscription in subscriptions:
        notification_preferences: NotificationPreferences | None = (
            NotificationPreferences.query.filter_by(
                student_id=subscription.student_id
            ).first()
        )
        for event in events_within_7d:
            language = subscription.language
            # If user's committee preferences do not include event notifications for the event's committee, skip.

            translation_lookup = {
                translation.language_code: translation
                for translation in event.translations
            }
            translation: EventTranslation | None = translation_lookup.get(language)

            committee_id = getattr(event.author, "committee_id", None)
            if not committee_id:
                continue

            committee_translation: CommitteeTranslation | None = (
                CommitteeTranslation.query.filter(
                    CommitteeTranslation.committee_id == committee_id,
                    CommitteeTranslation.language_code == language,
                ).first()
            )
            if not committee_translation or not isinstance(
                committee_translation, CommitteeTranslation
            ):
                continue

            if not notification_preferences or not isinstance(
                notification_preferences, NotificationPreferences
            ):
                continue

            committee_pref = next(
                (
                    pref
                    for pref in notification_preferences.committees
                    if str(pref.get("committee_id")) == str(committee_id)
                    and pref.get("event")
                ),
                None,
            )

            if not committee_pref:
                continue

            translation: EventTranslation | None = translation_lookup.get(
                language.language_code
            )

            if not translation or not isinstance(translation, EventTranslation):
                continue

            # TODO: Add support for IANA timezone
            user_iana_timezone = notification_preferences.iana_timezone

            try:
                committee_translation: CommitteeTranslation | None = (
                    CommitteeTranslation.query.filter(
                        CommitteeTranslation.committee_id == committee_id,
                        CommitteeTranslation.language_code == language.language_code,
                    ).first()
                )
                if not committee_translation or not isinstance(
                    committee_translation, CommitteeTranslation
                ):
                    continue

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
                    subscription=subscription,
                )

                if not success:
                    # TODO: Add success status for each student
                    log_error(f"Error sending notification: {message}")
                events_sent.append(event.event_id)

            except Exception as e:
                log_error(f"Error sending Discord notification: {e}")

    return events_sent


@scheduler_bp.route("/upcoming_events", methods=["POST"])
@verify_google_oidc_token("https://api.medieteknik.com")
def check_upcoming_events():
    """
    Check for upcoming events and send notifications to subscribed users.
    """

    events_sent_general = send_general_message()
    events_sent_language = send_language_message()
    events_sent = set(events_sent_general).union(set(events_sent_language))

    if not events_sent:
        return {"message": "No upcoming events found."}, HTTPStatus.NO_CONTENT

    for event_id in events_sent:
        notification = Notifications.query.filter(
            Notifications.event_id == event_id
        ).first()

        if not notification:
            continue

        sent_notification = SentNotifications(
            notification_id=notification.event_id,
        )
        db.session.add(sent_notification)

    db.session.commit()

    return (
        {
            "message": "Notifications sent successfully.",
            "events_sent": list(events_sent),
        },
        HTTPStatus.OK,
    )


@scheduler_bp.route("/dev/upcoming_events", methods=["GET"])
def dev_check_upcoming_events():
    """
    Development endpoint for checking upcoming events.
    """
    if not os.environ.get("ENV") == "development":
        return {
            "error": "This endpoint is only available in development mode."
        }, HTTPStatus.FORBIDDEN

    events_sent_general = send_general_message()
    events_sent_language = send_language_message()

    events_sent = set(events_sent_general).union(set(events_sent_language))

    for event_id in events_sent:
        notification = Notifications.query.filter(
            Notifications.event_id == event_id
        ).first()

        if not notification:
            continue

        sent_notification = SentNotifications(
            notification_id=notification.notification_id,
        )
        db.session.add(sent_notification)

    db.session.commit()

    return (
        {
            "message": "Notifications sent successfully.",
            "events_sent": list(events_sent),
        },
        HTTPStatus.OK,
    )
