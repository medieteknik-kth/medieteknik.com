from flask import jsonify, session, request, make_response
from flask_restful import Resource
from datetime import datetime

from api.db import db

from sqlalchemy import and_, exc

from api.models.post import Post, PostEdit
from api.models.user import User
from api.models.committee import Committee

dynamic_cols = ['committee_id', 'title', 'header_image', 'body']

class PostResource(Resource):
    def get(self, id):
        post = Post.query.get(id)
        return jsonify(post.to_dict())

    def put(self, id):
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
                for col in dynamic_cols: 
                    if data.get(col):
                        setattr(post, col, data.get(col))

                post_edit = PostEdit()
                post_edit.post = post
                post_edit.user_id = user.id
                post_edit.post_id = post.id
                
                db.session.add(post_edit)
                db.session.commit()
                return make_response(jsonify(success=True))
            else:
                raise Exception("this user can't edit this post") 
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 403)

class PostAddResouce(Resource):
    def post(self):
        try:
            data = request.form
            user = User.query.filter_by(kth_id=session["CAS_USERNAME"]).first()
            
            if user:
                post = Post()
                post.user_id = user.id
                
                for col in dynamic_cols: 
                    if data.get(col):
                        setattr(post, col, data.get(col))

                db.session.add(post)
                db.session.commit()
                return make_response(jsonify(success=True, id=post.id))
            else:
                raise Exception("user not found") 
        except Exception as error:
            return make_response(jsonify(success=False, error=str(error)), 403)
        

class PostListResource(Resource):
    def get(self):
        posts = Post.query.all()
        data = [post.to_dict() for post in posts]
        return jsonify(data)