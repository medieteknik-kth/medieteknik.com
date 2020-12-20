from flask import jsonify, request
from flask_restful import Resource
from api.db import db

from api.models.committee_post import CommitteePost

from api.resources.authentication import requires_auth

class CommitteePostResource(Resource):
    def get(self, id):
        committee_post = CommitteePost.query.get(id)
        return jsonify(committee_post.to_dict())

    @requires_auth
    def delete(self, id):
        post = CommitteePost.query.filter_by(id=id).first_or_404()
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "ok"})

    @requires_auth
    def put(self, id):
        post = CommitteePost.query.filter_by(id=id).first_or_404()
        keys = request.form.keys()

        if "name" in keys:
            post.name = request.form["name"]
            new_name = request.form["name"]
        if "email" in keys:
            post.officials_email = request.form["email"]
        if "committeeId" in keys:
            post.committee_id = request.form["committeeId"]
        if "isOfficial" in keys:
            post.is_official = request.form["isOfficial"]

        db.session.commit()
        return jsonify({"message": "ok"})


class CommitteePostListResource(Resource):
    def get(self):
        committee_posts = CommitteePost.query.all()
        data = [committee_post.to_dict() for committee_post in committee_posts]
        return jsonify(data)

    def post(self):
        # Ny post
        pass
