from functools import wraps
from types import FunctionType

from flask_jwt_extended import get_jwt_identity
from utility.database import db
from flask import Response, request

from models.utility.audit import Audit, EndpointCategory


def audit(
    endpoint_category: EndpointCategory,
    additional_info: str = None,
) -> FunctionType:
    """
    Decorator for auditing requests.

    :param endpoint_category: The category of the endpoint.
    :type endpoint_category: EndpointCategory
    :param additional_info: Additional information.
    :type additional_info: str
    :return: The wrapped function.
    """

    def audit_decorator(f: FunctionType) -> FunctionType:
        @wraps(f)
        def wrap(*args, **kwargs):
            if not request:
                raise ValueError(
                    "Request object is missing! Make sure you're using the decorator in a endpoint."
                )

            student_id = get_jwt_identity()

            if not student_id:
                raise ValueError(
                    "Student ID is missing! Make sure you're using the decorator in a endpoint that requires authentication with a student."
                )

            response: Response = f(*args, **kwargs)
            response_body = response.get_data(as_text=True)

            audit_log = Audit(
                method=request.method,
                endpoint_category=endpoint_category,
                url=request.url.replace(request.host_url, ""),
                response=response_body
                if len(response_body) < 1000
                else response_body[:1000],
                response_code=response.status_code,
                additional_info=additional_info,
                user_agent=request.user_agent.string,
                ip_address=request.remote_addr,
                student_id=student_id,
            )

            db.session.add(audit_log)
            db.session.commit()

            return response

        return wrap

    return audit_decorator
