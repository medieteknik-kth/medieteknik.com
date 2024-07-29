"""
Item Service (News, Event, Album, Document)
"""

from datetime import datetime
from typing import Any, Dict, List, Type
from models.content import (
    Item,
    AlbumTranslation,
    PublishedStatus,
    DocumentTranslation,
    EventTranslation,
    NewsTranslation,
    Author,
    News,
    Document,
    Event,
    Album,
)
from models.core import Student
from models.committees import Committee, CommitteePosition
from services.content.author import get_author_from_email
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

    item = item_table.query.filter_by(url=url).first()

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
    author_email: str,
    item_table: Type[Item] = Item,
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

    if not author_email or not author_table:
        return None

    author: Author | None = get_author_from_email(
        entity_table=author_table, entity_email=author_email
    )

    if not author or not isinstance(author, Author):
        return None

    if not data.get("translations"):
        index = 0
        for language_code in AVAILABLE_LANGUAGES:
            data["translations"][index] = {
                "language_code": language_code,
                "title": "Untitled Item",
            }
            index += 1

    all_authors_items = item_table.query.filter_by(author_id=author.author_id).all()

    if all_authors_items:
        authors_items_ids = []

        translation_table = None
        if item_table is News:
            authors_items_ids = [a.news_id for a in all_authors_items]
            translation_table = NewsTranslation
        elif item_table is Event:
            authors_items_ids = [a.event_id for a in all_authors_items]
            translation_table = EventTranslation
        elif item_table is Album:
            authors_items_ids = [a.album_id for a in all_authors_items]
            translation_table = AlbumTranslation
        elif item_table is Document:
            authors_items_ids = [a.document_id for a in all_authors_items]
            translation_table = DocumentTranslation
        else:
            raise NotImplementedError(f"Unsupported item type: {item_table}")

        if not translation_table:
            return None

        mapper = inspect(translation_table)
        if not mapper:
            return None
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

    translation_data = data.get("translations")

    del data["translations"]
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

    del translation_data[0]["language_code"]

    for language in AVAILABLE_LANGUAGES:
        translation = None
        if isinstance(item, News):
            translation = NewsTranslation(
                news_id=item.news_id,
                language_code=language,
                **translation_data[0],
            )  # type: ignore
        elif isinstance(item, Event):
            translation = EventTranslation(
                event_id=item.event_id,
                language_code=language,
                **translation_data[0],
            )  # type: ignore
        elif isinstance(item, Album):
            translation = AlbumTranslation(
                album_id=item.album_id,
                language_code=language,
                **translation_data[0],
            )  # type: ignore
        elif isinstance(item, Document):
            translation = DocumentTranslation(
                document_id=item.document_id,
                language_code=language,
                **translation_data[0],
            )  # type: ignore
        else:
            raise NotImplementedError(f"Unsupported item type: {type(item_table)}")

        db.session.add(translation)

    db.session.commit()

    return str(item.item_id)


def update_translations(
    original_item: Item,
    translation_table: Type[
        NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation
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
        AlbumTranslation: "album_id",
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
        NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation
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

    # Prefer english title
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

    setattr(item, "url", str(seo_friendly_url))
    setattr(item, "is_public", True)
    setattr(item, "created_at", datetime.now())
    setattr(item, "published_status", PublishedStatus.PUBLISHED)

    db.session.add(item)
    db.session.commit()

    return seo_friendly_url


def delete_item(
    item: Item,
    translation: Type[
        NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation
    ],
):
    """
    Deletes the given item.

    Args:
        item (Type[object]): The item to delete.
        translation (Type[object]): The translation of the item.
    """

    translations = None

    # Delete translations
    if isinstance(item, News):
        translations = translation.query.filter_by(news_id=item.news_id).all()
    elif isinstance(item, Event):
        translations = translation.query.filter_by(event_id=item.event_id).all()
    elif isinstance(item, Album):
        translations = translation.query.filter_by(album_id=item.album_id).all()
    elif isinstance(item, Document):
        translations = translation.query.filter_by(document_id=item.document_id).all()

    if translations is not None:
        for translation in translations:
            db.session.delete(translation)

    db.session.flush()

    # Delete item
    db.session.delete(item)
    db.session.commit()
