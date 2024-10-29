"""
Utility for authorization variables.
"""

from flask_oidc import OpenIDConnect
from authlib.integrations.flask_client import OAuth
from flask_jwt_extended import JWTManager

oidc = OpenIDConnect()
oauth = OAuth()
jwt = JWTManager()
