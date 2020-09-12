from google.cloud import storage
from werkzeug.utils import secure_filename
import uuid
import os

def upload_blob(bucket_name, source_file, destination_blob_name):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_file(source_file)
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