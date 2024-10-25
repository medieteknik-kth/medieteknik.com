from http import HTTPStatus
import json
from typing import Any, Dict, List
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from utility.database import db
from models.content.album import Album, AlbumTranslation
from utility.translation import convert_iso_639_1_to_bcp_47


album_bp = Blueprint("album", __name__)


@album_bp.route("/", methods=["POST"])
@jwt_required()
def create_album():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), HTTPStatus.BAD_REQUEST

    data: Dict[str, Any] = json.loads(json.dumps(data))

    translation_data: List[Dict[str, Any]] = data.get("translations")

    if not translation_data:
        return jsonify({"error": "No translations provided"}), HTTPStatus.BAD_REQUEST

    if len(translation_data) == 0:
        return jsonify(
            {"error": "At least one translation is required"}
        ), HTTPStatus.BAD_REQUEST

    album = Album()
    db.session.add(album)
    db.session.commit()

    for translation in translation_data:
        if not translation.get("language_code"):
            return jsonify(
                {"error": "Language code is required"}
            ), HTTPStatus.BAD_REQUEST

        language_code = convert_iso_639_1_to_bcp_47(translation.get("language_code"))
        del translation["language_code"]

        if not translation.get("title"):
            return jsonify({"error": "Title is required"}), HTTPStatus.BAD_REQUEST

        if not translation.get("description"):
            return jsonify({"error": "Description is required"}), HTTPStatus.BAD_REQUEST

        album_translation = AlbumTranslation(
            album_id=album.album_id,
            language_code=language_code,
            **translation,
        )
        db.session.add(album_translation)

    db.session.commit()

    return jsonify({"album_id": album.album_id}), HTTPStatus.CREATED