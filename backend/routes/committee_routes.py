from flask import Blueprint
from utility import database

db = database.db

committee_bp = Blueprint('committee', __name__)


