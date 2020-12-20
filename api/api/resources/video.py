from flask import make_response, request, flash, redirect, jsonify
from flask_restful import Resource
import requests
import os

from api.models.video import Video
from api.db import db
from api.resources.authentication import requires_auth

TOKEN_ID = os.getenv("MUX_TOKEN_ID")
SECRET = os.getenv("MUX_SECRET")
class VideoListResource(Resource):
    @requires_auth
    def post(self):
        video_title = request.form.get("title")

        if not video_title:
            return make_response(jsonify(success=False), 400)

        if 'video' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['video']

        url = "https://api.mux.com/video/v1/uploads"

        data = {
            "new_asset_settings": { "playback_policy": ["public"] }
        }

        r = requests.post(url, json=data, auth=(TOKEN_ID, SECRET))
        if not r.ok:
            return r.text, r.status_code
        
        upload_id = r.json()["data"]["id"]
        url = r.json()["data"]["url"]
        r = requests.put(url, data=file.read()) # Låt klienten göra detta kanske?

        url = "https://api.mux.com/video/v1/uploads/" + upload_id
        r = requests.get(url, auth=(TOKEN_ID, SECRET))

        if not r.ok:
            return r.text, r.status_code
        
        asset_id = r.json()["data"]["asset_id"]

        url = "https://api.mux.com/video/v1/assets/" + asset_id
        r = requests.get(url, auth=(TOKEN_ID, SECRET))

        playback_id = r.json()["data"]["playback_ids"][0]["id"]

        if not r.ok:
            return r.text, r.status_code

        video = Video()
        video.mux_asset_id = asset_id
        video.mux_playback_id = playback_id
        video.title = video_title
        video.requires_login = False

        db.session.add(video)
        db.session.commit()

        return make_response(jsonify(success=True, id=video.id, data=video.to_dict()))

    def get(self):
        videos = Video.query.all()
        data = [video.to_dict() for video in videos]
        return jsonify(data)

class VideoResource(Resource):
    def get(self, id):
        video = Video.query.get_or_404(id)
        return jsonify(video.to_dict())
        # playback_id = video.mux_playback_id
        # html = """<video id="myVideo" controls></video><script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script><script>(function(){var playbackId="%s"; var url="https://stream.mux.com/"+playbackId+".m3u8"; var video=document.getElementById("myVideo"); if (video.canPlayType('application/vnd.apple.mpegurl')){video.src=url;}else if (Hls.isSupported()){hls=new Hls(); hls.loadSource(url); hls.attachMedia(video);}})();</script>"""
        # return make_response(html % (playback_id))
    
    @requires_auth
    def delete(self, id):
        video = Video.query.get_or_404(id)
        url = "https://api.mux.com/video/v1/assets/" + video.mux_asset_id
        r = requests.delete(url, auth=(TOKEN_ID, SECRET))

        if not r.ok:
            return r.text, r.status_code
        
        db.session.delete(video)
        db.session.commit()

        return make_response(jsonify(success=True))
    
    @requires_auth
    def put(self, id):
        video = Video.query.get_or_404(id)

        new_video_title = request.form.get("title")
        if new_video_title:
            video.title = new_video_title
        
        new_requires_login = request.form.get("requiresLogin")
        if new_requires_login:
            if new_requires_login == "true":
                video.requires_login = True
            elif new_requires_login == "false":
                video.requires_login = False
            else:
                return make_response(jsonify(success=False), 400)
        
        db.session.commit()
        return make_response(jsonify(success=True))

class VideoUploadTestResource(Resource):
    def get(self):
        response = make_response("<form action='/video' method='post' enctype='multipart/form-data'><input type='text' name='title' placeholder='Video name' /><input name='video' type='file' /><input type='submit' /></form>")
        return response