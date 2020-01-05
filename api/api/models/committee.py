from api.db import db

from api.models.committee_post import CommitteePost

class Committee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    posts = db.relationship("CommitteePost", back_populates = "committee")
    logo = db.Column(db.String)
    header_image = db.Column(db.String)
    

    def to_dict(self):
        posts = [post.to_dict() for post in self.posts]

        return {
            "id": self.id,
            "name": self.name,
            "posts": posts
        }
