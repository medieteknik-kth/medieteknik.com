from flask import Flask, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_cas import CAS, login_required

import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ["DB_CONNECT_STR"]
app.config['SECRET_KEY'] = os.environ["FLASK_SECRET_KEY"]
app.config['CAS_SERVER'] = os.environ["CAS_SERVER"]

db = SQLAlchemy(app)
CORS(app)
CAS(app)

@app.route("/authtest")
@login_required
def auth_test():
    return "Du är inloggad som " + str(session["CAS_USERNAME"]) + ". CAS_ATTRIBUTES=" + str(session["CAS_ATTRIBUTES"])

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee, OfficialsPost, relationship_table
    db.drop_all()
    db.create_all()


    user = User()
    user.email = "jeslundq@kth.se"
    user.first_name = "Jesper"
    user.last_name = "Lundqvist"
    user.frack_name = "Joppe"
    user.kth_year = 2016
    user.facebook = "https://www.facebook.com/jesperlndqvist"
    user.linkedin = "https://www.linkedin.com/in/jesper-lundqvist-63a47a126/"

    committee1 = Committee()
    committee1.name = "MKMKMKMKHÄSTEN HETER FÖL"
    officialspost1 = OfficialsPost()
    officialspost1.name= "haaj"
    user.officials_posts.append(officialspost1)

    officialspost2 = OfficialsPost()
    officialspost2.name= "val"
    officialspost2.committee=committee1
    user.officials_posts.append(officialspost2)

    officialspost1.committee = committee1


    db.session.add(user)
    db.session.add(committee1)
    db.session.add(officialspost1)
    db.session.add(officialspost2)
    db.session.commit()

    return "klar"



from api import routes
