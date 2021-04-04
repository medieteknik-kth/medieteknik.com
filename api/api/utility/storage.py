from google.cloud import storage
from werkzeug.utils import secure_filename
import uuid
import os
import tempfile
from api.utility.base64 import parse_b64
import shutil

def upload_blob(bucket_name, source_file, destination_blob_name):
    if os.environ.get('FLASK_ENV') == "development":
        save_folder = os.path.join(os.getcwd(), "api", "static")
        filename = os.path.join(save_folder, destination_blob_name)
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        if isinstance(source_file, str):
            shutil.copyfile(source_file, filename)
        else:
            source_file.save(filename)
        return "http://localhost:5000/static/" + destination_blob_name
    else:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_file(source_file)
        blob.make_public()
        return blob.public_url

def upload_blob_data(bucket_name, data, data_mimetype, destination_blob_name):
    if os.environ.get('FLASK_ENV') == "development":
        save_folder = os.path.join(os.getcwd(), "api", "static")
        filename = os.path.join(save_folder, destination_blob_name)
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        source_file = open(filename, "wb")
        source_file.write(data)
        source_file.close()
        return "http://localhost:5000/static/" + destination_blob_name
    else:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_string(data, content_type=data_mimetype)
        blob.make_public()
        return blob.public_url

def upload_file(source_file, destination_directory = "", allowed_extensions = []):
    filename = uuid
    original_filename, extension = os.path.splitext(secure_filename(source_file.filename))
    filename = str(uuid.uuid4()) + extension
    if not allowed_extensions or extension.lower() in allowed_extensions:
        destination = filename if not destination_directory else destination_directory + "/" + filename
        return upload_blob("medieteknik-static", source_file, destination)
    else:
        raise ValueError("Invalid extension")

def upload_profile_picture(source):
    return upload_file(source, "profiles", [".png", ".jpg", ".jpeg"])

def upload_committee_logo(source, committee):
    return upload_file(source, "commitee_logos/" + committee, [".png"])

def upload_image(source):
    return upload_file(source, "images", [".png", ".jpg", ".jpeg"])

def upload_album_photo(source, album_name):
    return upload_file(source, "albums/" + album_name, [".png", ".jpg", ".jpeg"])

def upload_document(source):
    return upload_file(source, "documents", [".pdf"])

def upload_document_thumbnail(source):
    return upload_file(source, "document_thumbnails", [".png"])

def upload_b64_image(data):
    data, ext, mimetype = parse_b64(data)
    filename = str(uuid.uuid4()) + ext
    return upload_blob_data("medieteknik-static", data, mimetype, "images/" + filename)