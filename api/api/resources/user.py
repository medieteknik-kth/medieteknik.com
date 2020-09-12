from flask import jsonify, request, session
from flask_restful import Resource

from api.db import db
from api.resources.authentication import requires_auth
from api.models.user import User
from api.utility.storage import upload_profile_picture

class UserResource(Resource):
    def get(self, id):
        user = User.query.get(id)
        return jsonify(user.to_dict())

    @requires_auth
    def put(self, id, user):
        userData = User.query.get(id)
        data = request.form
    
        if userData.id == user.id:
            if data.get("first_name"):
                userData.first_name = data.get("first_name")
            if data.get("last_name"):
                userData.last_name = data.get("last_name")
            if data.get("email"):
                userData.email = data.get("email")
            if data.get("kth_year"):
                userData.kth_year = data.get("kth_year")
            if data.get("frack_name"):
                userData.frack_name = data.get("frack_name")
            if data.get("linkedin"):
                userData.linkedin = data.get("linkedin")
            if data.get("facebook"):
                userData.facebook = data.get("facebook")

            if "profile_picture" in request.files:
                image = request.files["profile_picture"]
                try:
                    userData.profile_picture = upload_profile_picture(image)
                except ValueError:
                    return jsonify(success=False), 415
            db.session.commit()

            if data.get("redirect"):
                return redirect(data.get("redirect"))

            return jsonify(success=True, local_path=local_path)
        else:
            return jsonify(success=False), 403

class UserListResource(Resource):
    def get(self):
        users = User.query.all()
        data = [user.to_dict() for user in users]
        return jsonify(data)

def resize_image(file_path, filename):
    im = Image.open(file_path)
    size = (512, 512) # thumbnail-storleken
    filename = filename.split(".")[0]
    outfile = os.path.splitext(im.filename)[0]
    im.thumbnail(size)
    im.save(outfile +".jpg")
    return outfile + ".jpg"