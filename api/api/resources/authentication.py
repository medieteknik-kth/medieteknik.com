from flask import jsonify, session, request
from flask_restful import Resource
from flask_cas import login_required

from itsdangerous import (TimedJSONWebSignatureSerializer
                          as Serializer, BadSignature, SignatureExpired)

from api.models.user import User

class AuthenticationResource(Resource):
    def post(self):
        if "token" in request.form.keys():
            token = request.form["token"]
            s = Serializer("hejpådig")
            try:
                data = s.loads(token)
            except SignatureExpired:
                return {
                    "message": "Token expired"
                }, 400
            except BadSignature:
                return {
                    "message": "Invalid token"
                }, 400
            
            current_user = User.query.filter_by(kth_id=data["kth_id"]).first()
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

    def generate_auth_token(self, expiration = 2700):
        s = Serializer("hejpådig", expires_in = expiration)
        return s.dumps({ 'kth_id': self.id })


class CASResource(Resource):
    def get(self):
        if "CAS_USERNAME" in session:
            user = User.query.filter_by(kth_id=session["CAS_USERNAME"]).first()
            
            if not user:
                return {
                    "token": None
                }, 404
            
            s = Serializer("hejpådig", expires_in = 3600)
            data = s.dumps({ 'kth_id': user.kth_id })
            token = data.decode('utf-8')
            return jsonify({"token": token})