from flask import Blueprint, jsonify, request
from models.content.album import Album, AlbumTranslation
from utility.translation import retrieve_languages


public_album_bp = Blueprint("public_album", __name__)


@public_album_bp.route("/", methods=["GET"])
def get_albums():
    provided_languages = retrieve_languages(args=request.args)
    search_query = request.args.get("q", type=str, default=None)

    paginated_albums = None

    if search_query:
        album_translations = AlbumTranslation.query.filter(
            AlbumTranslation.title.ilike(f"%{search_query}%")
            | AlbumTranslation.description.ilike(f"%{search_query}%")
        ).paginate(max_per_page=10)
        paginated_albums = Album.query.filter(
            Album.album_id.in_(
                [
                    album_translation.album_id
                    for album_translation in album_translations.items
                ]
            )
        ).paginate(max_per_page=10)
    else:
        paginated_albums = Album.query.paginate(max_per_page=10)
    albums = paginated_albums.items

    album_dicts = [
        album_dict
        for album in albums
        if (album_dict := album.to_dict(provided_languages=provided_languages))
        is not None
    ]

    return jsonify(
        {
            "items": album_dicts,
            "page": paginated_albums.page,
            "per_page": paginated_albums.per_page,
            "total_pages": paginated_albums.pages,
            "total_items": paginated_albums.total,
        }
    )


@public_album_bp.route("/<string:album_id>", methods=["GET"])
def get_album(album_id):
    provided_languages = retrieve_languages(args=request.args)

    album = Album.query.get_or_404(album_id)

    album_dict = album.to_dict(provided_languages=provided_languages)
    media_dicts = [
        media.to_dict(provided_languages=provided_languages) for media in album.media
    ]

    return jsonify({"album": album_dict, "media": media_dicts})
