from api import app
from api.models.user import User, Committee, OfficialsPost
from flask import jsonify

@app.route('/')
def index():
    return "blöööö"

@app.route('/user/<id>')
def get_user(id):
    user = User.query.get(id)

    posts = []

    for post in user.officials_posts:
        posts.append({"name": post.name, "committee": post.committee.name})

    return jsonify(id = user.id,
                    email = user.email,
                    profile_picture = user.profile_picture,
                    first_name = user.first_name,
                    last_name = user.last_name,
                    frack_name = user.frack_name,
                    kth_year = user.kth_year,
                    linkedin = user.linkedin,
                    facebook = user.facebook,
                    officials_post = posts

                    )

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
