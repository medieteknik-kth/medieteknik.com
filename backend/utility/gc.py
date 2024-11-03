"""
Google Cloud Utility Module
"""

import os
from datetime import timedelta
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
from urllib.parse import unquote, urlparse


json_key_path = (
    "/mnt/env/service-account-file.json"
    if os.getenv("FLASK_ENV") == "production"
    else "/app/service-account-file.json"
)

client = storage.Client.from_service_account_json(json_credentials_path=json_key_path)

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
) -> str | None:
    """
    Uploads a file to the bucket and returns its URL
        :param file: any - The file to upload
        :param file_name: str - The name of the file
        :param path: str - The path to store the file in, defaults to the root of the bucket
        :param language_code: str - The language code of the file, defaults to None
        :param content_disposition: str - The content disposition of the file, defaults to None
        :param content_type: str - The content type of the file, defaults to None
        :param timedelta: timedelta - The expiration time of the file, defaults to 365 days, None for public
        :return: str - The URL of the file if successful, None otherwise
        :raises GoogleCloudError: If an error occurs during the upload
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
        blob.upload_from_file(file)
        if timedelta is None:
            blob.make_public()
            url = blob.public_url
        else:
            url = blob.generate_signed_url(expiration=timedelta)

        return url
    except GoogleCloudError as e:
        print(e)
        return None


def delete_file(url: str) -> bool:
    """
    Deletes a file from the bucket and returns True if successful
        :param url: str - The URL of the file to delete
        :return: bool - True if successful, False otherwise
        :raises GoogleCloudError: If an error occurs during the deletion
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
