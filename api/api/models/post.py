import datetime
from api.db import db

from api.models.user import User
from api.models.committee import Committee

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    header_image = db.Column(db.String)
    body = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
        nullable=False)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'),
        nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "date": self.date,
            "header_image": self.header_image,
            "body": self.body,
            "user_id": self.user_id,
            "committee_id": self.committee_id
        }
