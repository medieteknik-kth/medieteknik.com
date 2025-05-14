import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

from models.utility.auth import RevokedTokens
from utility.authorization import jwt

if TYPE_CHECKING:
    from models.apps.rgbank import (
        AccountBankInformation,
        Expense,
        ExpenseCount,
        Invoice,
        Message,
        Statistics,
    )
    from models.committees import CommitteePosition
    from models.core.author import Author
    from models.core.calendar import Calendar
    from models.core.notifications import (
        NotificationPreferences,
        NotificationSubscription,
    )
    from models.core.permissions import StudentPermission


class StudentType(enum.Enum):
    """
    The type of student. Used for differentiating where the student originates from.

    Attributes:
        MEDIETEKNIK (str): Students from Medieteknik. Takes precedence over all other types, meaning that if a student is apart of multiple groups, they will be shown as MEDIETEKNIK.
        THS (str): Students only from THS, will be shown as THS.
        DATATEKNIK (str): Students only from Datateknik, will be shown as DATATEKNIK.
        KTH (str): Most other students will be shown as KTH, will be shown as KTH.
        OTHER (str): Special case for students who are not part of any of the above groups, will not be shown as anything unique.
    """

    MEDIETEKNIK = "MEDIETEKNIK"
    THS = "THS"
    DATATEKNIK = "DATATEKNIK"
    KTH = "KTH"
    OTHER = "OTHER"


class Student(SQLModel, table=True):
    """
    Model for students in the database.

    Attributes:
        student_id (int): Primary key
        email (str): Email address
        first_name (str): First name
        last_name (str): Last name
        reception_name (str): Reception name
        profile_picture_url (str): URL to profile picture
        reception_profile_picture_url (str): URL to reception profile picture
        student_type (StudentType): Type of student
    """

    __tablename__ = "student"

    student_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    email: EmailStr = Field(
        unique=True,
        index=True,
    )

    first_name: str
    last_name: str | None
    reception_name: str | None
    profile_picture_url: str | None
    reception_profile_picture_url: str | None
    student_type: StudentType = Field(
        default=StudentType.OTHER,
    )
    password_hash: str | None

    # Relationships
    profile: "Profile" = Relationship(
        back_populates="student",
    )
    student_positions: list["StudentMembership"] = Relationship(
        back_populates="student",
    )
    author: "Author" = Relationship(
        back_populates="student",
    )
    calendar: "Calendar" = Relationship(
        back_populates="student",
    )
    permissions: "StudentPermission" = Relationship(
        back_populates="student",
    )
    notification_subscriptions: list["NotificationSubscription"] = Relationship(
        back_populates="student",
    )
    notification_preferences: "NotificationPreferences" = Relationship(
        back_populates="student",
    )

    rgbank_account_bank_information: "AccountBankInformation" = Relationship(
        back_populates="student",
    )
    rgbank_expenses: list["Expense"] = Relationship(
        back_populates="student",
    )
    rgbank_invoices: list["Invoice"] = Relationship(
        back_populates="student",
    )
    rgbank_messages: list["Message"] = Relationship(
        back_populates="sender",
    )
    rgbank_statistics: "Statistics" = Relationship(
        back_populates="student",
    )
    rgbank_expense_count: "ExpenseCount" = Relationship(
        back_populates="student",
    )

    def __repr__(self):
        return "<Student %r>" % self.student_id


class Profile(SQLModel, table=True):
    """
    Model for student profiles in the database.

    Attributes:
        profile_id (int): Primary key
        notifications_enabled (bool): Whether notifications are enabled
        notification_emails (list): List of emails to send notifications to
        phone_number (str): Phone number
        facebook_url (str): Facebook URL
        linkedin_url (str): LinkedIn URL
        instagram_url (str): Instagram URL
        student_id (int): Foreign key to student table (required)
    """

    __tablename__ = "profile"

    profile_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    facebook_url: str | None
    linkedin_url: str | None
    instagram_url: str | None

    # Foreign keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
        nullable=False,
        unique=True,
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="profile",
    )

    def __repr__(self):
        return "<Profile %r>" % self.profile_id


class StudentMembership(SQLModel, table=True):
    """
    Model for student positions in the database. Used for both history and current positions.
    Either a student is part of a committe but doesn't have a position or vice versa.

    Attributes:
        student_membership_id (int): Primary key
        initiation_date (DateTime): Date and time of initiation (required)
        termination_date (DateTime): Date and time of termination
        student_id (int): Foreign key to student (required)
        committee_id (int): Foreign key to committee
        committee_position_id (int): Foreign key to committee position
    """

    __tablename__ = "student_membership"

    student_membership_id: uuid.UUID = Field(
        primary_key=True,
        default_factory=uuid.uuid4,
    )

    initiation_date: datetime
    termination_date: datetime | None

    # Foreign keys
    student_id: uuid.UUID = Field(
        foreign_key="student.student_id",
    )

    committee_position_id: uuid.UUID = Field(
        foreign_key="committee_position.committee_position_id",
    )

    # Relationships
    student: "Student" = Relationship(
        back_populates="student_positions",
    )
    committee_position: "CommitteePosition" = Relationship(
        back_populates="student_positions",
    )


@jwt.user_identity_loader
def user_identity_lookup(student: Student):
    return student.student_id


@jwt.user_lookup_loader
def user_lookup_callback(jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return Student.query.filter_by(student_id=identity).one_or_none()


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    result = RevokedTokens.query.filter_by(jti=jti).first()
    return result is not None
