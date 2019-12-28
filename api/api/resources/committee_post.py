from flask import jsonify
from flask_restful import Resource

from api.models.committee_post import CommitteePost

class CommitteePostResource(Resource):
    def get(self, id):
        committee_post = CommitteePost.query.get(id)
        return jsonify(committee_post.get_data())

class CommitteePostListResource(Resource):
    def get(self):
        committee_posts = CommitteePost.query.all()
        data = [committee_post.get_data() for committee_post in committee_posts]
        return jsonify(data)