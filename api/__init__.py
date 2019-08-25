import awsgi
from flask import (
    Flask,
    jsonify,
)

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify(status=200, message='OK')

@app.route('/api/event')
def placeholder():
    return jsonify([])


def lambda_handler(event, context):
    return awsgi.response(app, event, context)
