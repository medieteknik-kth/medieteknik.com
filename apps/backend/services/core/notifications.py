from http import HTTPStatus
from os import environ
from typing import Any, Dict, List
from flask import Response, jsonify
from sqlalchemy import and_, or_
from utility.database import db
from models.core.notifications import (
    NotificationPreferences,
    NotificationSubscription,
    NotificationType,
    Notifications,
    NotificationsTranslation,
)
from cryptography.fernet import Fernet


def add_notification(data: Dict[str, Any]) -> Response:
    """
    Adds a notification to the database.
        :param data: Dict[str, Any] - The data containing the notification
        :return: Response - The response object, 400 if no data is provided, 201 if successful
    """

    notification_type: str | None = data.get("notification_type")
    notification_metadata: Dict[str, Any] | None = data.get("notification_metadata")
    translation: List[Dict[str, Any]] | None = data.get("translations")
    committee_id: int | None = data.get("committee_id")

    if not notification_type or not notification_metadata or not translation:
        return jsonify({"error": "Invalid data"}), HTTPStatus.BAD_REQUEST

    if notification_type not in NotificationType.__members__:
        return jsonify({"error": "Invalid notification type"}), HTTPStatus.BAD_REQUEST

    if committee_id:
        notification = Notifications(
            notification_type=NotificationType[notification_type.upper()],
            notification_metadata=notification_metadata,
            committee_id=committee_id,
        )
    else:
        notification = Notifications(
            notification_type=NotificationType[notification_type.upper()],
            notification_metadata=notification_metadata,
        )

    db.session.add(notification)
    db.session.commit()

    for translation_data in translation:
        title: str | None = translation_data.get("title")
        body: str | None = translation_data.get("body")
        url: str | None = translation_data.get("url")

        if not title or not body:
            return jsonify({"error": "Invalid translation"}), HTTPStatus.BAD_REQUEST

        notification_translation = NotificationsTranslation(
            notification_id=notification.notification_id,
            title=title,
            body=body,
            url=url,
            language_code=translation_data.get("language_code"),
        )

        db.session.add(notification_translation)
    db.session.commit()

    return jsonify({"message": "Notification added"}), HTTPStatus.CREATED


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
