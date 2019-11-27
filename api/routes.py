from flask import session, request, redirect
from api import app, db
from api.models.user import User, Committee, OfficialsPost
from flask import jsonify
from PIL import Image
from werkzeug.utils import secure_filename
import os, uuid

SAVE_FOLDER = os.path.join(os.getcwd(), "api", "static", "profiles")

@app.route('/')
def index():
    return "blöööö"

@app.route('/current_user')
def get_current_user():
    if session.get("CAS_USERNAME"):
        user = User.query.filter_by(kth_id=session["CAS_USERNAME"]).first()
        new_user = False

        if user == None:
            user = User()
            user.kth_id = session["CAS_USERNAME"]
            db.session.add(user)
            db.session.commit()
            new_user = True

        return jsonify(loggedin=True, user=user.get_data(), new_user=new_user)
    else:
        return jsonify(loggedin=False)

@app.route('/user/<id>', methods=["POST"])
def update_user(id):
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
                return jsonify(success=False), 401

        db.session.commit()

        if data.get("redirect"):
            return redirect(data.get("redirect"))

        return jsonify(success=True, local_path=local_path)
    else:
        return jsonify(success=False)

def resize_image(file_path, filename):
    im = Image.open(file_path)
    size = (512, 512) # thumbnail-storleken
    filename = filename.split(".")[0]
    outfile = os.path.splitext(im.filename)[0]
    im.thumbnail(size)
    im.save(outfile +".jpg")
    return outfile + ".jpg"

@app.route('/user')
def get_all_users():
    users = User.query.all()
    data = [user.get_data() for user in users]
    return jsonify(data)

@app.route('/user/<id>')
def get_user(id):
    user = User.query.get(id)
    return jsonify(user.get_data())


@app.route('/committee/<id>')
def get_committee(id):
    committee = Committee.query.get(id)
    return jsonify(id = committee.id,
                    name = committee.name,
                    posts = committee.name

    )

@app.route('/officials_post/<id>')
def get_officials_post(id):
    officials_post = OfficialsPost.query.get(id)
    return jsonify(id = officials_post,
                    name = officials_post.name,
                    start_date = officials_post.start_end,
                    end_date = officials_post.end_date,
                    officials_email = officials_post.officials_email,
                    )
