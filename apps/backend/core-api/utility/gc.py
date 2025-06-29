"""
Google Cloud Utility Module
"""

import os
from datetime import timedelta
from google.cloud import storage
from google.cloud.exceptions import GoogleCloudError
from urllib.parse import unquote, urlparse
from google.cloud import pubsub_v1, tasks_v2
from google.cloud.storage.bucket import Bucket

json_key_path = (
    "/mnt/env/service-account-file.json"
    if os.getenv("FLASK_ENV") == "production"
    else "/app/service-account-file.json"
)

# Pub/Sub client
publisher = pubsub_v1.PublisherClient.from_service_account_json(json_key_path)
topic_path = publisher.topic_path(project="medieteknik", topic="deferred-tasks")

# Cloud Tasks client
tasks = tasks_v2.CloudTasksClient.from_service_account_json(json_key_path)
parent = tasks.queue_path(
    project="medieteknik", location="europe-west3", queue="deferred-tasks"
)

# Storage client
client = storage.Client.from_service_account_json(json_credentials_path=json_key_path)

medieteknik_bucket_name = "medieteknik-static"
medieteknik_bucket: Bucket = client.get_bucket(bucket_or_name=medieteknik_bucket_name)

rgbank_bucket_name = "rgbank"
rgbank_bucket: Bucket = client.get_bucket(bucket_or_name=rgbank_bucket_name)


def upload_file(
    file,
    file_name: str,
    path: str,
    language_code: str | None = None,
    content_disposition: str | None = None,
    content_type: str | None = None,
    cache_control: str | None = None,
    bucket: Bucket | None = medieteknik_bucket,
    timedelta: timedelta | None = timedelta(days=365),
) -> str | None:
    """
    Uploads a file to the bucket path, with optional language, disposition,
    and content type settings, and returns a URL to the uploaded file.

    :param file: The file object to upload.
    :type file: file-like object
    :param file_name: The name for the uploaded file in the bucket.
    :type file_name: str
    :param path: The path within the bucket to store the file.
    :type path: str
    :param language_code: The language code (e.g., 'en') for the file content. Default is None.
    :type language_code: str, optional
    :param content_disposition: The disposition header (e.g., 'attachment') for the file content. Default is None.
    :type content_disposition: str, optional
    :param content_type: The MIME type of the file (e.g., 'application/pdf'). Default is None.
    :type content_type: str, optional
    :param bucket: The Google Cloud Storage bucket to upload the file to. Defaults to Medieteknik bucket.
    :type bucket: Bucket, optional
    :param timedelta: The duration the signed URL should be valid. If None, makes the URL public.
                      Defaults to 365 days.
    :type timedelta: timedelta, optional
    :return: The URL to the uploaded file if successful, otherwise None.
    :rtype: str | None
    :raises GoogleCloudError: If an error occurs during the file upload process.
    """
    try:
        blob = bucket.blob(os.path.join(path, file_name))
        if language_code:
            blob.content_language = language_code
        if content_disposition:
            blob.content_disposition = content_disposition
        if content_type:
            blob.content_type = content_type
        if cache_control:
            blob.cache_control = cache_control

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


def delete_file(url: str, bucket: Bucket | None = medieteknik_bucket) -> bool:
    """
    Deletes a file from the bucket based on its URL.

    :param url: The public or signed URL of the file to delete.
    :type url: str
    :param bucket: The Google Cloud Storage bucket to delete the file from. Defaults to Medieteknik bucket.
    :type bucket: Bucket, optional
    :return: True if the file was successfully deleted, otherwise False.
    :rtype: bool
    :raises GoogleCloudError: If an error occurs during the file deletion process.
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
