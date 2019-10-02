from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://medieteknik:rgb@db/medieteknikdev'
db = SQLAlchemy(app)

@app.route("/create_all")
def route_create_all():
    from api.models.user import User, Committee, OfficialsPost, relationship_table
    db.drop_all()
    db.create_all()


    user2 = User()
    user2.email = "joppe"
    committee1 = Committee()
    committee1.name = "MKMKMKMKHÄSTEN HETER FÖL"
    officialspost1 = OfficialsPost()
    officialspost1.name= "haaj"
    user2.officials_posts.append(officialspost1)
    officialspost1.committee = committee1


    db.session.add(user2)
    db.session.add(committee1)
    db.session.add(officialspost1)
    db.session.commit()

    return "klar"

from api import routes
