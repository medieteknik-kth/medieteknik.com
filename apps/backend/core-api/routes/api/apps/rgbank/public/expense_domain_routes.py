from typing import List
from flask import Blueprint, Response, jsonify
from http import HTTPStatus
from models.apps.rgbank import ExpenseDomain

public_expense_domain_bp = Blueprint("public_expense_domain", __name__)


@public_expense_domain_bp.route("", methods=["GET"])
def get_all_expense_domains() -> Response:
    """
    Gets all expense domains
        :return: Response - The response object, 200 if successful
    """
    domains: List[ExpenseDomain] = ExpenseDomain.query.all()

    return jsonify([domain.to_dict() for domain in domains]), HTTPStatus.OK
