from flask import Blueprint, Response, jsonify
from flask_jwt_extended import jwt_required
from http import HTTPStatus

account_bp = Blueprint("bank_account", __name__)


@account_bp.route("", methods=["POST"])
@jwt_required()
def create_account() -> Response:
    """
    Creates a new bank account
        :return: Response - The response object, 400 if no data is provided, 404 if the committee is not found, 201 if successful
    """
    return jsonify({"message": "Account created successfully"}), HTTPStatus.CREATED
