"""
Item Service (News, Event, Album, Document)
"""

from datetime import datetime
from typing import Any, Dict, List, Type
from urllib.parse import quote, unquote
from models.content import (
    Item,
    MediaTranslation,
    PublishedStatus,
    DocumentTranslation,
    EventTranslation,
    NewsTranslation,
    News,
    Document,
    Event,
    Media,
)
from models.core import Student, AuthorType, Author
from models.committees import Committee, CommitteePosition
from services.core import get_author_from_email
from utility import normalize_to_ascii
from utility import database
from utility.constants import AVAILABLE_LANGUAGES
from sqlalchemy import inspect
from dateutil import parser

from utility.translation import convert_iso_639_1_to_bcp_47


db = database.db


def get_item_by_url(
    url: str, item_table: Type[Item] = Item, provided_languages: List[str] | None = None
) -> Dict[str, Any] | None:
    """
    Retrieves an item from the item table by its URL.

    Args:
        url (str): The URL of the item.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use.
            Defaults to AVAILABLE_LANGUAGES.

    Returns:
        Dict[str, Any] | None: The item as a dictionary or None if the item is not found.
    """

    if provided_languages is None:
        provided_languages = AVAILABLE_LANGUAGES

    item = item_table.query.filter_by(url=unquote(url)).first()

    if not item:
        return None

    if not isinstance(item, Item):
        return None

    return item.to_dict(provided_languages=provided_languages, is_public_route=False)


def get_items(
    item_table: Type[Item] = Item, provided_languages: List[str] | None = None
) -> Dict[str, Any]:
    """
    Retrieves all items from the item table.

    Args:
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (str, optional): The language code to use. Defaults to DEFAULT_LANGUAGE_CODE.

    Returns:
        Dict[str, Any]: A dictionary containing the items and pagination information.
    """

    if provided_languages is None:
        provided_languages = AVAILABLE_LANGUAGES

    paginated_items = item_table.query.paginate()

    items = paginated_items.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )
        is not None
    ]

    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def get_items_from_author(
    author: Author,
    item_table: Type[Item] = Item,
    provided_languages: List[str] | None = None,
) -> Dict[str, Any]:
    """
    Retrieves all items from the given author.

    Args:
        author (Author): The author to retrieve items from.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (str, optional): The language code to use. Defaults to DEFAULT_LANGUAGE_CODE.

    Returns:
        Dict[str, Any]: A dictionary containing the items and pagination information.
    """
    if provided_languages is None:
        provided_languages = AVAILABLE_LANGUAGES
    paginated_items = item_table.query.filter_by(author_id=author.author_id).paginate()

    items = paginated_items.items
    items_dict = [
        item_dict
        for item in items
        if (
            item_dict := item.to_dict(
                provided_languages=provided_languages, is_public_route=False
            )
        )
        is not None
    ]

    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def create_item(
    author_table: Type[Student | Committee | CommitteePosition],
    email: str,
    item_table: Item,
    data: Dict[str, Any] | None = None,
    public: bool = False,
) -> str | None:
    """
    Creates an item in the item table.

    Args:
        author_table (Type[Student | Committee | CommitteePosition]): The author table to use.
        author_email (str, optional): The email of the author. Defaults to None.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        data (Dict[str, Any], optional): The data to create the item with. Defaults to None.

    Returns:
        str | None: The ID of the created item or None if the item could not be created.
    """

    if not data:
        data = {}

    if not email or not author_table:
        raise ValueError("author_email and author_table are required")

    author: Author | None = get_author_from_email(
        entity_table=author_table, email=email
    )

    if not author or not isinstance(author, Author):
        raise ValueError("Invalid author")

    if not data.get("translations"):
        for language_code, index in enumerate(AVAILABLE_LANGUAGES):
            data["translations"][index] = {
                "language_code": language_code,
                "title": "Untitled Item",
            }

    all_authors_items = item_table.query.filter_by(author_id=author.author_id).all()

    if all_authors_items:
        authors_items_ids = []

        translation_table = None
        if isinstance(item_table, News) or item_table is News:
            authors_items_ids = [a.news_id for a in all_authors_items]
            translation_table = NewsTranslation
        elif isinstance(item_table, Event) or item_table is Event:
            authors_items_ids = [a.event_id for a in all_authors_items]
            translation_table = EventTranslation
        elif isinstance(item_table, Media) or item_table is Media:
            authors_items_ids = [a.media_id for a in all_authors_items]
            translation_table = MediaTranslation
        elif isinstance(item_table, Document) or item_table is Document:
            authors_items_ids = [a.document_id for a in all_authors_items]
            translation_table = DocumentTranslation
        else:
            raise NotImplementedError(f"Unsupported item type: {item_table}")

        if not translation_table:
            raise NotImplementedError(f"Unsupported item type: {item_table}")

        mapper = inspect(translation_table)
        if not mapper:
            raise NotImplementedError(f"Unsupported item type: {item_table}")
        primary_key_columns = mapper.primary_key
        translation_pk = primary_key_columns[0]

        original_title = data["translations"][0]["title"]
        title_query = translation_table.query.filter(
            translation_pk.in_(authors_items_ids),
            translation_table.title == original_title,
        )

        count = 0
        new_title = original_title
        while title_query.count() > 0:
            count += 1
            new_title = f"{original_title} ({count})"

            title_query = translation_table.query.filter(
                translation_pk.in_(authors_items_ids),
                translation_table.title == new_title,
            )

        data["translations"][0]["title"] = new_title

    translation_data: List[Dict[str, Any]] = data.get("translations")

    del data["translations"]
    if data["author"]:
        del data["author"]

    item = item_table()
    setattr(item, "author_id", author.author_id)
    if not public:
        setattr(item, "published_status", PublishedStatus.DRAFT)
    else:
        setattr(item, "published_status", PublishedStatus.PUBLISHED)
    setattr(item, "is_public", public)
    setattr(item, "created_at", datetime.now())

    for key, value in data.items():
        if hasattr(item, key):
            if "date" in key:
                setattr(
                    item,
                    key,
                    parser.isoparse(value),
                )
            else:
                setattr(item, key, value)

    db.session.add(item)
    db.session.flush()

    if not translation_data:
        return str(item.item_id)

    for translation in translation_data:
        language_code = convert_iso_639_1_to_bcp_47(translation.get("language_code"))
        del translation["language_code"]
        if isinstance(item, News):
            translation = NewsTranslation(
                news_id=item.news_id,
                language_code=language_code,
                **translation,
            )
        elif isinstance(item, Event):
            translation = EventTranslation(
                event_id=item.event_id,
                language_code=language_code,
                **translation,
            )
        elif isinstance(item, Media):
            translation = MediaTranslation(
                media_id=item.media_id,
                language_code=language_code,
                **translation,
            )
        elif isinstance(item, Document):
            translation = DocumentTranslation(
                document_id=item.document_id,
                language_code=language_code,
                **translation,
            )
        else:
            raise NotImplementedError(f"Unsupported item type: {type(item_table)}")

        db.session.add(translation)

    if author.author_type == AuthorType.COMMITTEE:
        committee: Committee = Committee.query.filter_by(email=email).first_or_404()
        if isinstance(item, Media):
            setattr(committee, "total_media", committee.total_media + 1)
        elif isinstance(item, Document):
            setattr(committee, "total_documents", committee.total_documents + 1)
        elif isinstance(item, Event):
            setattr(committee, "total_events", committee.total_events + 1)
        elif isinstance(item, News):
            setattr(committee, "total_news", committee.total_news + 1)

    db.session.commit()

    return str(item.item_id)


def update_translations(
    original_item: Item,
    translation_table: Type[
        NewsTranslation | EventTranslation | MediaTranslation | DocumentTranslation
    ],
    translations: List[Dict[str, Any]],
):
    """Updates the translations of the given item.

    Args:
        translations (Dict[str, Type[object]]): The translations to update.
    """

    fk_map = {
        NewsTranslation: "news_id",
        EventTranslation: "event_id",
        MediaTranslation: "album_id",
        DocumentTranslation: "document_id",
    }

    correct_fk = fk_map[translation_table]

    for translation in translations:
        translation_column = translation_table.query.filter_by(
            **{
                correct_fk: getattr(original_item, correct_fk),
                "language_code": convert_iso_639_1_to_bcp_47(
                    translation["language_code"]
                ),
            }
        ).first()
        if not translation_column:
            continue
        for key, value in translation.items():
            if hasattr(translation_column, key):
                if key == "language_code":
                    setattr(translation_column, key, convert_iso_639_1_to_bcp_47(value))
                else:
                    setattr(translation_column, key, value)
        db.session.add(translation_column)
    db.session.flush()


def update_item(previous_item: Item, data: Dict[str, Any]):
    """
    Updates the given item.
    """
    for key, value in data.items():
        if hasattr(previous_item, key):
            setattr(previous_item, key, value)

    db.session.add(previous_item)

    db.session.commit()


def publish(
    item: Item,
    translation_table: Type[
        NewsTranslation | EventTranslation | MediaTranslation | DocumentTranslation
    ],
    translations: List[Dict[str, Any]],
) -> str | bool:
    """
    Publishes the given items.

    Args:
        translations (Dict[str, Type[object]]): All the translations of the item.
        item (Item): The item to publish.

    Returns:
        str: if the item was successfully published, the new URL of the item.
        bool: False if the item was not successfully published.
    """

    update_translations(item, translation_table, translations)
    db.session.flush()

    if isinstance(item, News):
        title = ""
        if translations[0]["language_code"] == "en":
            title = translations[0]["title"]
        else:
            for translation in translations:
                if translation["language_code"]:
                    title = translation["title"]
                    break

        seo_friendly_url = normalize_to_ascii(title).split(" ")
        seo_friendly_url = (
            "-".join(seo_friendly_url) + "-" + datetime.now().strftime("%Y-%m-%d")
        )
        seo_friendly_url = seo_friendly_url.lower()

        seo_friendly_url = quote(seo_friendly_url)

        setattr(item, "url", str(seo_friendly_url))

    setattr(item, "is_public", True)
    setattr(item, "created_at", datetime.now())
    setattr(item, "published_status", PublishedStatus.PUBLISHED)

    db.session.add(item)
    db.session.commit()

    return seo_friendly_url


def delete_item(
    item_table: type[News] | type[Event] | type[Media] | type[Document],
    item_id: str,
):
    """
    Deletes the given item.

    Args:
        item (Type[object]): The item to delete.
        translation (Type[object]): The translation of the item.
    """
    model_translation_map = {
        News: (NewsTranslation, "news_id"),
        Event: (EventTranslation, "event_id"),
        Media: (MediaTranslation, "album_id"),
        Document: (DocumentTranslation, "document_id"),
    }

    if item_table not in model_translation_map:
        raise NotImplementedError(f"Unsupported item type: {item_table}")

    translation_table, item_id_attr = model_translation_map[item_table]

    # Fetch the item using a dynamic filter
    item = item_table.query.filter_by(**{item_id_attr: item_id}).first_or_404()

    # Fetch the translations using a dynamic filter
    translations = translation_table.query.filter_by(
        **{item_id_attr: getattr(item, item_id_attr)}
    ).all()

    for translation in translations:
        db.session.delete(translation)

    db.session.flush()
    db.session.delete(item)
    db.session.commit()
