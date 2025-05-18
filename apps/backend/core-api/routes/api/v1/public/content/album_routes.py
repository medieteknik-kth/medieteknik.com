"""
Public Album Routes
API Endpoint: '/api/v1/public/albums'
"""

from http import HTTPStatus
from typing import Annotated

from fastapi import APIRouter, Query
from flask import Response, jsonify, request
from sqlmodel import or_, select

from config import Settings
from models.content import Album, AlbumTranslation
from routes.api.deps import SessionDep
from utility import retrieve_languages

router = APIRouter(
    prefix=Settings.API_ROUTE_PREFIX + "public/albums",
    tags=["Public", "Album"],
    responses={404: {"description": "Not found"}},
)


@router.get("/")
async def get_albums(
    session: SessionDep,
    language: str | None = None,
    query: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    limit: Annotated[int, Query(le=100)] = 100,
) -> Response:
    """
    Retrieves all albums
        :return: Response - The response object, 200 if successful
    """

    provided_languages = retrieve_languages(language)

    paginated_albums_stmt = select(Album)
    total_albums_stmt = select(Album)
    paginated_albums = session.exec(total_albums_stmt).all()

    if query:
        paginated_albums_stmt = paginated_albums_stmt.where(
            or_(
                Album.album_id == query,
                Album.album_translations.any(
                    AlbumTranslation.title.ilike(f"%{query}%")
                ),
            )
        )

    paginated_albums_stmt = (
        paginated_albums_stmt.order_by(Album.created_at.desc())
        .offset(page * limit)
        .limit(limit)
    )

    albums = session.exec(paginated_albums_stmt).all()

    album_dicts = [
        album_dict
        for album in albums
        if (album_dict := album.to_dict(provided_languages=provided_languages))
        is not None
    ]

    return jsonify(
        {
            "items": album_dicts,
            "page": page,
            "per_page": paginated_albums.per_page,
            "total_pages": paginated_albums.pages,
            "total_items": paginated_albums.total,
        }
    ), HTTPStatus.OK


@public_album_bp.route("/<string:album_id>", methods=["GET"])
def get_album(album_id) -> Response:
    """
    Retrieves an album by ID
        :param album_id: str - The ID of the album
        :return: Response - The response object, 404 if the album is not found, 200 if successful
    """

    provided_languages = retrieve_languages(args=request.args)

    album = Album.query.get_or_404(album_id)

    album_dict = album.to_dict(provided_languages=provided_languages)
    media_dicts = [
        media.to_dict(provided_languages=provided_languages) for media in album.media
    ]

    return jsonify({"album": album_dict, "media": media_dicts}), HTTPStatus.OK
