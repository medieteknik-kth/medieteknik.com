from flask import (
    Flask,
    jsonify,
    request,
)
from documents.document_functions import save_documents, get_documents

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify(status=200, message='OK')

@app.route('/api/event')
def placeholder():
    return jsonify([])

#Endpoint för dokument
@app.route('/api/documents', methods=['GET', 'POST'])
def document_endpoint():
    if request.method == 'POST':
        if request.files is None:
            return jsonify(status=422, message="no files attached")
        else:
            save_documents(request.files)
    if request.method == 'GET':
        documents = get_documents()
        return jsonify(status = 200, documents=documents)