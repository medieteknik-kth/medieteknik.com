import os

from flask import Flask, url_for, session, request, make_response
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from utility.database import db
from decorators.authorization import oauth
from routes.public import committee_routes as public_committee_routes, \
    general_routes as public_general_routes, student_routes as public_student_routes, \
    item_routes as public_item_routes, dynamic_routes as public_dynamic_routes
from routes import item_routes, author_routes
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

# Public Routes
app.register_blueprint(public_general_routes.public_bp, url_prefix=f'{PUBLIC_PATH}')
app.register_blueprint(public_dynamic_routes.dynamic_routes_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.DYNAMIC.value}')
app.register_blueprint(public_committee_routes.public_committee_category_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.COMMITTEE_CATEGORIES.value}')
app.register_blueprint(public_committee_routes.public_committee_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.COMMITTEES.value}')
app.register_blueprint(public_committee_routes.public_committee_position_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.COMMITTEE_POSITIONS.value}')
app.register_blueprint(public_student_routes.public_student_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.STUDENTS.value}')
app.register_blueprint(public_item_routes.public_news_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.NEWS.value}')
app.register_blueprint(public_item_routes.public_events_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.EVENTS.value}')
app.register_blueprint(public_item_routes.public_documents_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.DOCUMENTS.value}')
app.register_blueprint(public_item_routes.public_albums_bp, url_prefix=f'{PUBLIC_PATH}/{ROUTES.ALBUMS.value}')

# Protected Routes
app.register_blueprint(item_routes.news_bp, url_prefix=f'{PROTECTED_PATH}/{ROUTES.NEWS.value}')
app.register_blueprint(author_routes.author_bp, url_prefix=f'{PROTECTED_PATH}/authors')


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
