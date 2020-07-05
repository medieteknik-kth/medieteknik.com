from api.db import db

from api.models.committee_post import CommitteePost
from api.models.event import Event

class CommitteeCategory(db.Model):
    __tablename__ = 'CommitteeCategory'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=True)
    weight = db.Column(db.Integer, default=1)
    committees = db.relationship("Committee")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "email": self.email,
            "weight": self.weight
        }

class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    posts = db.relationship("CommitteePost", back_populates = "committee")
    events = db.relationship("Event", back_populates="committee")
    logo = db.Column(db.String)
    header_image = db.Column(db.String)
    description = db.Column(db.String)
    instagram_url = db.Column(db.String)
    page_id = db.Column(db.Integer, db.ForeignKey("page.id"))
    page = db.relationship("Page")
    category_id = db.Column(db.Integer, db.ForeignKey('CommitteeCategory.id'))
    category = db.relationship("CommitteeCategory")

    def to_dict(self):
        posts = [post.to_dict() for post in self.posts]
        events = [event.to_dict() for event in self.events]

        if self.page != None:
            page = self.page.to_dict()
        else:
            page = None

        return {
            "id": self.id,
            "name": self.name,
            "posts": posts,
            "logo": self.logo,
            "header_image": self.header_image,
            "description": self.description,
            "instagram_url": self.instagram_url,
            "page": page,
            "events": events,
        }
