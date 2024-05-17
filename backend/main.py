from flask import Flask
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
# from decorators.authorization import oauth
from utility.database import db
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'secret')
app.config.from_object('config')

# Enable CORS
CORS(app, supports_credentials=True, 
        origins=['http://localhost:3000', 'https://medieteknik.com'], allow_headers=['Content-Type', 'Authorization'], 
        expose_headers=['Content-Type', 'Authorization'], 
        methods=['GET', 'POST', 'PUT', 'DELETE'],
        max_age=86400
     )

db.init_app(app)

# CSRF protection 
csrf = CSRFProtect(app)

# Rate limiting for API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per hour"],
    storage_uri=os.environ.get('REDIS_URL', 'memory://'),
)

# OAuth
# oauth.init_app(app)
# oauth.register('kth', kwargs={
#     'scope': 'openid email',
#     'access type': 'offline',
#     'response_type': 'token',
# })

if __name__ == '__main__':
    app.run(debug=True)
