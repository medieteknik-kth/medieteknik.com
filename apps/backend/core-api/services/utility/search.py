"""
Search service
"""

import json
from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import logger
from sqlalchemy import and_
from sqlalchemy.orm import joinedload

from models.committees.committee import Committee
from models.committees.committee_position import CommitteePosition
from models.content.album import Album
from models.content.base import Item
from models.content.document import Document
from models.content.media import Media
from models.content.news import News
from utility.cache import set_cache


def update_search_cache(language: str) -> str | None:
    data = {}
    try:
        data = get_search_data(language)
        set_cache(
            f"search_{language}",
            json.dumps(
                {
                    "updated_at": datetime.now().isoformat(),
                    "data": data,
                }
            ),
        )
    except Exception:
        logger.logger.exception(
            "Failed to update search cache for language %s: %s",
            language,
            data,
        )
        return None

    return data


def get_search_data(language: str):
    committees: List[Committee] = (
        Committee.query.options(joinedload(Committee.translations))
        .filter(Committee.email.not_in(["info@kth.se", "ordf@ths.kth.se"]))
        .all()
    )
    committee_positions: List[CommitteePosition] = (
        CommitteePosition.query.options(joinedload(CommitteePosition.translations))
        .filter(
            and_(
                CommitteePosition.role != "MEMBER",
                CommitteePosition.active,
            )
        )
        .all()
    )

    published_filter = [Item.is_public, Item.published_status == "PUBLISHED"]

    # Items
    albums: List[Album] = Album.query.options(joinedload(Album.translations)).all()
    documents: List[Document] = (
        Document.query.options(
            joinedload(Document.translations), joinedload(Document.author)
        )
        .filter(*published_filter)
        .order_by(Document.created_at.desc())
        .all()
    )
    media: List[Media] = (
        Media.query.options(joinedload(Media.translations), joinedload(Media.author))
        .filter(*published_filter)
        .order_by(Media.created_at.desc())
        .all()
    )

    news: List[News] = (
        News.query.options(joinedload(News.translations), joinedload(News.author))
        .filter(*published_filter)
        .order_by(News.created_at.desc())
        .all()
    )

    def get_translation(obj, language):
        translations = {t.language_code: t.to_dict() for t in obj.translations}
        result = translations.get(language) or translations.get("en-GB") or None
        if not result:
            opposite_language = (
                "en-GB" if language != "en-GB" else "sv-SE"
            )  # TODO: Fix this
            result = translations.get(opposite_language) or None
        return result

    data = {
        "committees": [
            {
                "email": c.email,
                "logo_url": c.logo_url,
                "translation": get_translation(c, language),
            }
            for c in committees
        ],
        "committee_positions": [
            {
                "email": p.email,
                "committee": {
                    "email": p.committee.email,
                    "logo_url": p.committee.logo_url,
                    "title": get_translation(p.committee, language).get("title", None),
                }
                if p.committee
                else None,
                "translation": get_translation(
                    p,
                    language,
                ),
            }
            for p in committee_positions
        ],
        "albums": [
            {
                "updated_at": a.updated_at,
                "translation": get_translation(a, language),
            }
            for a in albums
        ],
        "documents": [
            {
                "author": d.author.to_dict(provided_languages=language),
                "last_updated": d.last_updated,
                "created_at": d.created_at,
                "translation": get_translation(d, language),
            }
            for d in documents
        ],
        "media": [
            {
                "author": m.author.to_dict(provided_languages=language),
                "last_updated": m.last_updated,
                "created_at": m.created_at,
                "translation": get_translation(m, language),
            }
            for m in media
        ],
        "news": [
            {
                "author": n.author.to_dict(provided_languages=language),
                "url": n.url,
                "last_updated": n.last_updated,
                "created_at": n.created_at,
                "translation": {
                    "title": get_translation(n, language).get("title"),
                    "main_image_url": get_translation(n, language).get("main_image_url")
                    or None,
                    "short_description": get_translation(n, language).get(
                        "short_description"
                    )
                    or None,
                    "language_code": get_translation(n, language).get("language_code"),
                },
            }
            for n in news
        ],
    }

    class CustomJSONEncoder(json.JSONEncoder):
        def default(self, obj):
            if isinstance(obj, datetime):
                return obj.isoformat()
            if isinstance(obj, UUID):
                return str(obj)
            return super().default(obj)

    return json.dumps(data, cls=CustomJSONEncoder)
