#!/usr/bin/env python
# -*- coding: utf-8 -*-
from api import db, app
from api.models.document_models import (Document, Tag, DocumentTags)
from werkzeug.utils import secure_filename
import sys
import uuid
import json
import os


SAVE_FOLDER = os.path.join(os.getcwd(), "static", "documents")

#spara dokument i databas
def save_documents(request):
    print(request)
    #Ta filer från requesten
    files = request.files.getlist("files")
    # lista att hålla koll på DB_objekt med när de skapats
    db_docs = [] 
    tags = json.loads(request.form["tags"])
    print(tags, file=sys.stderr)
    for doc in files:
        file_ext = os.path.splitext(doc.filename)[1]
        fileName = str(uuid.uuid4())
        d = Document(title=doc.filename, fileName = fileName + file_ext)
        db.session.add(d)
        db_docs.append(d)
        doc.save(os.path.join(SAVE_FOLDER, doc.filename))   #skapar en mapp att spara uppladdade filer i när appen upprättas
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
            print(dt, file=sys.stderr)
            db.session.add(dt)

    db.session.commit()
#Hämta dokument från databasen
#tags borde finnas i databasen så det inte blir knas
def get_documents(tags: list):
    if tags is not None:
        q = Document.query.join(DocumentTags).join(Tag).filter(Tag.title.in_(tags)).all()
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
