"""
Google Cloud Utility Module
"""

import os
from datetime import timedelta
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
from urllib.parse import unquote, urlparse


client = None
if os.getenv("FLASK_ENV") == "development":
    client = storage.Client.from_service_account_json("/app/service-account-file.json")
else:
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
    timedelta: timedelta | None = timedelta(days=365),
):
    """
    Uploads a file to the bucket and returns its URL

    :type file: file
    :param file:
        File to upload

    :type file_name: str
    :param file_name:
        Name of the file

    :type path: str
    :param path:
        Path of the file

    :type language_code: str
    :param language_code:
        (Optional) Language code of the file, fallback to None

    :type content_disposition: str
    :param content_disposition:
        (Optional) Content disposition of the file, fallback to None

    :type content_type: str
    :param content_type:
        (Optional) Content type of the file, fallback to None

    :type timedelta: timedelta
    :param timedelta:
        (Optional) Expiration time of the file, fallback to 365 days

    :rtype: str
    :returns:
        URL of the uploaded file

    :raises: :class:`~google.cloud.exceptions.GoogleCloudError`
        if the upload response returns an error status.
    """

    try:
        blob = bucket.blob(os.path.join(path, file_name))
        if language_code:
            blob.content_language = language_code
        if content_disposition:
            blob.content_disposition = content_disposition
        if content_type:
            blob.content_type = content_type

        url = None
        if timedelta is None:
            blob.make_public()
            url = blob.public_url()
        else:
            url = blob.generate_signed_url(expiration=timedelta)

        blob.upload_from_file(file)

        return url
    except GoogleCloudError as e:
        print(e)
        return None


def delete_file(url: str):
    """
    Deletes a file from the bucket

    Args:
        url (str): URL of the file

    Returns:
        None
    """
    try:
        parsed_url = urlparse(url)
        blob_name = unquote(parsed_url.path.lstrip("/"))
        blob_name = blob_name.split("/", 1)[1]
        blob = bucket.blob(blob_name)
        blob.delete()
        return True
    except GoogleCloudError as e:
        print(e)
        return False
