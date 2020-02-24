from api.db import db

from api.models.committee_post import CommitteePost
from api.models.user import User

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    date = db.Column(db.Date)
    header_image = db.Column(db.String)
    body = db.Column(db.String)

    committee_post = db.relationship("CommitteePost", back_populates = "committee")
    user = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "title": self.title,
            "date": self.date,
            "header_image": self.header_image,
            "body": self.body,
            "committee_post": self.committee_post,
            "user": self.user
        }