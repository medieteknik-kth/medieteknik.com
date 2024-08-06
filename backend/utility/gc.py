"""
Google Cloud Utility Module
"""

import os
from datetime import timedelta
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
from urllib.parse import urlparse


client = storage.Client()
bucket_name = "medieteknik-static"
bucket = client.get_bucket(bucket_name)


def upload_file(
    file,
    file_name: str,
    path: str,
    language_code: str | None = None,
    content_disposition: str | None = None,
    content_type: str | None = None,
):
    """
    Uploads a file to the bucket

    Args:
        file (Any): File to upload
        file_name (str): File to upload
        path (str): Path of the file
        language_code (str): Language code (Optional)
        content_disposition (str): Content disposition (Optional)

    Returns:
        str: URL of the uploaded file

    Raises:
        GoogleCloudError: Error while uploading the file
    """

    try:
        blob = bucket.blob(os.path.join(path, file_name))
        if language_code:
            blob.content_language = language_code
        if content_disposition:
            blob.content_disposition = content_disposition
        if content_type:
            blob.content_type = content_type
        blob.upload_from_file(file)
        url = blob.generate_signed_url(expiration=timedelta(days=365))

        return url
    except GoogleCloudError as e:
        print(e)
        raise


def delete_file(url: str):
    """
    Deletes a file from the bucket

    Args:
        file_name (str): File to delete
        path (str): Path of the file

    Returns:
        None
    """
    try:
        parsed_url = urlparse(url)
        blob_name = parsed_url.path.lstrip("/")
        blob_name = blob_name.split("/", 1)[1]
        blob = bucket.blob(blob_name)
        blob.delete()
    except GoogleCloudError as e:
        print(e)
        raise
