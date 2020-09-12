from flask import make_response, request, jsonify
from flask_restful import Resource

from api.models.image import Image
from api.models.album import Album
from api.utility.storage import upload_album_photo
from api.db import db
from api.resources.authentication import requires_auth

from datetime import datetime

class AlbumListResource(Resource):
    @requires_auth
    def post(self):
        data = request.form

        album_name = data.get("name")

        if not album_name:
            return jsonify(success=False), 400
        
        album = Album()
        album.title = album_name

        creationDate = data.get("creationDate")
        if creationDate:
            album.creationDate = creationDate
            album.lastEdit = creationDate
        
        receptionAppropriate = data.get("receptionAppropriate")
        if receptionAppropriate:
            album.receptionAppropriate = receptionAppropriate

        photos = request.files.getlist("photos")
        if photos:
            for photo in photos:
                image = Image()
                image.url = upload_album_photo(photo, album.title)
                album.images.append(image)
                db.session.add(image)
        
        db.session.add(album)
        db.session.commit()

        return jsonify(success=True)

    def get(self):
        albums = Album.query.all()
        data = [album.to_dict() for album in albums]
        return jsonify(data)

class AlbumResource(Resource):
    def get(self, id):
        album = Album.query.get_or_404(id)
        return jsonify(album.to_dict())
    
    @requires_auth
    def put(self, id):
        album = Album.query.get_or_404(id)
        keys = request.form.keys()

        if "title" in keys:
            album.title = request.form["name"]
        if "receptionAppropriate" in keys:
            album.receptionAppropriate = request.form["receptionAppropriate"]

        ## TODO: Remove images from albums

        photos = request.files.getlist("photos")
        if photos:
            for photo in photos:
                image = Image()
                image.url = upload_album_photo(photo, album.title)
                album.images.append(image)
                db.session.add(image)

        album.lastEdit = datetime.now()

        db.session.commit()
        return jsonify({"message": "ok"})

    @requires_auth
    def delete(self, id):
        album = Album.query.get_or_404(id)
        db.session.delete(album)
        db.session.commit()
        return jsonify({"message": "ok"})