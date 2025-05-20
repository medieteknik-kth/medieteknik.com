"""
Notifications service module.
This module provides functions to manage notifications, including adding,
sending, and retrieving notifications.
"""

import json
import time
from http import HTTPStatus
from os import environ
from typing import Any, Dict, List, Tuple
from urllib.parse import urlparse

from cryptography.fernet import Fernet
from fastapi import HTTPException, logger
from pywebpush import WebPushException, webpush
from sqlmodel import Session, and_, or_, select

from config import Settings
from models.core.notifications import (
    NotificationPreferences,
    Notifications,
    NotificationsTranslation,
    NotificationSubscription,
    NotificationType,
)
from utility import convert_iso_639_1_to_bcp_47


# TODO: Add a DTO for the notification data
def add_notification(
    session: Session, message_data: Dict[str, Any]
) -> Tuple[bool, str]:
    """
    Adds a notification to the database.

    Args:
        session (Session): The database session.
        message_data (Dict[str, Any]): The message data containing the notification type and translations.

    Returns:
        Tuple[bool, str]: A tuple containing the success status and the message.
    """

    data: Dict[str, Any] = message_data.get("message_data")

    notification_type: str | None = data.get("notification_type")
    notification_metadata: Dict[str, Any] | None = data.get("notification_metadata")
    translation: List[Dict[str, Any]] | None = data.get("translations")
    committee_id: int | None = data.get("committee_id", None)
    event_id: str | None = data.get("event_id", None)
    news_id: str | None = data.get("news_id", None)

    if not notification_type or not translation:
        return False, f"Invalid data provided: {data}"

    if notification_type not in NotificationType.__members__:
        return False, "Invalid notification type"

    notification = Notifications(
        notification_type=NotificationType[notification_type.upper()],
        notification_metadata=notification_metadata or {},
        committee_id=committee_id,
        news_id=news_id,
        event_id=event_id,
    )

    session.add(notification)
    session.commit()
    session.refresh(notification)

    for translation_data in translation:
        title: str | None = translation_data.get("title")
        body: str | None = translation_data.get("body")
        url: str | None = translation_data.get("url")
        language_code: str | None = translation_data.get("language_code")

        if not title or not body or not url or not language_code:
            session.delete(notification)
            session.commit()
            return False, "Invalid translation data"

        notification_translation = NotificationsTranslation(
            notification_id=notification.notification_id,
            title=title,
            body=body,
            url=url,
            language_code=convert_iso_639_1_to_bcp_47(language_code),
        )

        session.add(notification_translation)
    session.commit()

    return True, "Notification added"


def send_notification(
    session: Session, data: Dict[str, Any], subscription: NotificationSubscription
) -> Tuple[bool, str]:
    cipher = Fernet(environ.get("FERNET_KEY"))

    body = data.get("body")
    title = data.get("title")
    url = data.get("url")
    tag = data.get("tag")
    primaryKey = data.get("primaryKey")

    parsed_url = urlparse(subscription.endpoint)
    p256dh = cipher.decrypt(subscription.p256dh.encode()).decode()
    auth = cipher.decrypt(subscription.auth.encode()).decode()
    payload = {
        "title": title,
        "body": body,
        "tag": tag,
        "data": {
            "url": url,
            "primaryKey": primaryKey if primaryKey else None,
        },
    }

    try:
        result = webpush(
            subscription_info={
                "endpoint": subscription.endpoint,
                "keys": {
                    "p256dh": p256dh,
                    "auth": auth,
                },
            },
            data=json.dumps(payload),
            vapid_private_key=environ.get("VAPID_PRIVATE_KEY"),
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
            session.delete(subscription)
            session.commit()
            session.refresh(subscription)

    except WebPushException as e:
        logger.logger.error(f"Error sending notification: {e}")
        return False, f"Error: {e}"
    except Exception as e:
        logger.logger.error(f"Error sending notification: {e}")
        return False, f"Error: {e}"

    return True, "Notification sent"


def retrieve_notifications(session: Session, student_id: Any, language_code: str):
    # cached_data = get_cache(f"notifications_{student_id}")

    # if cached_data:
    #    previous_time = json.loads(cached_data)["time"]
    #    if datetime.now() - datetime.fromisoformat(previous_time) < timedelta(
    #        minutes=10
    #    ):
    #        return jsonify(json.loads(cached_data)["data"]), HTTPStatus.OK

    notification_preferences = session.exec(
        select(NotificationPreferences).where(
            NotificationPreferences.student_id == student_id
        )
    ).first()

    all_filters = []

    # All students should receive announcements, use sparingly...
    all_filters.append(Notifications.notification_type == NotificationType.ANNOUNCEMENT)

    committees = {}

    if notification_preferences:
        if notification_preferences.site_updates:
            all_filters.append(
                Notifications.notification_type == NotificationType.UPDATE
            )

        for committee in notification_preferences.committees:
            types = {k: committee[k] for k in ("news", "event") if k in committee}
            committees[committee["committee_id"]] = types

    notifications = select(Notifications)

    if committees:
        committee_filters = []
        for committee_id, types_dict in committees.items():
            type_filters = [
                Notifications.notification_type == NotificationType[type_name.upper()]
                for type_name, allowed in types_dict.items()
                if allowed
            ]

            if type_filters:
                committee_filters.append(
                    and_(
                        Notifications.committee_id == committee_id,
                        or_(*type_filters),
                    )
                )

        if committee_filters:
            all_filters.append(or_(*committee_filters))

    if all_filters:
        notifications = notifications.filter(or_(*all_filters))

    notification_result = session.exec(
        notifications.order_by(Notifications.created_at.desc())
    ).all()

    data = [
        notification.to_dict(provided_languages=language_code)
        for notification in notification_result
    ]

    # class CustomJSONEncoder(json.JSONEncoder):
    #    def default(self, obj):
    #        if isinstance(obj, datetime):
    #            return obj.isoformat()
    #        if isinstance(obj, UUID):
    #            return str(obj)
    #        return super().default(obj)

    # set_cache(
    #    f"notifications_{student_id}",
    #    json.dumps(
    #        {"time": datetime.now().isoformat(), "data": data}, cls=CustomJSONEncoder
    #    ),
    # )

    return data


def subscribe_to_notifications(
    session: Session, data_dict: Dict[str, Any], student_id: int, language: str
):
    secret_key = Settings.FERNET_KEY
    if not secret_key:
        raise HTTPException(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            detail="FERNET_KEY environment variable is not set",
        )
    cipher = Fernet(secret_key.encode())

    # Where to send the notifications
    push: bool | None = data_dict.get("push")

    # Push notifications
    subscription: Dict[str, Any] | None = data_dict.get("subscription")
    if push and not subscription:
        raise HTTPException(
            status_code=HTTPStatus.BAD_REQUEST,
            detail="Missing subscription data",
        )

    preferences: Dict[str, Any] | None = data_dict.get("preferences")

    notification_preferences: NotificationPreferences | None = (
        NotificationPreferences.query.filter_by(student_id=student_id).first()
    )

    if not notification_preferences and preferences:
        session.add(
            NotificationPreferences(
                student_id=student_id,
                iana_timezone=preferences.get("iana"),
                site_updates=preferences.get("site_updates"),
                committees=preferences.get("committees"),
            )
        )
    elif notification_preferences and preferences:
        notification_preferences.iana_timezone = preferences.get("iana")
        notification_preferences.site_updates = preferences.get("site_updates")
        notification_preferences.committees = preferences.get("committees")

    if push:
        endpoint: str | None = subscription.get("endpoint")

        if not endpoint:
            raise HTTPException(
                status_code=HTTPStatus.BAD_REQUEST,
                detail="Missing endpoint in subscription data",
            )

        p256dh_encrypted: str | None = cipher.encrypt(
            subscription.get("keys").get("p256dh").encode()
        ).decode()
        auth_encrypted: str | None = cipher.encrypt(
            subscription.get("keys").get("auth").encode()
        ).decode()

        notification = session.exec(
            select(NotificationSubscription).where(
                and_(
                    NotificationSubscription.student_id == student_id,
                    NotificationSubscription.endpoint == endpoint,
                )
            )
        ).first()

        if not notification:
            notification = NotificationSubscription(
                student_id=student_id,
                endpoint=endpoint,
                p256dh=p256dh_encrypted,
                auth=auth_encrypted,
                language_code=language,
            )
            session.add(notification)
        else:
            notification.language_code = language

    session.commit()
