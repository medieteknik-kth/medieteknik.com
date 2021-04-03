from api.db import db
from sqlalchemy.ext.declarative import declarative_base

class Announcement(db.Model):
    __tablename__ = 'announcement'
    id = db.Column(db.Integer, primary_key=True)
    message = db.Column(db.String)