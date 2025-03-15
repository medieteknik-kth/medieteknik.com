"""Core module of the application, containing the core models of the application.

This includes module includes the following PostgreSQL tables:
- Author, used for the author of user generated content like events, news, etc.
- Calendar, used for the main calendar of the application, and also for committee specific calendars.
- Language, defines the languages available in the application, and all translation tables require a language.
- Notifications, used for system notifications, and committee notifications.
- NotificationSubscription, used for push notifications if a user has subscribed to them.
- NotificationPreferences, used for the preferences of a user for notifications, like the IANA timezone, and the committees they want to receive notifications from.
- NotificationsTranslation, used for the translations of notifications.
- Permissions, used fine grained permissions of users.
- Role, used for the roles of users.
- Student, the user model for the application, referred to Student to be more relatable to the target audience.
- StudentMembership, used for the memberships of students in committees.
- Profile, used for cosmetic information of the student, like social media links.
"""

from .author import Author
from .author import AuthorResource
from .author import AuthorType

from .calendar import Calendar

from .language import Language

from .notifications import NotificationType
from .notifications import Notifications
from .notifications import NotificationSubscription
from .notifications import NotificationPreferences
from .notifications import NotificationsTranslation

from .permissions import Permissions
from .permissions import Role
from .permissions import StudentPermission

from .student import Student
from .student import StudentMembership
from .student import Profile


__all__ = [
    "Author",
    "AuthorResource",
    "AuthorType",
    "Calendar",
    "Language",
    "NotificationType",
    "NotificationSubscription",
    "NotificationPreferences",
    "Notifications",
    "NotificationsTranslation",
    "Permissions",
    "Role",
    "StudentPermission",
    "Student",
    "StudentMembership",
    "Profile",
]
