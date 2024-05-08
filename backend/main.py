from flask import Flask
from utility.database import db
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'secret')
app.config.from_object('config')

db.init_app(app)

if __name__ == '__main__':
    app.run(debug=True)
