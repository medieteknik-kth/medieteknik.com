from api.db import db
import datetime
import enum

class PageRevisionType(enum.Enum):
    created = 0
    removed = 1
    edited = 2

class Page(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String, unique=True)
    committee = db.relationship("Committee", back_populates="page", uselist=False)
    revisions = db.relationship("PageRevision", backref="page", order_by=lambda:PageRevision.timestamp.desc())

    def latest_published_revision(self):
        return next((revision for revision in self.revisions if revision.published), None)
    
    def is_editable_by(self, user):
        if self.committee == None:
            return False

        for term in user.post_terms:
            committee_id = term.post.committee_id
            if self.committee.id == committee_id:
                return True
        return False

    def to_dict(self):
        current = self.latest_published_revision()
        published = current != None
        committee = self.committee.to_dict_without_page() if self.committee != None else None

        if published:
            title_sv = current.title_sv
            title_en = current.title_en
            content_sv = current.content_sv
            content_en = current.content_en
            image = current.image
            author = current.author.to_dict() if current.author != None else None
            updated = current.timestamp
        else:
            title_sv = None
            title_en = None
            content_sv = None
            content_en = None
            image = None
            author = None
            updated = None

        return {
            "id": self.id,
            "slug": self.slug,
            "committee": committee,
            "title_sv": title_sv,
            "title_en": title_en,
            "content_sv": content_sv,
            "content_en": content_en,
            "image": image,
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
    title_sv = db.Column(db.String)
    title_en = db.Column(db.String)
    content_sv = db.Column(db.String)
    content_en = db.Column(db.String)
    image = db.Column(db.String)
    page_id = db.Column(db.Integer, db.ForeignKey("page.id"))
    published = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp,
            "type": self.revision_type.name,
            "author": self.author.to_dict_without_terms() if self.author != None else None,
            "title_sv": self.title_sv,
            "title_en": self.title_en,
            "image": self.image,
            "content_sv": self.content_sv,
            "content_en": self.content_en,
            "published": self.published
        }
