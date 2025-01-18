from datetime import date
from http import HTTPStatus
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt, jwt_required
from sqlalchemy import func
from models.committees.committee import Committee
from models.content.album import Album
from models.content.media import Media
from models.core.student import Student
from services.content.item import create_item
from utility.constants import AVAILABLE_LANGUAGES
from utility.gc import upload_file
from utility.translation import convert_iso_639_1_to_bcp_47
from utility.database import db


media_bp = Blueprint("media", __name__)


@media_bp.route("/", methods=["POST"])
@jwt_required()
def create_media():
    form_data = request.form

    if not form_data:
        return jsonify({"error": "No data provided"}), 400

    media_type = form_data.get("media_type")
    author_type = form_data.get("author[author_type]")
    email = form_data.get("author[email]")

    if media_type is None or author_type is None or email is None:
        return jsonify(
            {
                "error": "Missing required fields, either 'author' or 'media_type' is missing"
            }
        ), HTTPStatus.BAD_REQUEST

    author_table = None
    if author_type == "STUDENT":
        claims = get_jwt()
        permissions = claims.get("permissions")

        if not permissions:
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        if "NEWS" not in permissions.get("author"):
            return jsonify({"error": "Not authorized"}), HTTPStatus.UNAUTHORIZED

        author_table = Student
    elif author_type == "COMMITTEE":
        author_table = Committee
    else:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

    if author_table is None:
        return jsonify({"error": "Invalid author type"}), HTTPStatus.BAD_REQUEST

    album_id = form_data.get("album_id")

    url = ""

    if media_type == "image":
        img = request.files.get("media")

        if img is None:
            return jsonify({"error": "No image provided"}), HTTPStatus.BAD_REQUEST

        # Check if the file size is too large
        if img.content_length > 10 * 1024 * 1024:
            return jsonify({"error": "File size too large"}), HTTPStatus.BAD_REQUEST

        current_year = date.today().strftime("%Y")
        current_month = date.today().strftime("%m")
        file_extension = img.filename.split(".")[-1]
        result = upload_file(
            file=img,
            file_name=f"{img.filename}",
            path=f"media/{current_year}/{current_month}",
            timedelta=None,
            content_disposition="inline",
            content_type=f"image/{file_extension}",
        )

        if not result:
            return jsonify(
                {"error": "Failed to upload file"}
            ), HTTPStatus.INTERNAL_SERVER_ERROR

        url = result

    elif media_type == "video":
        # Check if the youtube link is valid
        youtube_url = form_data.get("youtube_url")

        if youtube_url is None:
            return jsonify(
                {"error": "No youtube link provided"}
            ), HTTPStatus.BAD_REQUEST

        if "youtube.com" not in youtube_url and "youtu.be" not in youtube_url:
            return jsonify({"error": "Invalid youtube link"}), HTTPStatus.BAD_REQUEST

        url = youtube_url

    if not url:
        return jsonify(
            {"error": "Failed to upload file"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    item_id = create_item(
        author_table=author_table,
        email=email,
        item_table=Media,
        data={
            "media_url": url,
            "media_type": media_type.upper(),
            "author": {"author_type": author_type, "email": email},
            **({"album_id": album_id} if album_id else {}),
            "translations": [
                {
                    "language_code": convert_iso_639_1_to_bcp_47(
                        form_data.get(f"translations[{index}][language_code]")
                    ),
                    "title": form_data.get(f"translations[{index}][title]"),
                    "description": form_data.get(
                        f"translations[{index}][description]", ""
                    ),
                }
                for index, _ in enumerate(AVAILABLE_LANGUAGES)
            ],
        },
        public=True,
    )

    if not item_id:
        return jsonify(
            {"error": "Failed to create item"}
        ), HTTPStatus.INTERNAL_SERVER_ERROR

    if album_id is not None:
        album: Album = Album.query.get_or_404(album_id)
        media: Media = Media.query.get_or_404(item_id)

        setattr(album, "last_updated", func.now())
        if media_type == "image":
            setattr(album, "preview_media_id", media.media_id)
            setattr(album, "total_images", album.total_images + 1)
        elif media_type == "video":
            setattr(album, "total_videos", album.total_videos + 1)

    db.session.commit()

    return jsonify({"message": "Media created successfully"}), HTTPStatus.CREATED
