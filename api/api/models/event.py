from api.db import db
import datetime

from api.models.post_tag import PostTag


#Association table for tags and events
events_tags = db.Table('eventsTags', db.Model.metadata,
    db.Column('event_id', db.Integer, db.ForeignKey('event.event_id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('post_tag.id'))
)

class Event(db.Model):
    __tablename__ = "event"
    event_id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable=False)
    title_en = db.Column(db.String, nullable=True)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    description = db.Column(db.Text, nullable=False)
    description_en = db.Column(db.Text, nullable=True)
    location = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "events")
    header_image = db.Column(db.String, default="static/posts/default.png") #can be changed if we get a default event picture
    tags = db.relationship("PostTag", secondary=events_tags)
    facebook_link = db.Column(db.String)

    

    def to_dict(self):
        return {
            "event_id": self.event_id,
            "title": {
                "se": self.title,
                "en": self.title_en
            },
            "date": self.date,
            "description": {
                "se": self.description,
                "en": self.description_en
            },
            "location": self.location,
            "header_image": self.header_image,
            "committee_id": self.committee_id,
            "tags": [t.to_dict() for t in self.tags],
            "facebook_link": self.facebook_link
        }