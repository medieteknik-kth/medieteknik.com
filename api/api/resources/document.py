from flask import jsonify
from flask_restful import Resource

from api.models.document import Document

class DocumentResource(Resource):
    def get(self, id):
        document = Document.query.get(id)
        return jsonify(document.to_dict())

class DocumentListResource(Resource):
    def get(self):
        documents = Document.query.all()
        data = [document.to_dict() for document in documents]
        return jsonify(data)