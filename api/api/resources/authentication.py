from flask import jsonify, session, request, redirect, url_for
from flask_restful import Resource
from flask_cas import login_required
from functools import wraps

from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

import cachecontrol
import google.auth.transport.requests
import requests
from google.oauth2 import id_token

from api.models.user import User
from api.models.committee_post import CommitteePost

import os

secret = os.getenv("SECRET_KEY", "2kfueoVmpd0FBVFCJD0V")

def check_token(token):
    session = requests.session()
    cached_session = cachecontrol.CacheControl(session)
    request = google.auth.transport.requests.Request(session=cached_session)

    try:
        id_info = id_token.verify_token(token, request, '881584931454-ankmp9jr660l8c1u91cbueb4eaqeddbt.apps.googleusercontent.com')
    except:
        return None

    if id_info['iss'] != 'accounts.google.com':
        return None

    userid = id_info['email']
    return userid

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('token')
        if not token:
            return {
                "message": "Missing token"
            }, 400
        
        user_id = check_token(token)
        if not user_id:
            return {
                "message": "Invalid token"
            }, 401
        
        user = User.query.filter_by(kth_id=user_id).first()
        official = CommitteePost.query.filter_by(officials_email=user_id).first()
        if not user and not official:
            return {
                "message": "Invalid user"
            }, 401
        
        kwargs["user"] = user if user else official.current_terms()[0].user
        return f(*args, **kwargs)

    return decorated

class AuthenticationResource(Resource):
    def post(self):
        if "token" in request.form.keys():
            token = request.form["token"]
            user_id = check_token(token)

            if not user_id:
                return {
                    "authenticated": False,
                    "message": "Invalid token"
                }, 400

            user = User.query.filter_by(kth_id=user_id).first()
            official = CommitteePost.query.filter_by(officials_email=user_id).first()
            if not user and not official:
                return {
                    "message": "Invalid user"
                }, 401

            if not user and not official:
                return {
                    "authenticated": False,
                    "message": "Invalid user"
                }, 404
            else:
                response = {
                    "authenticated": True,
                    "user": (user if user else official).to_dict()
                }

                return jsonify(response)
        else:
            return {
                "message": "Missing token"
            }, 400
