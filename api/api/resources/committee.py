from flask import jsonify
from flask_restful import Resource

from api.models.committee import Committee

class CommitteeResource(Resource):
    def get(self, id):
        committee = Committee.query.get(id)
        return jsonify(committee.get_data())

class CommitteeListResource(Resource):
    def get(self):
        committees = Committee.query.all()
        data = [committee.get_data() for committee in committees]
        return jsonify(data)