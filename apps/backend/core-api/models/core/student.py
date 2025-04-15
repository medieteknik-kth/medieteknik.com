import enum
import uuid
from typing import Any, Dict
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import (
    String,
    Column,
    ForeignKey,
    DateTime,
    Enum,
    func,
    inspect,
    or_,
    text,
)
from models.utility.auth import RevokedTokens
from utility.database import db
from utility.reception_mode import RECEPTION_MODE
from utility.authorization import jwt


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


class Student(db.Model):
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

    student_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    email = Column(String(255), unique=True, nullable=False, index=True)
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255))
    reception_name = Column(String(255))
    profile_picture_url = Column(String(length=2096))
    reception_profile_picture_url = Column(String(length=2096))
    student_type = Column(
        Enum(StudentType), nullable=False, default=StudentType.MEDIETEKNIK
    )
    password_hash = Column(String(length=1000), nullable=True)

    # Relationships
    profile = db.relationship("Profile", back_populates="student", uselist=False)
    student_positions = db.relationship("StudentMembership", back_populates="student")
    author = db.relationship("Author", back_populates="student", uselist=False)
    calendar = db.relationship("Calendar", back_populates="student", uselist=False)
    permissions = db.relationship(
        "StudentPermission", back_populates="student", uselist=False
    )
    notification_subscriptions = db.relationship(
        "NotificationSubscription", back_populates="student", uselist=False
    )
    notification_preferences = db.relationship(
        "NotificationPreferences", back_populates="student", uselist=False
    )

    rgbank_account_bank_information = db.relationship(
        "AccountBankInformation",
        back_populates="student",
        uselist=False,
        cascade="all, delete-orphan",
    )
    rgbank_expenses = db.relationship("Expense", back_populates="student")
    rgbank_invoices = db.relationship("Invoice", back_populates="student")
    rgbank_messages = db.relationship("Message", back_populates="sender")
    rgbank_statistics = db.relationship("Statistics", back_populates="student")
    rgbank_expense_count = db.relationship(
        "ExpenseCount",
        back_populates="student",
        uselist=False,
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return "<Student %r>" % self.student_id

    def to_dict(self, is_public_route=True) -> Dict[str, Any] | None:
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            data[column] = value

        del data["password_hash"]

        if is_public_route:
            if RECEPTION_MODE:
                del data["email"]
            del data["reception_name"]
            del data["reception_profile_picture_url"]
            data["first_name"] = (
                self.reception_name
                if RECEPTION_MODE and self.reception_name is not None
                else self.first_name
            )
            data["last_name"] = (
                ""
                if RECEPTION_MODE and self.reception_name is not None
                else self.last_name
            )
            data["profile_picture_url"] = (
                self.reception_profile_picture_url
                if RECEPTION_MODE and self.reception_profile_picture_url is not None
                else self.profile_picture_url
            )

        return data


class Profile(db.Model):
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

    profile_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    facebook_url = Column(String(255))
    linkedin_url = Column(String(255))
    instagram_url = Column(String(255))

    # Foreign keys
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False,
        unique=True,
    )

    # Relationships
    student = db.relationship("Student", back_populates="profile")

    def __repr__(self):
        return "<Profile %r>" % self.profile_id

    def to_dict(self, is_public_route=True):
        if RECEPTION_MODE and is_public_route:
            return None

        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()

        data = {}
        for column in columns:
            value = getattr(self, column)
            if isinstance(value, enum.Enum):
                value = value.value
            data[column] = value

        del data["profile_id"]
        del data["student_id"]

        return data


class StudentMembership(db.Model):
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

    student_membership_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    initiation_date = Column(DateTime, nullable=False)
    termination_date = Column(DateTime)

    # Foreign keys
    student_id = Column(
        UUID(as_uuid=True), ForeignKey("student.student_id"), nullable=False
    )
    committee_position_id = Column(
        UUID(as_uuid=True),
        ForeignKey("committee_position.committee_position_id"),
    )

    # Relationships
    student = db.relationship("Student", back_populates="student_positions")
    committee_position = db.relationship(
        "CommitteePosition", back_populates="student_positions"
    )

    def to_dict(self, is_public_route=True):
        columns = inspect(self)

        if not columns:
            return None

        columns = columns.mapper.column_attrs.keys()
        data = {}
        for column in columns:
            data[column] = getattr(self, column)

        if is_public_route:
            del data["student_positions_id"]
            del data["committee_position_id"]

        del data["student_id"]
        student: Student | None = Student.query.get(self.student_id)

        if not student:
            return None

        data["student"] = student.to_dict(is_public_route=is_public_route)

        return data

    def is_active(self) -> bool:
        current_date = func.now()
        if self.initiation_date is None:
            return False

        StudentMembership.query.filter(
            StudentMembership.student_id == self.student_id,
            StudentMembership.initiation_date >= current_date,
            StudentMembership.committee_position_id == self.committee_position_id,
            or_(
                StudentMembership.termination_date <= current_date,
                StudentMembership.termination_date == None,  # noqa: E711
            ),
        ).first()

        return True


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
