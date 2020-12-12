from api.db import db
import datetime

from api.models.post_tag import PostTag


#Association table for tags and events
events_tags = db.Table('event_Tags', db.Model.metadata,
    db.Column('event_id', db.Integer, db.ForeignKey('event.id')),
    db.Column('tag_id', db.Integer, db.ForeignKey('post_tag.id'))
)

class Event(db.Model):
    __tablename__ = "event"
    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"),
        nullable=False)
    title = db.Column(db.String, nullable=False)
    title_en = db.Column(db.String, nullable=True)
    date = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    scheduled_date = db.Column(db.DateTime, default=None, nullable=True)
    draft = db.Column(db.Boolean, default=False)
    body = db.Column(db.Text, nullable=False)
    body_en = db.Column(db.Text, nullable=True)
    location = db.Column(db.String)
    committee_id = db.Column(db.Integer, db.ForeignKey('committee.id'))
    committee = db.relationship("Committee", back_populates = "events")
    header_image = db.Column(db.String, default="static/posts/default.png") #can be changed if we get a default event picture
    tags = db.relationship("PostTag", secondary=events_tags)
    facebook_link = db.Column(db.String)
    event_date = db.Column(db.DateTime, default=datetime.datetime.utcnow())
    end_date = db.Column(db.DateTime, default=datetime.datetime.utcnow() + datetime.timedelta(hours=5))

    def to_dict(self):
        com = None
        if self.committee:
            com = self.committee.to_basic_dict()
        
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": {
                "se": self.title,
                "en": self.title_en
            },
            "date": self.date,
            "scheduled_date": self.scheduled_date,
            "draft": self.draft,
            "body": {
                "se": self.body,
                "en": self.body_en
            },
            "location": self.location,
            "header_image": self.header_image,
            "committee": com,
            "tags": [t.to_dict() for t in self.tags],
            "facebook_link": self.facebook_link,
            "event_date": self.event_date,
            "end_date": self.end_date
        }