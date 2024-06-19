from functools import wraps
from flask_oidc import OpenIDConnect
from authlib.integrations.flask_client import OAuth

oauth = OAuth()
oidc = OpenIDConnect()


def requires_authorization():
    # TODO: Implement decorator
    pass
