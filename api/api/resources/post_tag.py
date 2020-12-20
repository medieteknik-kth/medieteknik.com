from flask import jsonify, session, request, make_response
from flask_restful import Resource

from api.db import db
from api.models.post_tag import PostTag

from api.resources.authentication import requires_auth

class PostTagResource(Resource):
    def get(self, id):
        """
        Returns a post tag by id.
        ---
        tags:
            - Posts
        parameters:
        - name: id
          in: query
          schema:
            type: integer
        responses:
            200:
                description: OK
        """   
        tag = PostTag.query.get(id)
        return jsonify(tag.to_dict())


    @requires_auth
    def put(self, id, user):
        """
        Edits a post tag.
        ---
        tags:
            - Posts
        parameters:
        - name: id
          in: query
          schema:
            type: integer
        - name: tag
          in: body
          schema:
            type: object
            properties:
              title:
                type: number
        responses:
            200:
                description: OK
        """
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
        """
        Adds a new post tag.
        ---
        tags:
            - Posts
        parameters:
        - name: id
          in: query
          schema:
            type: integer
        - name: tag
          in: body
          schema:
            type: object
            properties:
              title:
                type: number
        responses:
            200:
                description: OK
        """
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
        """
        Returns a list of all post tags.
        ---
        tags:
            - Posts
        responses:
            200:
                description: OK
        """   
        tags = PostTag.query.all()
        data = [tag.to_dict() for tag in tags]
        return jsonify(data)
