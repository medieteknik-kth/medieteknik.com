from typing import List
from flask import Blueprint, Response, jsonify, make_response
from http import HTTPStatus
from models.apps.rgbank import ExpenseDomain

public_expense_domain_bp = Blueprint("public_expense_domain", __name__)


@public_expense_domain_bp.route("", methods=["GET"])
def get_all_expense_domains() -> Response:
    """
    Gets all expense domains
        :return: Response - The response object, 200 if successful
    """
    domains: List[ExpenseDomain] = ExpenseDomain.query.order_by(
        ExpenseDomain.title.asc()
    ).all()

    response = make_response(jsonify([domain.to_dict() for domain in domains]))
    response.status_code = HTTPStatus.OK
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"

    return response
