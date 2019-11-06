def save_documents(file_list: list):
    #TODO: skriv funktion för att spara dokument i DB och på disk
    pass

def get_documents(tags: list):
    #TODO: Skriv funktion för att hämta lista på dokument från databasen
    q = Document.query.join(DocumentTags).join(Tag).filter(Tag.title.in_(tags)).all()


    return [Document.to_dict(res) for res in q]
