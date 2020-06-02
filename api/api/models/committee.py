from api.db import db

from api.models.committee_post import CommitteePost
from api.models.event import Event

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
