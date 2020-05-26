from api.db import db

class PostTag(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False, unique=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title
        }
