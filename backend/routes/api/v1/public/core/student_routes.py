"""
Student Routes (Public)
API Endpoint: '/api/v1/public/students'
"""

from http import HTTPStatus
from flask import Blueprint, Response, jsonify, request
from typing import Any, Dict, List
from models.core import Student, Profile, StudentMembership
from services.core.public import (
    retrieve_all_committee_members,
    retrieve_student_membership_by_id,
)
from utility import retrieve_languages

public_student_bp = Blueprint("public_student", __name__)


@public_student_bp.route("/", methods=["GET"])
def get_students() -> Response:
    """
    Retrieves all students
        :return: Response - The response object, 200 if successful
    """

    search_query = request.args.get("q", type=str, default=None)
    paginated_items = None

    if search_query:
        paginated_items = Student.query.filter(
            Student.first_name.ilike(f"%{search_query}%")
            | Student.last_name.ilike(f"%{search_query}%")
            | Student.email.ilike(f"%{search_query}%")
        ).paginate(max_per_page=10)
    else:
        paginated_items = Student.query.paginate(max_per_page=10)

    students: List[Student] = paginated_items.items
    students_dict = [student.to_dict(is_public_route=True) for student in students]
    return jsonify(
        {
            "items": students_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    ), HTTPStatus.OK


@public_student_bp.route("/<string:student_id>", methods=["GET"])
def get_student_by_id(student_id: str) -> Response:
    """
    Retrieves a student by ID
        :param student_id: str - The ID of the student
        :return: Response - The response object, 404 if the student is not found, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)
    detailed = request.args.get("detailed", type=bool, default=False)

    student = Student.query.get_or_404(student_id)

    profile = Profile.query.filter_by(student_id=student_id).first()

    data = {}
    data["student"] = student.to_dict(is_public_route=True)
    data["profile"] = profile.to_dict() if profile else None

    if detailed:
        data["memberships"] = [
            {
                "position": membership.committee_position.to_dict(
                    provided_languages=provided_languages, include_parent=True
                ),
                "initiation_date": membership.initiation_date,
                "termination_date": membership.termination_date,
            }
            for membership in retrieve_student_membership_by_id(student_id)
        ]

    return jsonify(data), HTTPStatus.OK


@public_student_bp.route("/<string:student_id>/profile", methods=["GET"])
def get_student_profile(student_id: str) -> Response:
    """
    Retrieves a student profile by ID
        :param student_id: str - The ID of the student
        :return: Response - The response object, 404 if the student is not found, 200 if successful
    """

    profile = Profile.query.filter_by(student_id=student_id).first_or_404()

    return jsonify(profile.to_dict()), HTTPStatus.OK


@public_student_bp.route("/<string:email>", methods=["GET"])
def get_student_by_email(email: str) -> Response:
    """
    Retrieves a student by email
        :param email: str - The email of the student
        :return: Response - The response object, 404 if the student is not found, 200 if successful
    """

    student = Student.query.filter_by(email=email).first_or_404()

    return jsonify(student.to_dict(is_public_route=True)), HTTPStatus.OK


@public_student_bp.route("/committee_members", methods=["GET"])
def get_committee_members() -> Response:
    """
    Retrieves all committee members
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(request.args)

    committee_memberships: List[StudentMembership] = retrieve_all_committee_members(
        provided_languages
    )

    # Construct the result from the joined data
    committee_members: List[Dict[str, Any]] = [
        {
            "student": membership.student.to_dict(),
            "position": membership.committee_position.to_dict(
                provided_languages=provided_languages, include_parent=True
            ),
            "initiation_date": membership.initiation_date,
            "termination_date": membership.termination_date,
        }
        for membership in committee_memberships
    ]

    return jsonify(committee_members), HTTPStatus.OK
