from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://medieteknik:rgb@db/medieteknikdev'
db = SQLAlchemy(app)

@app.route("/create_all")
def route_create_all():
    from api.models.user import User
    db.drop_all()
    db.create_all()

    user1 = User()
    user1.username = "admin"

    user2 = User()
    user2.username = "joppe"

    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    return "klar"

from api import routes
