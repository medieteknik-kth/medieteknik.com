#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import (
    Flask,
    jsonify,
    request,
)
#from app.documents.document_functions import save_documents, get_documents
#Den filen verkar inte användas
app = Flask(__name__)

@app.route('/')
def index():
    return jsonify(status=200, message='OK')

@app.route('/api/event')
def placeholder():
    return jsonify([])
