from flask import jsonify, request
from flask_restful import Resource

from api.models.committee import Committee

class CommitteeResource(Resource):
    def get(self, id):
        committee = Committee.query.get(id)
        return jsonify(committee.to_dict())

    def put(self):
        committee = Committee()
        keys = request.form.keys()
        
        if "id" in keys:
            if "name" in keys:
                committee.name = request.form["name"]
            if "posts" in keys:
                committee.name = request.form["posts"]
            if "logo" in keys:
                committee.name = request.form["logo"]
            if "header_image" in keys:
                committee.name = request.form["header_image"]
        else:
            return jsonfiy({"message": "missing id"}), 400

    def post(self):
        pass

class CommitteeListResource(Resource):
    def get(self):
        committees = Committee.query.all()
        data = [committee.to_dict() for committee in committees]
        return jsonify(data)

