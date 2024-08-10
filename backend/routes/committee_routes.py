"""
Committee Routes (Protected)
API Endpoint: '/api/v1/committees'
"""

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from services.committees.committee import update_committee
from utility import database
from services.committees.public import (
    get_committee_data_by_title,
    get_committee_positions_by_committee_title,
)
from utility.translation import retrieve_languages

db = database.db

committee_bp = Blueprint("committee", __name__)


@committee_bp.route("/<string:committee_title>/data", methods=["GET"])
@jwt_required()
def get_committees_data_by_title(committee_title: str):
    return jsonify(get_committee_data_by_title(committee_title))


@committee_bp.route("/<string:committee_title>/positions", methods=["GET"])
@jwt_required()
def get_committee_positions_by_title(committee_title: str):
    return jsonify(get_committee_positions_by_committee_title(committee_title))


@committee_bp.route("/<string:committee_title>", methods=["PUT"])
@jwt_required()
def update_committee_by_title(committee_title: str):
    languages = retrieve_languages(request.args)
    return jsonify(
        update_committee(
            request=request,
            committee_title=committee_title,
            provided_languages=languages,
        )
    )
