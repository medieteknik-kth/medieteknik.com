from api import app
from api.models.user import User

@app.route('/')
def index():
    return "hej"
