from flask import jsonify, session, request, make_response
from flask_restful import Resource

from api.db import db
from api.models.post_tag import PostTag

class PostTagResource(Resource):
    def get(self, id):
        tag = PostTag.query.get(id)
        return jsonify(tag.to_dict())

    def put(self, id):
        try:
            data = request.form
            tag = PostTag.query.get(id)
            if data.get("title"):
                tag.title = data.get("title")
            
            db.session.commit()
            return make_response(jsonify(success=True))
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 403)

class PostTagAddResource(Resource):
    def post(self):
        try:
            data = request.form
            tag = PostTag()
            if data.get("title"):
                tag.title = data.get("title")

            db.session.add(tag)
            db.session.commit()
            return make_response(jsonify(success=True, id=tag.id))
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 403)
        
class PostTagListResource(Resource):
    def get(self):
        tags = PostTag.query.all()
        data = [tag.to_dict() for tag in tags]
        return jsonify(data)
