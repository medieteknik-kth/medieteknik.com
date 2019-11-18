from api import db
from api.models.document_models import (Document, Tag, DocumentTags)
import sys

#spara dokument i databas
def save_documents(request):
    #TODO: skriv funktion för att spara dokument i DB och på disk
    
    doc = request.files["file"]
    print(type(doc))
    d = Document(title=doc.filename)
    db.session.add(d)

    db.session.commit()
    dt = DocumentTags()
    dt.itemId = d.itemId
    dt.tagId = 1 #TODO: fixa denna, basera på taggar som finns i databasen
    db.session.add(dt)
    db.session.commit()
#Hämta dokument från databasen
#tags borde finnas i databasen så det inte blir knas
def get_documents(tags: list):
    if tags is not None:
        q = Document.query.join(DocumentTags).join(Tag).filter(Tag.title.in_(tags)).all()
    else:
        q = Document.query.join(DocumentTags).join(Tag).all()
    
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
