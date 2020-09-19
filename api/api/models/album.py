from api.db import db
import datetime


imageAssociation = db.Table('album_images', db.Model.metadata,
                            db.Column('album_id', db.Integer,
                                      db.ForeignKey('albums.albumId')),
                            db.Column('image_id', db.Integer,
                                      db.ForeignKey('images.imageId'))
                            )


class Album(db.Model):
    __tablename__ = "albums"
    albumId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    creationDate = db.Column(db.DateTime, default=datetime.datetime.now)
    lastEdit = db.Column(db.DateTime, default=datetime.datetime.now)
    receptionAppropriate = db.Column(db.Boolean)
    images = db.relationship("Image", secondary=imageAssociation)

    def to_dict(self):
        return {
            "id": self.albumId,
            "title": self.title,
            "creationDate": self.creationDate,
            "lastEdit": self.lastEdit,
            "receptionAppropriate": self.receptionAppropriate,
            "images": [image.to_dict() for image in self.images]
        }
