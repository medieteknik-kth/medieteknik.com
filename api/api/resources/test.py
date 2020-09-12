from flask import make_response, request
from flask_restful import Resource
from werkzeug.utils import secure_filename
import os

from api.utility.storage import upload_file

class TestResource(Resource):
    def post(self):
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        url = upload_file(file)
        return url

    def get(self):
        response = make_response("<form action='/albums' method='post' enctype='multipart/form-data'><input type='text' name='name' placeholder='Album name' /><input name='photos' type='file' multiple /><input type='submit' /></form>")
        return response