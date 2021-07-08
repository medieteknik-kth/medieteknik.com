from flask import jsonify, request
from flask_restful import Resource
from api.db import db

from api.models.committee_post import CommitteePost, CommitteePostTerm

from api.resources.authentication import requires_auth
import datetime


class CommitteePostResource(Resource):
    def get(self, id):
        committee_post = CommitteePost.query.get(id)
        return jsonify(committee_post.to_dict())

    @requires_auth
    def delete(self, id, user):
        post = CommitteePost.query.filter_by(id=id).first_or_404()
        db.session.delete(post)
        db.session.commit()
        return jsonify({"message": "ok"})

    @requires_auth
    def put(self, id, user):
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

    @requires_auth
    def post(self, id, user):
        data = request.json

        if data.get("userId") and data.get("startDate") and data.get("endDate"):
            post = CommitteePostTerm()
            post.post_id = id
            post.user_id = data.get("userId")
            post.start_date = datetime.strptime(data.get('startDate'), "%Y-%m-%d")
            post.end_date = datetime.strptime(data.get('endDate'), "%Y-%m-%d")
            db.session.add(post)
            db.session.commit()
            return jsonify(post.to_dict())
        else:
            return {"message": "Invalid request"}, 400


class CommitteePostListResource(Resource):
    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)
        is_official = request.args.get('isOfficial', False, type=bool)

        if is_official:
            q = CommitteePost.query.join(CommitteePostTerm).filter(CommitteePostTerm.post.has(CommitteePost.is_official == True))
        else:
            q = CommitteePost.query

        committee_posts = q.paginate(page=page, per_page=per_page)
        data = [committee_post.to_dict() for committee_post in committee_posts.items]
        return jsonify({"data": data, "totalCount": committee_posts.total})

    def post(self):
        # Ny post
        pass
