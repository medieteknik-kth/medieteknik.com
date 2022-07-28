from flask import jsonify
from flask_restful import Resource
from api.utility.receptionmode import RECEPTION_MODE

class HealthResource(Resource):
    def get(self):
        return jsonify("ok, reception_mode " + str(RECEPTION_MODE))
