from flask import jsonify
from flask_restful import Resource

class HealthResource(Resource):
    def get(self):
        return jsonify("ok")