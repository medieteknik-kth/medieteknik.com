from datetime import datetime
import uuid
from models.content import Item, AlbumTranslation, PublishedStatus, DocumentTranslation, EventTranslation, NewsTranslation, Author, News, Document, Event, Album
from models.core import Student
from models.committees import Committee, CommitteePosition
from services.content.author import get_author_from_email
from utility.translation import normalize_to_ascii
from utility import database
from utility.constants import AVAILABLE_LANGUAGES
from typing import Dict, Type
from sqlalchemy import inspect


db = database.db

def get_item_by_url(url: str, item_table: Type[Item] = Item, provided_languages: list[str] = AVAILABLE_LANGUAGES) -> dict | None:
    """
    Retrieves an item from the item table by its URL.

    Args:
        url (str): The URL of the item.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (list[str], optional): The language codes to use. Defaults to AVAILABLE_LANGUAGES.

    Returns:
        dict: The item as a dictionary.
        None: If the item is not found.
    """

    item: Item | None = item_table.query.filter_by(url=url).first()
    
    if not item:
        return None
    item: Item = item

    return item.to_dict(provided_languages, is_public_route=False)


def get_items(item_table: Type[Item] = Item, provided_languages: list[str] = AVAILABLE_LANGUAGES) -> dict:
    """
    Retrieves all items from the item table.

    Args:
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (str, optional): The language code to use. Defaults to DEFAULT_LANGUAGE_CODE.

    Returns:
        dict: A dictionary containing the items and pagination information.
    """

    paginated_items = item_table.query.paginate()

    items = paginated_items.items
    items_dict = [item_dict for item in items if (item_dict := item.to_dict(provided_languages=provided_languages, is_public_route=False)) is not None]
    
    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def get_items_from_author(author: Author, item_table: Type[Item] = Item, provided_languages: list[str] = AVAILABLE_LANGUAGES) -> list:
    """
    Retrieves all items from the given author.

    Args:
        author (Author): The author to retrieve items from.
        item_table (Type[Item], optional): The item table to use. Defaults to Item.
        language_code (str, optional): The language code to use. Defaults to DEFAULT_LANGUAGE_CODE.

    Returns:
        list: A list of item dictionaries.
    """
    paginated_items = item_table.query.filter_by(author_id=author.author_id).paginate()

    items = paginated_items.items
    items_dict = [item_dict for item in items if (item_dict := item.to_dict(provided_languages=provided_languages, is_public_route=False)) is not None]

    return {
        "items": items_dict,
        "page": paginated_items.page,
        "per_page": paginated_items.per_page,
        "total_pages": paginated_items.pages,
        "total_items": paginated_items.total,
    }


def create_item(author_table: Type[Student | Committee | CommitteePosition], 
                author_email: str | None = None, 
                item_table: Type[Item] = Item, 
                data: dict = {},
                ) -> Item:
    
    author: Author | None = get_author_from_email(entity_table=author_table, entity_email=author_email)

    if not author:
        return None
    
    author: Author = author

    if not data.get('title'):
        data['title'] = 'Untitled Article'

    all_authors_news = item_table.query.filter_by(author_id=author.author_id).all()

    if all_authors_news:
        authors_news_ids = []

        translation_table = None
        if item_table is News:
            authors_news_ids = [a.news_id for a in all_authors_news]
            translation_table = NewsTranslation
        elif item_table is Event:
            authors_news_ids = [a.event_id for a in all_authors_news]
            translation_table = EventTranslation
        elif item_table is Album:
            authors_news_ids = [a.album_id for a in all_authors_news]
            translation_table = AlbumTranslation
        elif item_table is Document:
            authors_news_ids = [a.document_id for a in all_authors_news]
            translation_table = DocumentTranslation
        else:
            raise NotImplementedError(f"Unsupported item type: {item_table}")

        if not translation_table:
            return None
        
        mapper = inspect(translation_table)
        primary_key_columns = mapper.primary_key
        translation_pk = primary_key_columns[0]

        original_title = data.get('title')
        title_query = translation_table.query.filter(
             translation_pk.in_(authors_news_ids),
             translation_table.title == original_title
        )

        count = 0
        new_title = original_title
        while title_query.count() > 0:
            count += 1
            new_title = f"{original_title} ({count})"

            title_query = translation_table.query.filter(
                translation_pk.in_(authors_news_ids),
                translation_table.title == new_title
            )
        
        data['title'] = new_title

    url = uuid.uuid4()
    urlExists = Item.query.filter_by(url=str(url)).first()

    while urlExists:
        url = uuid.uuid4()
        urlExists = Item.query.filter_by(url=str(url)).first()

    data['url'] = str(url)

    translation_data = data.get('translation')

    del data['translation']
    
    item = item_table(
        url=str(url),
        author_id=author.author_id,
        published_status=PublishedStatus.DRAFT,
    )
    db.session.add(item)
    db.session.flush()

    del translation_data[0]['language_code']

    for language in AVAILABLE_LANGUAGES:
        translation = None
        if item_table is News:
            translation = NewsTranslation(
                news_id=item.news_id,
                language_code=language,
                **translation_data[0],
            )
        elif item_table is Event:
            translation = EventTranslation(
                event_id=item.event_id,
                language_code=language,
                **translation_data[0],
            )
        elif item_table is Album:
            translation = AlbumTranslation(
                album_id=item.album_id,
                language_code=language,
                **translation_data[0],
            )
        elif item_table is Document:
            translation = DocumentTranslation(
                document_id=item.document_id,
                language_code=language,
                **translation_data[0],
            )
        else:
            raise NotImplementedError(f"Unsupported item type: {type(item_table)}")
        
        db.session.add(translation)

    db.session.commit()

    return url


def update_translations(translations: Dict[str, Type[NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation]]):
    """Updates the translations of the given item.

    Args:
        translations (Dict[str, Type[object]]): The translations to update.
    """

    for language_keys in translations:
        if language_keys not in AVAILABLE_LANGUAGES:
            continue
        
        translation = translations[language_keys]
        translation.language_code = language_keys
        db.session.add(translation)


def update_item(previous_item: Item, data: dict):
    """
    Updates the given item.
    """

    for key, value in data.items():
        if key not in previous_item.__table__.columns.keys():
            continue

        setattr(previous_item, key, value)
    
    db.session.add(previous_item)
    
    db.session.commit()


def publish(item: Item,
            translations: Dict[str, Type[NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation]], 
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

    for language_keys in translations:
        if language_keys not in AVAILABLE_LANGUAGES:
            return False
        
    update_translations(translations)
    db.session.flush()

    new_url = normalize_to_ascii(next(iter(translations.values())).title).split(' ')
    new_url = '-'.join(new_url) + '-' + datetime.now().strftime('%Y-%m-%d')
    new_url = new_url.lower()

    item.url = new_url
    item.is_public = True
    item.created_at = datetime.now()
    item.published_status = PublishedStatus.PUBLISHED

    db.session.add(item)
    db.session.commit()

    return new_url


def delete_item(item: Type[News | Event | Album | Document], 
                translation: Type[NewsTranslation | EventTranslation | AlbumTranslation | DocumentTranslation]):
    """
    Deletes the given item.

    Args:
        item (Type[object]): The item to delete.
        translation (Type[object]): The translation of the item.
    """

    translations = None

    # Delete translations
    if translation is NewsTranslation:
        item: News = item
        translations = translation.query.filter_by(news_id=item.news_id).all()
    elif translation is EventTranslation:
        item: Event = item
        translations = translation.query.filter_by(event_id=item.event_id).all()
    elif translation is AlbumTranslation:
        item: Album = item
        translations = translation.query.filter_by(album_id=item.album_id).all()
    elif translation is DocumentTranslation:
        item: Document = item
        translations = translation.query.filter_by(document_id=item.document_id).all()
    
    if translations is not None:
        for translation in translations:
            db.session.delete(translation)
    
    db.session.flush()

    # Delete item
    db.session.delete(item)
    db.session.commit()