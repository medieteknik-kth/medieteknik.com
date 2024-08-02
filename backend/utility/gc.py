"""
Google Cloud Utility Module
"""

from datetime import timedelta
import os
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError

client = storage.Client()
bucket_name = "medieteknik-static"
bucket = client.get_bucket(bucket_name)


def upload_file(file, file_name: str, path: str):
    """
    Uploads a file to the bucket

    Args:
        file (Any): File to upload
        file_name (str): File to upload
        path (str): Path of the file

    Returns:
        str: URL of the uploaded file

    Raises:
        GoogleCloudError: Error while uploading the file
    """
    try:
        blob = bucket.blob(os.path.join(path, file_name))
        blob.upload_from_file(file)
        url = blob.generate_signed_url(expiration=timedelta(days=365))

        return url
    except GoogleCloudError as e:
        print(e)
        raise
