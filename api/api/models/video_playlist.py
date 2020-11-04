from api.db import db

video_playlist_table = db.Table('video_playlist_table', db.Model.metadata,
    db.Column('video_playlist_id', db.Integer, db.ForeignKey('video_playlist.id'), primary_key=True),
    db.Column('video_id', db.Integer, db.ForeignKey('video.id'), primary_key=True)
)

class VideoPlaylist(db.Model):
    __tablename__ = 'video_playlist'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String)
    videos = db.relationship("Video", secondary=video_playlist_table)
    
    def to_dict(self):
        videos = [video.to_dict() for video in self.videos]
        return {
            "id": self.id,
            "title": self.title,
            "videos": videos,
        }