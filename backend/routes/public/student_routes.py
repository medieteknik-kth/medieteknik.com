"""
Student Routes (Public)
API Endpoint: '/api/v1/public/students'
"""

from typing import Any, Dict, List
from flask import Blueprint, jsonify, request
from models.core import Student, Profile
from services.core.public.student import (
    retrieve_all_committee_members,
    retrieve_student_membership_by_id,
)
from utility.translation import retrieve_languages

public_student_bp = Blueprint("public_student", __name__)


@public_student_bp.route("/", methods=["GET"])
def get_students():
    """Retrieves all students

    Returns:
        list[dict]: List of students
    """
    paginated_items = Student.query.paginate()

    students: list[Student] = paginated_items.items
    students_dict = [student.to_dict(is_public_route=True) for student in students]
    return jsonify(
        {
            "items": students_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )


@public_student_bp.route("/<string:student_id>", methods=["GET"])
def get_student(student_id: str):
    """Retrieves a student

    Args:
        student_id (str): Student ID

    Returns:
        dict: Student
    """
    provided_languages = retrieve_languages(request.args)
    detailed = request.args.get("detailed", type=bool, default=False)

    student = Student.query.get(student_id)

    if not student and not isinstance(student, Student):
        return jsonify({}), 404

    profile = Profile.query.filter_by(student_id=student_id).first()

    data = {}
    data["student"] = student.to_dict(is_public_route=True)
    data["profile"] = profile.to_dict() if profile else None

    if detailed:
        data["memberships"] = [
            {
                "position": membership.committee_position.to_dict(
                    provided_languages=provided_languages,
                    include_committee_logo=True,
                ),
                "initiation_date": membership.initiation_date,
                "termination_date": membership.termination_date,
            }
            for membership in retrieve_student_membership_by_id(student_id)
        ]

    return jsonify(data)


@public_student_bp.route("/committee_members", methods=["GET"])
def get_committee_members():
    """Retrieves all committee members

    Returns:
        list[dict]: List of committee members
    """
    provided_languages = retrieve_languages(request.args)

    # Use a single query with join to fetch all data at once
    committee_memberships = retrieve_all_committee_members(provided_languages)

    # Construct the result from the joined data
    committee_members: List[Dict[str, Any]] = [
        {
            "position": membership.committee_position.to_dict(
                provided_languages=provided_languages, include_committee_logo=True
            ),
            "student": membership.student.to_dict(),
            "initiation_date": membership.initiation_date,
            "termination_date": membership.termination_date,
        }
        for membership in committee_memberships
    ]

    return jsonify(committee_members)
