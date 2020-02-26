from flask import jsonify
from flask_restful import Resource

from sqlalchemy import or_

from api.models.post import Post

class PostResource(Resource):
    def get(self):
        posts = Post.query.all()
        data = [post.to_dict() for post in posts]
        return jsonify(data)