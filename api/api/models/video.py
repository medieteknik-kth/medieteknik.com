from api.db import db
import datetime

from api.models.video_playlist import video_playlist_table

class Video(db.Model):
    __tablename__ = 'video'
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    mux_asset_id = db.Column(db.String)
    mux_playback_id = db.Column(db.String)
    uploaded_at = db.Column(db.DateTime, default=datetime.datetime.now)
    requires_login = db.Column(db.Boolean, default=False)
    playlists = db.relationship("VideoPlaylist", secondary=video_playlist_table)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": "https://stream.mux.com/" + self.mux_playback_id + ".m3u8",
            "uploadedAt": self.uploaded_at,
            "requiresLogin": self.requires_login,
            "playlists": [playlist.id for playlist in self.playlists]
        }