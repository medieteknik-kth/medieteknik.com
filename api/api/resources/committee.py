from flask import jsonify, request
from flask_restful import Resource

from api.models.committee import Committee
from api.models.committee_post import CommitteePost, CommitteePostTerm
from api.resources.authentication import requires_auth

from api.db import db

class CommitteeResource(Resource):
    def get(self, id):
        committee = Committee.query.get(id)
        return jsonify(committee.to_dict())

    @requires_auth
    def put(self, user):
        committee = Committee()
        keys = request.form.keys()
        
        if "id" in keys:
            if "name" in keys:
                committee.name = request.form["name"]
            if "logo" in keys:
                committee.logo = request.form["logo"]
        else:
            return jsonify({"message": "missing id"}), 400

    @requires_auth
    def post(self, user):
        pass

    @requires_auth
    def delete(self, id, user):
        committee = Committee.query.get_or_404(id)
        db.session.delete(committee)
        db.session.commit()
        return jsonify({"message": "ok"})

class CommitteeListResource(Resource):
    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)
        committees = Committee.query.paginate(page=page, per_page=per_page)
        data = [committee.to_basic_dict() for committee in committees.items]
        return jsonify({"data": data, "totalCount": committees.total})

class CommitteePostListWithCommitteeResource(Resource):
    def get(self, id):
        posts = CommitteePost.query.filter_by(committee_id=id)
        data = [post.to_dict_with_all_terms() for post in posts]
        return jsonify(data)
    
    @requires_auth
    def post(self, id, user):
        committee = Committee.query.get(id)
        return jsonify({"message": "success"})

    @requires_auth
    def put(self, id, user):
        committee = Committee.query.get(id)
        return jsonify({"message": "success"})

    @requires_auth
    def delete(self, id, user):
        committee = Committee.query.get(id)
        return jsonify({"message": "success"})
