from flask import jsonify, request, session
from flask_restful import Resource

from api.db import db
from api.resources.authentication import requires_auth
from api.models.user import User

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

            local_path = ""
            if "profile_picture" in request.files:
                image = request.files["profile_picture"]
                ALLOWED_EXTENTIONS = ['.png', '.jpg', '.jpeg']
                original_filename, extension = os.path.splitext(secure_filename(image.filename))
                filename = str(uuid.uuid4()) + extension
                if extension in ALLOWED_EXTENTIONS:
                    path = os.path.join("/api/static/profiles/", filename)
                    local_path = os.path.join(SAVE_FOLDER, filename)
                    image.save(local_path)
                    resize_image(local_path, filename)
                    userData.profile_picture = path
                else:
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