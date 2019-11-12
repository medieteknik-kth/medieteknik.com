from api import db
import datetime

class Document(db.Model):
    __tablename__ = "documents"
    itemId = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    tags = db.relationship("DocumentTags")
    tags = db.Column(db.DateTime, default=datetime.datetime.now)

    def to_dict(self):
        return {"itemId": self.itemId, "title": self.title, "tags": [res.serialize() for res in self.tags]}

class Tag(db.Model):
    __tablename__ = "tags"
    tagId = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)

    def to_dict(self):
        return {"tagId": self.tagId, "title": self.title}

    def __repr__(self):
        return "Tag with title %s and id %s" % (self.title, self.tagId)

class DocumentTags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    itemId = db.Column(db.Integer, db.ForeignKey("documents.itemId"))
    tagId = db.Column(db.Integer, db.ForeignKey("tags.tagId"))

    def serialize(self):
        return self.tagId