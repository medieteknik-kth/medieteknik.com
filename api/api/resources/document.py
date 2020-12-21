from flask import jsonify, request
from flask_restful import Resource, reqparse

from werkzeug.utils import secure_filename
import sys
import uuid
import json
import os
import base64

from api.db import db
from api.models.document import Document, Tag, DocumentTags

from api.resources.authentication import requires_auth

class DocumentResource(Resource):
    def get(self, id):
        
        document = Document.query.get(id)
        return jsonify(document.to_dict())

class DocumentListResource(Resource):
    @requires_auth
    def post(self, user):
        if request.files is None:
            return jsonify(message="no files attached"), 422
        else:
            save_documents(request)
            return jsonify(message="file uploaded!")

    def get(self):
        tags = request.args.get('tags')
        if tags is not None:
            tags = tags.split(",")

        documents = get_documents(tags)
        return jsonify({"documents": documents})

class DocumentTagResource(Resource):
    def get(self):
        res = get_tags()
        return jsonify(res)


SAVE_FOLDER = os.path.join(os.getcwd(), "static", "documents")
THUMBNAIL_FOLDER = os.path.join(os.getcwd(), "static", "thumbnails")

#spara dokument i databas
def save_documents(request):
    #Ta filer från requesten
    files = request.files.getlist("file")
    # lista att hålla koll på DB_objekt med när de skapats
    db_docs = []
    tags = json.loads(request.form["tags"])
    thumbnail = request.form["thumbnail"].split(',')[1] #första delen av datan är en header, den slänger vi då den orsakar fel annars
    thumb_name = str(uuid.uuid4()) + ".png"
    # thumbnail skickas in som en base64-kodad sträng, vi måste dekoda den för att spara ned ordentligt
    with open(os.path.join(THUMBNAIL_FOLDER, thumb_name), 'wb') as fh:
        fh.write(base64.b64decode(thumbnail))
    for doc in files:
        file_ext = os.path.splitext(doc.filename)[1]
        fileName = str(uuid.uuid4())
        d = Document(title=request.form["title"], fileName = fileName + file_ext, thumbnail=thumb_name)
        db.session.add(d)
        db_docs.append(d)
        doc.save(os.path.join(SAVE_FOLDER, d.fileName)) #skapar en mapp att spara uppladdade filer i när appen upprättas
    db.session.commit()

    #tagga dokumenten ordentligt
    for idx, docobj in enumerate(db_docs):
        tag_arr: list = tags[str(idx)]
        print(tag_arr, file=sys.stderr)
        print(docobj.itemId, file=sys.stderr)
        for t in tag_arr:
            dt = DocumentTags()
            dt.itemId = docobj.itemId
            dt.tagId = t
            db.session.add(dt)

    db.session.commit()
#Hämta dokument från databasen
#tags borde finnas i databasen så det inte blir knas
def get_documents(tags: list):
    if tags is not None:
        q = Document.query.join(DocumentTags).join(Tag).filter(Tag.tagId.in_(tags)).all()
    else:
        q = Document.query.all()
    return [Document.to_dict(res) for res in q]

def get_tags():
    q = Tag.query.all()
    return [res.to_dict() for res in q]

def add_tag(title):
    t = Tag()
    t.title = title

    db.session.add(t)
    db.session.commit()

def add_tag_to_document(docId: str, tagId: str):
    t = Tag.query.filter(Tag.tagId == tagId)
    d = Document.query.filter(Document.itemId == docId)
    dt = DocumentTags()
    dt.itemId = d.itemId
    dt.tagId = t.tagId

    db.session.add(dt)
    db.session.commit()
