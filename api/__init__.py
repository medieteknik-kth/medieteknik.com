from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://medieteknik:rgb@db/medieteknikdev'
db = SQLAlchemy(app)

@app.route("/create_all")
def route_create_all():
    db.drop_all()
    db.create_all()

    db.session.commit()

    return "klar"

from api import routes
