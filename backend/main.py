import os

from flask import Flask, url_for, session, request, make_response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from utility.database import db
from decorators.authorization import oauth
from routes import register_routes
from utility.constants import API_VERSION, ROUTES, PUBLIC_PATH, PROTECTED_PATH

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'secret')
app.config.from_object('config')

# Enable CORS
CORS(app, 
        supports_credentials=True,
        origins=['http://localhost:3000', 'https://medieteknik.com'], 
        allow_headers=['Content-Type', 'Authorization'],
        expose_headers=['Content-Type', 'Authorization'],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        max_age=86400
        )

db.init_app(app)

# CSRF protection
# csrf = CSRFProtect(app)

# Rate limiting for API
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=['1000 per day', '500 per hour'],
    storage_uri=os.environ.get('REDIS_URL', 'memory://'),
)

# OAuth
oauth.init_app(app)
oauth.register('kth', kwargs={
    'scope': 'openid email',
    'access type': 'offline',
    'response type': 'token',
})

# Register routes (blueprints)
register_routes(app)

@app.before_request
def handle_preflight():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

# Non-Specific Routes
@app.route('/')
def index():
    title = f'Medieteknik.com API {API_VERSION}, see documentation at /docs'
    avaliable_routes = [f"<span style='text-transform: lowercase;'>api/{API_VERSION}/{route.value}</span> <br />" for route in (ROUTES)]
    return f'<h1>{title}</h1><p>Avaliable routes:</p>{''.join(avaliable_routes)}'

@app.route('/login')
def login():
    redirect_uri = url_for('auth', _external=True)
    return oauth.kth.authorize_redirect(redirect_uri)

@app.route('/auth')
def auth():
    token = oauth.kth.authorize_access_token()
    user = oauth.kth.parse_id_token(token)
    session['user'] = user
    return token

if __name__ == '__main__':
    app.run(debug=True)
