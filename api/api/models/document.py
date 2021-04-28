from api.db import db
import datetime


class Document(db.Model):
    __tablename__ = "documents"
    itemId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    title_en = db.Column(db.String)
    tags = db.relationship("DocumentTags")
    date = db.Column(db.Date)
    fileName = db.Column(db.String)
    thumbnail = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.itemId,
            "title": {"se": self.title, "en": self.title_en},
            "tags": [res.serialize() for res in self.tags],
            "filename": self.fileName,
            "date": self.date.strftime("%Y-%m-%d"),
            "thumbnail": self.thumbnail
        }


class Tag(db.Model):
    __tablename__ = "tags"
    tagId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    title_en = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.tagId,
            "title": {"se": self.title, "en": self.title_en}
        }

    def __repr__(self):
        return "Tag with title %s and id %s" % (self.title, self.tagId)


class DocumentTags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    itemId = db.Column(db.Integer, db.ForeignKey("documents.itemId"))
    tagId = db.Column(db.Integer, db.ForeignKey("tags.tagId"))

    def serialize(self):
        tag = Tag.query.get(self.tagId)
        return tag.to_dict()
