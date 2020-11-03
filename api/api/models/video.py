from api.db import db
import datetime

class Video(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String)
    mux_asset_id = db.Column(db.String)
    mux_playback_id = db.Column(db.String)
    uploaded_at = db.Column(db.DateTime, default=datetime.datetime.now)
    requires_login = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "url": "https://stream.mux.com/" + self.mux_playback_id + ".m3u8",
            "uploadedAt": self.uploaded_at,
            "requiresLogin": self.requires_login
        }