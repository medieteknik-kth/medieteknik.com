from datetime import datetime
from api.db import db

from api.models.user import User
from api.models.committee import Committee
from api.models.post_tag import PostTag

posts_tags = db.Table('association', db.Model.metadata,
    db.Column('post_id', db.Integer, db.ForeignKey('post.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('post_tag.id'))
)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    title_en = db.Column(db.String, nullable=True)
    date = db.Column(db.DateTime, default=datetime.utcnow)
    scheduled_date = db.Column(db.DateTime, default=None, nullable=True)
    draft = db.Column(db.Boolean, default=False)
    header_image = db.Column(db.String, default="https://api.medieteknik.com/static/posts/default.png")
    body = db.Column(db.String, nullable=False)
    body_en = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"),
        nullable=False)
    committee_id = db.Column(db.Integer, db.ForeignKey("committee.id"),
        nullable=True)
    tags = db.relationship("PostTag",
                    secondary=posts_tags)

    def to_dict(self):
        return {
            "id": self.id,
            "title": {
                "se": self.title,
                "en": self.title_en
            },
            "date": self.date,
            "scheduled_date": self.scheduled_date,
            "draft": self.draft,
            "header_image": self.header_image,
            "body": {
                "se": self.body,
                "en": self.body_en
            },
            "user_id": self.user_id,
            "committee_id": self.committee_id,
            "tags": [tag.id for tag in self.tags]
        }
