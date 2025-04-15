from os import environ
from typing import Any, Dict, List
from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from cryptography.fernet import Fernet
from http import HTTPStatus
from models.core import StudentMembership
from models.apps.rgbank import AccountBankInformation
from services.apps.rgbank import has_full_authority
from utility import db

account_bp = Blueprint("bank_account", __name__)


@account_bp.route("", methods=["POST"])
@jwt_required()
def create_account() -> Response:
    """
    Creates a new bank account
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """
    data: Dict[str, Any] = request.get_json()

    if not data:
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    bank_name: str | None = data.get("bank_name")
    clearing_number: str | None = data.get("clearing_number")
    account_number: str | None = data.get("account_number")
    student_id = get_jwt_identity()

    bank_account: AccountBankInformation | None = (
        AccountBankInformation.query.filter_by(student_id=student_id).first()
    )

    # All fields must be provided
    if not bank_account and (
        not bank_name or not clearing_number or not account_number
    ):
        return jsonify({"message": "No data provided"}), HTTPStatus.BAD_REQUEST

    cipher = Fernet(environ.get("FERNET_KEY"))
    if bank_name:
        bank_name = cipher.encrypt(bank_name.encode()).decode()
    if clearing_number:
        clearing_number = cipher.encrypt(clearing_number.encode()).decode()
    if account_number:
        account_number = cipher.encrypt(account_number.encode()).decode()

    if bank_account and isinstance(bank_account, AccountBankInformation):
        # Atleast one field must be provided
        if not bank_name and not clearing_number and not account_number:
            return jsonify(
                {"message": "Atleast one field must be provided"}
            ), HTTPStatus.BAD_REQUEST
        bank_account.bank_name = bank_name
        bank_account.clearing_number = clearing_number
        bank_account.account_number = account_number

        db.session.commit()
        return jsonify({"message": "Bank account updated successfully"}), HTTPStatus.OK

    new_bank_account = AccountBankInformation(
        bank_name=bank_name,
        clearing_number=clearing_number,
        account_number=account_number,
        student_id=student_id,
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
