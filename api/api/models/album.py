from api.db import db
import datetime


imageAssociation = db.Table('album_images', db.Model.metadata,
                            db.Column('album_id', db.Integer,
                                      db.ForeignKey('albums.albumId')),
                            db.Column('image_id', db.Integer,
                                      db.ForeignKey('images.imageId'))
                            )

video_playlist_table = db.Table('album_videos', db.Model.metadata,
    db.Column('album_id', db.Integer, db.ForeignKey('albums.albumId'), primary_key=True),
    db.Column('video_id', db.Integer, db.ForeignKey('video.id'), primary_key=True)
)


class Album(db.Model):
    __tablename__ = "albums"
    albumId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    creationDate = db.Column(db.DateTime, default=datetime.datetime.now)
    lastEdit = db.Column(db.DateTime, default=datetime.datetime.now)
    receptionAppropriate = db.Column(db.Boolean)
    images = db.relationship("Image", secondary=imageAssociation)
    videos = db.relationship("Video", secondary=video_playlist_table)
    date = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "id": self.albumId,
            "title": self.title,
            "creationDate": self.creationDate,
            "lastEdit": self.lastEdit,
            "receptionAppropriate": self.receptionAppropriate,
            "images": [image.to_dict() for image in self.images],
            "videos": [video.to_dict() for video in self.videos],
            "date":self.date
        }
