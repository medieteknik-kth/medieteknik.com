from typing import List
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from http import HTTPStatus
from models.apps.rgbank import ExpenseDomain, RGBankPermissions
from models.core import StudentMembership
from utility import db

expense_domain_bp = Blueprint("expense_domain", __name__)


@expense_domain_bp.route("", methods=["POST"])
@jwt_required()
def create_expense_domain() -> Response:
    """
    Creates a new expense domain
        :return: Response - The response object, 201 if successful
    """

    student_id = get_jwt_identity()
    positions: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()
    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [position.committee_position_id for position in positions]
        )
    ).all()
    if not permissions:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    has_permission = False

    for permission in permissions:
        if permission.access_level == 2:
            has_permission = True
            break

    if not has_permission:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    title: str | None = data.get("title")
    parts: List[str] | None = data.get("parts")
    committee_id: str | None = data.get("committee_id")

    if not parts:
        return jsonify({"error": "Parts are required"}), HTTPStatus.BAD_REQUEST

    if not title and not committee_id:
        return jsonify(
            {"error": "Title or committee_id is required"}
        ), HTTPStatus.BAD_REQUEST

    if not isinstance(parts, list):
        return jsonify({"error": "Parts must be a list"}), HTTPStatus.BAD_REQUEST

    if not all(isinstance(part, str) for part in parts):
        return jsonify({"error": "All parts must be strings"}), HTTPStatus.BAD_REQUEST

    if committee_id and not isinstance(committee_id, str):
        return jsonify(
            {"error": "Committee ID must be a string"}
        ), HTTPStatus.BAD_REQUEST

    new_domain = ExpenseDomain(
        title=title,
        parts=parts,
        commitee_id=committee_id,
    )

    db.session.add(new_domain)
    db.session.commit()

    return jsonify(
        {"message": "Expense domain created successfully"}
    ), HTTPStatus.CREATED


@expense_domain_bp.route("/<string:expense_id>", methods=["PUT"])
@jwt_required()
def update_expense_domain(expense_id: str) -> Response:
    """
    Updates an expense domain
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity()
    positions: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()
    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [position.committee_position_id for position in positions]
        )
    ).all()
    if not permissions:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    has_permission = False

    for permission in permissions:
        if permission.access_level == 2:
            has_permission = True
            break

    if not has_permission:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    expense_domain: ExpenseDomain = ExpenseDomain.query.get_or_404(expense_id)

    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    title: str | None = data.get("title")
    parts: List[str] | None = data.get("parts")
    committee_id: str | None = data.get("committee_id")

    if title and committee_id:
        return jsonify(
            {"error": "Only one of title or committee_id can be provided"}
        ), HTTPStatus.BAD_REQUEST

    if title:
        expense_domain.title = title

    if parts:
        if not isinstance(parts, list):
            return jsonify({"error": "Parts must be a list"}), HTTPStatus.BAD_REQUEST

        if not all(isinstance(part, str) for part in parts):
            return jsonify(
                {"error": "All parts must be strings"}
            ), HTTPStatus.BAD_REQUEST

        expense_domain.parts = parts

    if committee_id:
        if not isinstance(committee_id, str):
            return jsonify(
                {"error": "Committee ID must be a string"}
            ), HTTPStatus.BAD_REQUEST

        expense_domain.committee_id = committee_id

    return jsonify({"message": "Expense domain updated successfully"}), HTTPStatus.OK


@expense_domain_bp.route("/<string:expense_id>", methods=["DELETE"])
@jwt_required()
def delete_expense_domain(expense_id: str) -> Response:
    """
    Deletes an expense domain
        :return: Response - The response object, 200 if successful
    """

    student_id = get_jwt_identity()
    positions: List[StudentMembership] = StudentMembership.query.filter(
        StudentMembership.student_id == student_id,
        StudentMembership.termination_date.is_(None),
    ).all()
    permissions: List[RGBankPermissions] = RGBankPermissions.query.filter(
        RGBankPermissions.committee_position_id.in_(
            [position.committee_position_id for position in positions]
        )
    ).all()
    if not permissions:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    has_permission = False

    for permission in permissions:
        if permission.access_level == 2:
            has_permission = True
            break

    if not has_permission:
        return jsonify(
            {"error": "You do not have permission to create an expense domain"}
        ), HTTPStatus.FORBIDDEN

    expense_domain: ExpenseDomain = ExpenseDomain.query.get_or_404(expense_id)

    db.session.delete(expense_domain)
    db.session.commit()

    return jsonify({"message": "Expense domain deleted successfully"}), HTTPStatus.OK
