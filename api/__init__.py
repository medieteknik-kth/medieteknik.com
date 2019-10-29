from flask import Flask, session, jsonify, request, redirect
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_cas import CAS, login_required

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DB_CONNECT_STR"]
app.config['SECRET_KEY'] = os.environ["FLASK_SECRET_KEY"]
app.config['CAS_SERVER'] = os.environ["CAS_SERVER"]
app.config['CAS_LOGIN_ROUTE'] = os.environ["CAS_LOGIN_ROUTE"]
app.config['CAS_LOGOUT_ROUTE'] = os.environ["CAS_LOGOUT_ROUTE"]
app.config['CAS_VALIDATE_ROUTE'] = os.environ["CAS_VALIDATE_ROUTE"]
app.config['CAS_AFTER_LOGIN'] = os.environ["CAS_AFTER_LOGIN"]

db = SQLAlchemy(app)
CORS(app)

if os.environ.get("FLASK_DEBUG") == "True":
    @app.route('/login', methods=["GET", "POST"])
    def locallogin():
        if request.method == 'POST':
            session["CAS_USERNAME"] = request.form["username"]

            if request.args.get('service'):
                return redirect(request.args.get('service'))

            return jsonify(success=True)
        else:
            return "<form method='POST'><input placeholder='användarnamn' name='username'></input><input type='submit' /></form>"

    @app.route('/logout')
    def locallogout():
        session["CAS_USERNAME"] = ""

        if request.args.get('service'):
            return redirect(request.args.get('service'))

        return jsonify(success=True)
else:
    CAS(app)

@app.route("/authtest")
@login_required
def auth_test():
    return "Du är inloggad som " + str(session["CAS_USERNAME"])

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee, OfficialsPost, relationship_table
    db.drop_all()
    db.create_all()


    user1 = User()
    user1.email = "jeslundq@kth.se"
    user1.kth_id = "joppe"
    user1.first_name = "Jesper"
    user1.last_name = "Lundqvist"
    user1.frack_name = "Joppe"
    user1.kth_year = 2016
    user1.facebook = "https://www.facebook.com/jesperlndqvist"
    user1.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"
    user1.profile_picture = "/jesper.jpeg"

    user2 = User()
    user2.email = "medieteknik@medieteknik.com"
    user2.kth_id = "test"
    user2.first_name = "Media"
    user2.last_name = "Mediansson"
    user2.frack_name = "Media"
    user2.kth_year = 2000
    user2.profile_picture = "/default.png"

    committee1 = Committee()
    committee1.name = "Hemsideprojektet"
    officialspost1 = OfficialsPost()
    officialspost1.name= "Projektledare för Hemsidan"
    user1.officials_posts.append(officialspost1)

    officialspost1.committee = committee1

    db.session.add(user1)
    db.session.add(user2)
    db.session.add(committee1)
    db.session.add(officialspost1)
    db.session.commit()

    return "klar"



from api import routes
