from flask import jsonify, session, request, make_response
from flask_restful import Resource
from sqlalchemy import or_, and_, cast
from datetime import datetime
import json

from api.db import db

from sqlalchemy import and_, exc
from api.models.post import Post, PostEdit
from api.models.post_tag import PostTag
from api.models.user import User
from api.models.committee import Committee
from api.resources.authentication import requires_auth

import os
from werkzeug.utils import secure_filename
from werkzeug.datastructures import ImmutableMultiDict
import uuid

import base64

from api.resources.common import parseBoolean

SAVE_FOLDER = os.path.join(os.getcwd(), "api", "static", "posts")
IMAGE_PATH = "static/posts/"
IMAGE_COL = "header_image"
ISO_DATE_DEF = "%Y-%m-%dT%H:%M:%S.%fZ"

class PostResource(Resource):
    def get(self, id):
        """
        Returns a post by id.
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
        post = Post.query.get(id)
        return jsonify(post.to_dict())

    @requires_auth
    def put(self, id):
        """
        Edits a post by id.
        ---
        tags:
            - Posts
        security:
            - authenticated: []
        parameters:
        - name: id
          in: query
          schema:
            type: integer
        - name: post
          in: body
          schema:
            type: object
            properties:
              committee_id:
                type: number   
              header_image:
                type: string
                format: binary
              title:
                type: string
              title_en:
                type: string
              body:
                type: string
              body_en:
                type: string
              scheduled_date:
                type: string
                format: date-time
              draft:
                type: boolean
              tags:
                type: array
                items:
                    type: integer
        responses:
            200:
                description: OK
            400:
                description: Missing authentication token
            402:
                description: Not authenticated
        """
        try:
            post = Post.query.get(id)
            user = User.query.filter(User.kth_id == session["CAS_USERNAME"]).first()
            post_user = (user.id == post.user_id)

            committee_member = False
            if(not post_user): 
                for post_term in user.post_terms:
                    if((post_term.post.committee_id == post.committee_id) and (post_term.start_date < datetime.today() < post_term.end_date)):
                        committee_member = True
            data = request.form

            if post_user or committee_member:
                
                add_cols(data, post, request)

                edit = PostEdit()
                edit.post = post
                edit.user_id = user.id
                edit.post_id = post.id
                
                db.session.add(edit)
                db.session.commit()
                return make_response(jsonify(success=True))
            else:
                raise Exception("this user can't edit this post") 
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 402)

class PostAddResouce(Resource):
    @requires_auth
    def post(self, user):
        """
        Adds a new post.
        ---
        tags:
            - Posts
        security:
            - authenticated: []
        parameters:
        - name: id
          in: query
          schema:
            type: integer
        - name: post
          in: body
          schema:
            type: object
            properties:
              committee_id:
                type: number   
              header_image:
                type: string
                format: binary
              title:
                type: string
              title_en:
                type: string
              body:
                type: string
              body_en:
                type: string
              scheduled_date:
                type: string
                format: date-time
              draft:
                type: boolean
              tags:
                type: array
                items:
                    type: integer
        responses:
            200:
                description: OK
            400:
                description: Missing authentication token
            402:
                description: Not authenticated
        """
        try:
            data = request.form

            if user.id:
                post = Post()
                post.user_id = user.id
                add_cols(data, post, request)
                db.session.add(post)
                db.session.commit()
                return make_response(jsonify(success=True, id=post.id))
            else:
                raise Exception("user not found")
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 403)
        
class PostListResource(Resource): 
    def get(self):
        """
        Returns a list of all posts.
        ---
        tags:
            - Posts
        responses:
            200:
                description: OK
        """
        scheduled_condition = [Post.scheduled_date <= datetime.now(), Post.scheduled_date == None]
        posts = Post.query.filter(and_(Post.draft == False, or_(*scheduled_condition)))
        data = [post.to_dict() for post in posts]
        return jsonify(data)

def parseBoolean(string):
    d = {'true': True, 'false': False}
    return d.get(string, string)

def add_cols(data, post, request):
    dynamic_cols = ["committee_id", "title", "body", "title_en", "body_en"]
    date_cols = ["scheduled_date"]
    boolean_cols = ["draft"]

    for col in dynamic_cols: 
        if data.get(col):
            setattr(post, col, data.get(col))

    for col in date_cols: 
      if data.get(col):
          setattr(post, col, datetime.strptime(data.get(col), ISO_DATE_DEF))

    for col in boolean_cols: 
      if data.get(col):
          setattr(post, col, parseBoolean(data.get(col)))

    if IMAGE_COL in request.files:
        image = request.files[IMAGE_COL]
        post.header_image = save_image(image, IMAGE_PATH)
    
    if data.get("tags"):
        tags = json.loads(data["tags"])
        for tag_id in tags:
            post.tags.append(PostTag.query.get(tag_id))


def save_image(image, path):
    local_path = ""
    ALLOWED_EXTENTIONS = [".png", ".jpg", ".jpeg"]
    original_filename, extension = os.path.splitext(secure_filename(image.filename))
    filename = str(uuid.uuid4()) + extension
    if extension in ALLOWED_EXTENTIONS:
        path = os.path.join(path, filename)
        local_path = os.path.join(SAVE_FOLDER, filename)
        image.save(local_path)
        return path
    else:
        raise "you can only upload .png or .jpg-files."