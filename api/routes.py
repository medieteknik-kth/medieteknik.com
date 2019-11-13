from flask import session, request, redirect
from sqlalchemy import or_
from api import app, db
from api.models.user import User, Committee, OfficialsPost
from flask import jsonify

@app.route('/')
def index():
    return "blöööö"

@app.route('/search/<search_term>')
def search(search_term):
    user_conds = [User.kth_id.ilike("%"+search_term+"%"), User.email.ilike("%"+search_term+"%"), User.first_name.ilike("%"+search_term+"%"), 
            User.last_name.ilike("%"+search_term+"%"), User.frack_name.ilike("%"+search_term+"%")]
    com_conds = [Committee.name.ilike("%"+search_term+"%")]

    users = User.query.filter(or_(*user_conds)).all()
    committees = Committee.query.filter(or_(*com_conds)).all()

    u = {"users": [user.get_data() for user in users]}
    c = {"commitees": [committee.get_data() for committee in committees]}

    data = [u, c]
    return jsonify(data)

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

    if data.get("first_name"):
        user.first_name = data.get("first_name")
    if data.get("last_name"):
        user.last_name = data.get("last_name")
    if data.get("email"):
        user.email = data.get("email")
    if data.get("kth_year"):
        user.kth_year = data.get("kth_year")

    db.session.commit()

    if data.get("redirect"):
        return redirect(data.get("redirect"))

    return jsonify(success=True)

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
