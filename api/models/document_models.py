from api import db

class Document(db.Model):
    __tablename__ = "documents"
    itemId = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)

class Tag(db.Model):
    __tablename__ = "tags"
    tagId = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    files = db.relationship("DocumentTags")

    def __repr__(self):
        return "Tag with title %s and id %s and %s" % (self.title, self.tagId, self.files)

class DocumentTags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    itemId = db.Column(db.Integer, db.ForeignKey("documents.itemId"))
    tagId = db.Column(db.Integer, db.ForeignKey("tags.tagId"))