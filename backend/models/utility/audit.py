import enum
from sqlalchemy import Column, Integer, String, DateTime, Enum, ForeignKey, inspect
from utility.database import db


class Result(enum.Enum):
    """
    Whether the request was successful or not.

    Attributes:
        SUCCESS: The request was successful.
        FAILURE: The request failed.
    """

    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"


class EndpointCategory(enum.Enum):
    """
    The category of the endpoint.

    Attributes:
        COMMITTEE: The endpoint belongs to the committee.
        EVENT: The endpoint belongs to an event.
        POST: The endpoint belongs to a post.
        DOCUMENT: The endpoint belongs to a document.
        RESOURCE: The endpoint belongs to a resource.
        STUDENT: The endpoint belongs to a student.
        ANALYTICS: The endpoint belongs to analytics.
        NOT_SPECIFIED: The endpoint category is not specified.
    """

    COMMITTEE = "COMMITTEE"
    EVENT = "EVENT"
    POST = "POST"
    DOCUMENT = "DOCUMENT"
    RESOURCE = "RESOURCE"
    STUDENT = "STUDENT"
    ANALYTICS = "ANALYTICS"
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

    audit_id = Column(Integer, primary_key=True, autoincrement=True)

    created_at = Column(DateTime, nullable=False)
    action_type = Column(String(8), nullable=False)
    endpoint_category = Column(Enum(EndpointCategory), nullable=False)
    request_params = Column(String(1000))
    response_code = Column(Integer, nullable=False)
    additional_info = Column(String(1000))
    result = Column(Enum(Result), nullable=False, default=Result.SUCCESS)

    # Foreign key
    student_id = Column(Integer, ForeignKey("student.student_id"))

    # Relationships
    student = db.relationship("Student", backref="audit")

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
