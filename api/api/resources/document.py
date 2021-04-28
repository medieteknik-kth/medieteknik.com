from flask import jsonify, request
from flask_restful import Resource, reqparse

import sys
import uuid
import json
import os
import base64
from datetime import datetime

from api.db import db
from api.models.document import Document, Tag, DocumentTags

from api.utility.storage import upload_b64_document

from api.resources.authentication import requires_auth


class DocumentResource(Resource):
    def get(self, id):
        document = Document.query.get_or_404(id)
        return jsonify(document.to_dict())

    def put(self, id):
        pass

    @requires_auth
    def delete(self, user, id):
        document = Document.query.get_or_404(id)
        db.session.delete(document)
        db.session.commit()
        return jsonify({"message": "ok"})


class DocumentListResource(Resource):
    """
        Example JSON data:
        {
            "title": {
                "se": "Stadgar",
                "en": "Statues"
            },
            "date": "2020-01-01",
            "tags": [1, 2],
            "file": "Base64 encoded date of the file to upload"
        }
    """
    @requires_auth
    def post(self, user):
        data = request.json

        document = Document()

        if data.get("title"):
            title = data.get("title")
            if title.get('se'):
                document.title = title.get('se')
            if title.get('en'):
                document.title_en = title.get('en')
        if data.get('date'):
            document.date = datetime.strptime(data.get('date'), "%Y-%m-%d")
        if data.get('tags'):
            tag_ids = data.get('tags')
            tags = []
            for tag_id in tag_ids:
                tag = DocumentTags.query.get_or_404(tag_id)
                tags.append(tag)
            document.tags = tags
        if data.get('file'):
            file = data.get('file')
            filename, thumbnail = upload_b64_document(file, document.title or str(uuid.uuid4()), document.date or datetime.now())
            document.fileName = filename
            document.thumbnail = thumbnail

        db.session.add(document)
        db.session.commit()
        return jsonify({"success": True, "id": document.itemId})

    def get(self):
        tags = request.args.get('tags')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)
        if tags is not None:
            tags = tags.split(",")

        if tags is not None:
            q = Document.query.join(DocumentTags).join(Tag).filter(Tag.tagId.in_(tags)).paginate(page=page, per_page=per_page)
        else:
            q = Document.query.paginate(page=page, per_page=per_page)
        documents = [Document.to_dict(res) for res in q.items]
        return jsonify({"data": documents, "totalCount": q.total})


class DocumentTagResource(Resource):
    def get(self, id):
        tag = Tag.query.get_or_404(id)
        return jsonify(tag.to_dict())

class DocumentTagListResource(Resource):
    def get(self):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('perPage', 20, type=int)
        q = Tag.query.paginate(page=page, per_page=per_page)
        return {"data": [res.to_dict() for res in q.items], "totalCount": q.total}
