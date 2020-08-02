from flask import jsonify, session, request, redirect, url_for
from flask_restful import Resource
from flask_cas import login_required
from functools import wraps

from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

from api.models.user import User

import os

secret = os.getenv("SECRET_KEY", "2kfueoVmpd0FBVFCJD0V")

def check_token(token):
    s = Serializer(secret)
    try:
        data = s.loads(token)
    except:
        return None
    
    return data["kth_id"]

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('token')
        if not token:
            return {
                "message": "Missing token"
            }, 400
        
        kth_id = check_token(token)
        if not kth_id:
            return {
                "message": "Invalid token"
            }, 401
        
        user = User.query.filter_by(kth_id=kth_id).first()
        if not user:
            return {
                "message": "Invalid user"
            }, 401

        kwargs["user"] = user
        return f(*args, **kwargs)

    return decorated

class AuthenticationResource(Resource):
    def post(self):
        if "token" in request.form.keys():
            token = request.form["token"]
            kth_id = check_token(token)

            if not kth_id:
                return {
                    "authenticated": False,
                    "message": "Invalid token"
                }, 400

            current_user = User.query.filter_by(kth_id=kth_id).first()
            if not current_user:
                return {
                    "authenticated": False,
                    "message": "Invalid user"
                }, 404
            else:
                response = {
                    "authenticated": True,
                    "user": current_user.to_dict()
                }

                return jsonify(response)
        else:
            return {
                "message": "Missing token"
            }, 400


class CASResource(Resource):
    def get(self):
        if "origin" in request.args.keys():
            session["origin"] = request.args["origin"]

        if "CAS_USERNAME" not in session:
            return redirect(url_for("cas.login"))
        
        if "origin" in session and "CAS_USERNAME" in session:
            user = User.query.filter_by(kth_id=session["CAS_USERNAME"]).first()
            
            if not user:
                origin = session.pop("origin")
                return redirect(origin)
            else:
                s = Serializer(secret, expires_in = 3600)
                data = s.dumps({ 'kth_id': user.kth_id })
                token = data.decode('utf-8')
                origin = session.pop("origin")
                return redirect(origin + "?token=" + token)
        
        return "Invalid request", 400