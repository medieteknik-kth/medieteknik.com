from api import db
from api.models.document_models import (Document, Tag, DocumentTags)

def save_documents(request):
    #TODO: skriv funktion för att spara dokument i DB och på disk
    pass

def get_documents(tags: list):
    #TODO: Skriv funktion för att hämta lista på dokument från databasen
    if tags is not None:
        q = Document.query.join(DocumentTags).join(Tag).filter(Tag.title.in_(tags)).all()
    else:
        q = Document.query.join(DocumentTags).join(Tag).all()
    return [Document.to_dict(res) for res in q]
