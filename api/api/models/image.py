from api.db import db
import datetime



class Image(db.Model):
    __tablename__ = "images"
    imageId = db.Column(db.Integer, primary_key = True)
    url = db.Column(db.String)
    photographer = db.Column(db.String) #TODO: reformat to foreignKey linked to user
    date = db.Column(db.DateTime, default = datetime.datetime.now)
    needsCred = db.Column(db.Boolean)
    editingAllowed = db.Column(db.Boolean)