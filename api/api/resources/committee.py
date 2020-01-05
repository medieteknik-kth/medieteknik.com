from flask import jsonify
from flask_restful import Resource

from api.models.committee import Committee

class CommitteeResource(Resource):
    def get(self, id):
        committee = Committee.query.get(id)
        return jsonify(committee.to_dict())

class CommitteeListResource(Resource):
    def get(self):
        committees = Committee.query.all()
        data = [committee.to_dict() for committee in committees]
        return jsonify(data)