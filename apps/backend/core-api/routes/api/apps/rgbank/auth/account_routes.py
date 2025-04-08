from typing import List
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from http import HTTPStatus
from models.core.student import StudentMembership
from services.apps.rgbank.auth_service import has_full_authority
from utility.database import db
from models.apps.rgbank.bank import AccountBankInformation

account_bp = Blueprint("bank_account", __name__)


@account_bp.route("", methods=["POST"])
@jwt_required()
def create_account() -> Response:
    """
    Creates a new bank account
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    bank_name = data.get("bank_name")
    sorting_number = data.get("sorting_number")
    account_number = data.get("account_number")

    new_bank_account = AccountBankInformation(
        bank_name=bank_name,
        sorting_number=sorting_number,
        account_number=account_number,
        student_id=get_jwt_identity(),
    )

    db.session.add(new_bank_account)
    db.session.commit()

    return jsonify({"message": "Bank account created successfully"}), HTTPStatus.CREATED


@account_bp.route("/<string:student_id>", methods=["POST"])
@jwt_required()
def get_account(student_id: str) -> Response:
    """
    Retrieves the bank account information for a given student ID
        :param student_id: The ID of the student whose bank account information is to be retrieved
        :return: Response - The response object, 200 if successful, 404 if not found
    """
    request_student_id = get_jwt_identity()

    bank_account = AccountBankInformation.query.filter_by(student_id=student_id).first()

    if request_student_id != student_id:
        memberships: List[StudentMembership] = StudentMembership.query.filter_by(
            student_id=request_student_id
        ).all()
        has_access, message = has_full_authority(
            memberships=memberships, student_id=request_student_id
        )

        if not has_access:
            return jsonify({"error": message}), HTTPStatus.UNAUTHORIZED

    if not bank_account:
        return jsonify({"message": "Bank account not found"}), HTTPStatus.NOT_FOUND

    return jsonify(bank_account.to_dict()), HTTPStatus.OK
