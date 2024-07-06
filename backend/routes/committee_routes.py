from flask import Blueprint, jsonify
from utility import database
from services.committees.public import (
    get_committee_data_by_title,
    get_committee_positions_by_committee_title,
)

db = database.db

committee_bp = Blueprint("committee", __name__)


@committee_bp.route("/<string:committee_title>/data", methods=["GET"])
def get_committees_data_by_title(committee_title: str):
    return jsonify(get_committee_data_by_title(committee_title))


@committee_bp.route("/<string:committee_title>/positions", methods=["GET"])
def get_committee_positions_by_title(committee_title: str):
    return jsonify(get_committee_positions_by_committee_title(committee_title))
