from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import os
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DB_CONNECT_STR"]
db = SQLAlchemy(app)
os.makedirs(os.path.join(os.getcwd(), "static", "documents"), exist_ok=True)

@app.route("/create_all")
def route_create_all():
    from api.models.document_models import Document, Tag, DocumentTags
    db.drop_all()
    db.create_all()

    doc = Document()
    doc.title = "PROTOKOLLLLLA IN DET HÄR"
    doc.fileName = "abc123.pdf"
    doc.uploadedBy = "Joppe"
    

    tag = Tag()
    tag.title = "styrelsen"

    tag2 = Tag()
    tag2.title = "annat"
    

    db.session.add(doc)
    db.session.add(tag)
    db.session.add(tag2)
    db.session.commit()
    doctag = DocumentTags()
    doctag.itemId = doc.itemId
    doctag.tagId = tag.tagId
    db.session.add(doctag)


    db.session.commit()
    return jsonify({"status": 200})

from api import routes
