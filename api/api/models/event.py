from api.db import db
import datetime

class Event(db.Model):
    __tablename__ = "events"
    eventId = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    description = db.Column(db.Text)
    location = db.Column(db.String)

    def to_dict(self):
        return {
            "id": self.eventId,
            "title": self.title,
            "date": self.date,
            "description": self.description,
            "location": self.location
        }