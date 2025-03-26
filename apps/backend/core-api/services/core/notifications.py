import json
import time
from http import HTTPStatus
from os import environ
from typing import Any, Dict, List, Tuple
from urllib.parse import urlparse
from flask import Response, jsonify
from sqlalchemy import and_, or_
from models.core.notifications import (
    NotificationPreferences,
    NotificationSubscription,
    NotificationType,
    Notifications,
    NotificationsTranslation,
)
from cryptography.fernet import Fernet
from pywebpush import webpush, WebPushException
from utility import log_error, convert_iso_639_1_to_bcp_47, db


def add_notification(message_data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Adds a notification to the database.
        :param data: Dict[str, Any] - The data containing the notification
        :return: Response - The response object, 400 if no data is provided, 201 if successful
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

    db.session.add(notification)
    db.session.commit()

    for translation_data in translation:
        title: str | None = translation_data.get("title")
        body: str | None = translation_data.get("body")
        url: str | None = translation_data.get("url")
        language_code: str | None = translation_data.get("language_code")

        if not title or not body or not url or not language_code:
            db.session.delete(notification)
            db.session.commit()
            return False, "Invalid translation data"

        notification_translation = NotificationsTranslation(
            notification_id=notification.notification_id,
            title=title,
            body=body,
            url=url,
            language_code=convert_iso_639_1_to_bcp_47(language_code),
        )

        db.session.add(notification_translation)
    db.session.commit()

    return True, "Notification added"


def send_notification(
    data: Dict[str, Any], subscription: NotificationSubscription
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
            db.session.delete(subscription)
            db.session.commit()

    except WebPushException as e:
        log_error(f"Error sending notification: {e}")
        return False, f"Error: {e}"
    except Exception as e:
        log_error(f"Error sending notification: {e}")
        return False, f"Error: {e}"

    return True, "Notification sent"


def retrieve_notifications(student_id: Any, language_code: str) -> Response:
    # cached_data = get_cache(f"notifications_{student_id}")

    # if cached_data:
    #    previous_time = json.loads(cached_data)["time"]
    #    if datetime.now() - datetime.fromisoformat(previous_time) < timedelta(
    #        minutes=10
    #    ):
    #        return jsonify(json.loads(cached_data)["data"]), HTTPStatus.OK

    notification_preferences: NotificationPreferences | None = (
        NotificationPreferences.query.filter(
            NotificationPreferences.student_id == student_id
        )
    ).first()

    all_filters = []

    # All students should receive announcements, use sparingly...
    all_filters.append(Notifications.notification_type == NotificationType.ANNOUNCEMENT)

    committees = {}

    if notification_preferences and isinstance(
        notification_preferences, NotificationPreferences
    ):
        if getattr(notification_preferences, "site_updates"):
            all_filters.append(
                Notifications.notification_type == NotificationType.UPDATE
            )

        for committee in getattr(notification_preferences, "committees"):
            types = {k: committee[k] for k in ("news", "event") if k in committee}
            committees[committee["committee_id"]] = types

    notifications = Notifications.query

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

    notification_result: List[Notifications] = notifications.order_by(
        Notifications.created_at.desc()
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

    return jsonify(data), HTTPStatus.OK


def subscribe_to_notifications(
    data_dict: Dict[str, Any], student_id: int, language: str
) -> Response:
    secret_key = environ.get("FERNET_KEY")
    if not secret_key:
        return jsonify(
            {"error": "FERNET_KEY environment variable not set"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR
    cipher = Fernet(secret_key.encode())

    # Where to send the notifications
    push: bool | None = data_dict.get("push")

    # Push notifications
    subscription: Dict[str, Any] | None = data_dict.get("subscription")
    if push and not subscription:
        return jsonify({"error": "Invalid subscription"}), HTTPStatus.BAD_REQUEST

    preferences: Dict[str, Any] | None = data_dict.get("preferences")

    notification_preferences: NotificationPreferences | None = (
        NotificationPreferences.query.filter_by(student_id=student_id).first()
    )

    if not notification_preferences and preferences:
        db.session.add(
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
            return jsonify({"error": "Invalid subscription"}), HTTPStatus.BAD_REQUEST

        p256dh_encrypted: str | None = cipher.encrypt(
            subscription.get("keys").get("p256dh").encode()
        ).decode()
        auth_encrypted: str | None = cipher.encrypt(
            subscription.get("keys").get("auth").encode()
        ).decode()

        notification: NotificationSubscription | None = (
            NotificationSubscription.query.filter_by(
                student_id=student_id, endpoint=endpoint
            ).first()
        )

        if not notification or not isinstance(notification, NotificationSubscription):
            notification = NotificationSubscription(
                student_id=student_id,
                endpoint=endpoint,
                p256dh=p256dh_encrypted,
                auth=auth_encrypted,
                language_code=language,
            )
            db.session.add(notification)
        else:
            notification.site_updates = preferences.get("site_updates")
            notification.language_code = language

    db.session.commit()

    return jsonify({"message": "Successfully updated"}), HTTPStatus.OK
