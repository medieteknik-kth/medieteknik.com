import enum
import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Enum,
    ForeignKey,
    func,
    inspect,
    text,
)
from utility.database import db


class EndpointCategory(enum.Enum):
    """
    The category of the endpoint.

    Attributes:
        AUTH: The endpoint belongs to authentication.
        COMMITTEE: The endpoint belongs to the committee.
        COMMITTEE_POSITION: The endpoint belongs to the committee position.
        EVENT: The endpoint belongs to an event.
        NEWS: The endpoint belongs to news.
        DOCUMENT: The endpoint belongs to a document.
        MEDIA: The endpoint belongs to media.
        STUDENT: The endpoint belongs to a student.
        NOT_SPECIFIED: The endpoint category is not specified.
    """

    AUTH = "AUTH"
    COMMITTEE = "COMMITTEE"
    COMMITTEE_POSITION = "COMMITTEE POSITION"
    EVENT = "EVENT"
    NEWS = "NEWS"
    DOCUMENT = "DOCUMENT"
    MEDIA = "MEDIA"
    STUDENT = "STUDENT"
    NOT_SPECIFIED = "NOT SPECIFIED"


class Audit(db.Model):
    """
    This table is used to store audit logs for *most* requests made to the API.

    Attributes:
        audit_id: Primary key
        created_at: When the request was made
        action_type: The type of action
        endpoint_category: The category of the endpoint
        request_params: The request parameters
        response_code: The response code
        additional_info: Additional information
        result: Whether the request was successful or not
        student_id: Foreign key to the student table
    """

    __tablename__ = "audit"

    audit_id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )

    created_at = Column(
        DateTime, nullable=False, server_default=text("now()"), default=func.now()
    )
    method = Column(String(10), nullable=False)
    endpoint_category = Column(Enum(EndpointCategory), nullable=False, index=True)
    url = Column(String(), nullable=False, index=True)
    response = Column(String())
    response_code = Column(Integer, nullable=False)
    additional_info = Column(String(1_000))
    user_agent = Column(String())
    ip_address = Column(String())

    # Foreign key
    student_id = Column(
        UUID(as_uuid=True),
        ForeignKey("student.student_id"),
        nullable=False,
        unique=False,
    )

    student = db.relationship("Student", back_populates="audit")

    def __repr__(self):
        return "<Audit %r>" % self.audit_id

    def to_dict(self):
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

        return data
