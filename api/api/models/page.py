from api.db import db
import datetime
import enum

class PageRevisionType(enum.Enum):
    created = 0
    removed = 1
    edited = 2

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    revisions = db.relationship("PageRevision", backref="page", order_by=lambda:PageRevision.timestamp.desc())

    def latest_published_revision(self):
        return next((revision for revision in self.revisions if revision.published), None)

    def to_dict(self):
        current = self.latest_published_revision()
        published = current != None

        if published:
            title = current.title
            content = current.content
            author = current.author.to_dict() if current.author != None else None
            updated = current.timestamp
        else:
            title = None
            content = None
            author = None
            updated = None

        return {
            "id": self.id,
            "title": title,
            "content": content,
            "author": author,
            "revisions": [revision.to_dict() for revision in self.revisions],
            "published": published,
            "updated": updated
        }

class PageRevision(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, default=datetime.datetime.now)
    revision_type = db.Column(db.Enum(PageRevisionType))
    author_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    author = db.relationship("User")
    title = db.Column(db.String)
    content = db.Column(db.String)
    page_id = db.Column(db.Integer, db.ForeignKey("page.id"))
    published = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "type": self.revision_type.name,
            "author": self.author.to_dict() if self.author != None else None,
            "title": self.title,
            "content": self.content,
            "published": self.published
        }
