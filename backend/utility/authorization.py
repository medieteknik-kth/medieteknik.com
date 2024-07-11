from flask_oidc import OpenIDConnect
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager

oauth = OAuth()
jwt = JWTManager()
oidc = OpenIDConnect()