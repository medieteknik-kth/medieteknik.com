from flask import jsonify, request
from flask_restful import Resource
from functools import wraps
from flask_oidc import OpenIDConnect

from api.models.user import User

import os

secret = os.getenv("SECRET_KEY", "2kfueoVmpd0FBVFCJD0V")
oidc = OpenIDConnect()

def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if not oidc.user_loggedin:
            return {
               "message": "Requires authentication"
            }, 403

        kth_id = oidc.user_getfield("kthid")
        user = User.query.filter_by(kth_id=kth_id).first()
        if not user:
            return {
                "message": "Invalid user"
            }, 403
        
        kwargs["user"] = user
        return f(*args, **kwargs)

    return decorated

class AuthenticationResource(Resource):
    @requires_auth
    def get(self, user):
        return user.to_dict_without_terms()