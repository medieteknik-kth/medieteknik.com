from flask import make_response, request, jsonify
from flask_restful import Resource

from api.db import db

from api.models.video import Video
from api.models.video_playlist import VideoPlaylist

from api.resources.authentication import requires_auth

class VideoPlaylistResource(Resource):
    def get(self, id):
        playlist = VideoPlaylist.query.get_or_404(id)
        return jsonify(playlist.to_dict())

    @requires_auth
    def delete(self, id):
        playlist = VideoPlaylist.query.get_or_404(id)
        db.session.delete(playlist)
        db.session.commit()

        return make_response(jsonify(success=True))
    
    @requires_auth
    def patch(self, id):
        playlist = VideoPlaylist.query.get_or_404(id)
        data = request.json

        to_add = []
        to_remove = []

        if "add" in data:
            to_add = data.get("add")

        if "remove" in data:
            to_remove = data.get("remove")

        for video_id in to_add:
            video = Video.query.get_or_404(video_id)
            playlist.videos.append(video)
        
        for video_id in to_remove:
            video = Video.query.get_or_404(video_id)
            playlist.videos.remove(video)

        db.session.commit()
        return make_response(jsonify(success=True))

class VideoPlaylistListResource(Resource):
    @requires_auth
    def post(self):
        title = request.form.get("title")

        if not title:
            return make_response(jsonify(success=False), 400)

        playlist = VideoPlaylist()
        playlist.title = title

        db.session.add(playlist)
        db.session.commit()
        return make_response(jsonify(success=True, id=playlist.id))

    def get(self):
        playlists = VideoPlaylist.query.all()
        data = [playlist.to_dict() for playlist in playlists]
        return jsonify(data)