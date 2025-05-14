"""
Google Cloud Utility Module
"""

import os
from datetime import timedelta
from urllib.parse import unquote, urlparse

from google.cloud import pubsub_v1, storage, tasks_v2
from google.cloud.exceptions import GoogleCloudError
from google.cloud.storage.bucket import Bucket

json_key_path = (
    "/mnt/env/service-account-file.json"
    if os.getenv("ENV") == "production"
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
    Upload a file to a Google Cloud Storage bucket.
    Args:
        file: File object to upload.
        file_name (str): Name of the file to store in the bucket.
        path (str): Path within the bucket where the file should be stored.
        language_code (str | None, optional): Content language code. Defaults to None.
        content_disposition (str | None, optional): Content disposition header value. Defaults to None.
        content_type (str | None, optional): MIME type of the file. Defaults to None.
        cache_control (str | None, optional): Cache control header value. Defaults to None.
        bucket (Bucket | None, optional): GCS bucket to upload to. Defaults to medieteknik_bucket.
        timedelta (timedelta | None, optional): Time until the signed URL expires.
            Defaults to 365 days. If None, the file will be made public instead.
    Returns:
        str | None: The public URL or signed URL to the uploaded file if successful, None otherwise.
    Raises:
        GoogleCloudError: If there's an error during the upload process (caught internally).
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
    Delete a file from Google Cloud Storage using its public URL.

    This function parses a given URL, extracts the blob path, and deletes the
    corresponding file from the specified Google Cloud Storage bucket.

    Args:
        url (str): The public URL of the file to delete.
        bucket (Bucket | None, optional): The Google Cloud Storage bucket
            where the file is stored. Defaults to medieteknik_bucket.

    Returns:
        bool: True if the file was successfully deleted, False otherwise.

    Raises:
        GoogleCloudError: Caught internally and returns False if an error occurs
            during deletion.
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
