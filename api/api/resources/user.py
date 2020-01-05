from flask import jsonify, request
from flask_restful import Resource

from api.models.user import User

class UserResource(Resource):
    def get(self, id):
        user = User.query.get(id)
        return jsonify(user.to_dict())

    def put(self, id):
        user = User.query.get(id)
        data = request.form

        if user.kth_id == session["CAS_USERNAME"]:
            if data.get("first_name"):
                user.first_name = data.get("first_name")
            if data.get("last_name"):
                user.last_name = data.get("last_name")
            if data.get("email"):
                user.email = data.get("email")
            if data.get("kth_year"):
                user.kth_year = data.get("kth_year")
            if data.get("frack_name"):
                user.frack_name = data.get("frack_name")
            if data.get("linkedin"):
                user.linkedin = data.get("linkedin")
            if data.get("facebook"):
                user.facebook = data.get("facebook")

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
                    user.profile_picture = path
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