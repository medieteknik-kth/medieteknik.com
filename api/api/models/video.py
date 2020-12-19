from api.db import db
import datetime

from api.models.album import video_playlist_table

class Video(db.Model):
    __tablename__ = 'video'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    mux_asset_id = db.Column(db.String)
    mux_playback_id = db.Column(db.String)
    uploaded_at = db.Column(db.DateTime, default=datetime.datetime.now)
    requires_login = db.Column(db.Boolean, default=False)
    albums = db.relationship("Album", secondary=video_playlist_table)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": "https://stream.mux.com/" + self.mux_playback_id + ".m3u8",
            "thumbnail": "https://image.mux.com/" + self.mux_playback_id + "/thumbnail.jpg",
            "uploadedAt": self.uploaded_at,
            "requiresLogin": self.requires_login,
            "albums": [album.albumId for album in self.albums]
        }