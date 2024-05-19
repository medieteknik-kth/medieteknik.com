import os

from flask import Flask, url_for, session
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_wtf.csrf import CSRFProtect
from utility.database import db
from decorators.authorization import oauth
from routes.public import committee_routes, general_routes, student_routes, item_routes, dynamic_routes
from utility.constants import API_VERSION, ROUTES

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
    default_limits=['150 per day', '20 per hour'],
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
app.register_blueprint(general_routes.public_bp, url_prefix=f'/api/{API_VERSION}')
app.register_blueprint(dynamic_routes.dynamic_routes_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.DYNAMIC.value}')
app.register_blueprint(committee_routes.public_committee_category_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.COMMITTEE_CATEGORIES.value}')
app.register_blueprint(committee_routes.public_committee_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.COMMITTEES.value}')
app.register_blueprint(committee_routes.public_committee_position_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.COMMITTEE_POSITIONS.value}')
app.register_blueprint(student_routes.public_student_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.STUDENTS.value}')
app.register_blueprint(item_routes.public_news_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.NEWS.value}')
app.register_blueprint(item_routes.public_events_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.EVENTS.value}')
app.register_blueprint(item_routes.public_documents_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.DOCUMENTS.value}')
app.register_blueprint(item_routes.public_albums_bp, url_prefix=f'/api/{API_VERSION}/{ROUTES.ALBUMS.value}')

# Protected Routes

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
