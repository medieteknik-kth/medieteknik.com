from flask import Blueprint, request, jsonify
from models.content import News, Event, Document, Album
from utility.translation import retrieve_languages
from services.content.public.item import *

public_news_bp = Blueprint('public_news', __name__)
public_events_bp = Blueprint('public_events', __name__)
public_documents_bp = Blueprint('public_documents', __name__)
public_albums_bp = Blueprint('public_albums', __name__)

@public_news_bp.route('/', methods=['GET'])
def get_news() -> dict:
    """Retrieves all news
    
    Returns:
        list[dict]: List of news
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get('author')

    if author_id:
        return jsonify(
            get_items_from_author(Author.query.get(author_id), News, provided_languages)
        ), 200
    
    return jsonify(get_items(News, provided_languages)), 200


@public_news_bp.route('/<string:url>', methods=['GET'])
def get_news_by_url(url: str) -> dict:
    """Retrieves a news item by URL
    
    Args:
        url (str): News URL
    
    Returns:
        dict: News item
    """
    provided_languages = retrieve_languages(request.args)
    
    item = get_item_by_url(url, News, provided_languages)

    if not item:
        return jsonify({}), 404
    item: News = item

    return jsonify(item)


@public_events_bp.route('/', methods=['GET'])
def get_events() -> dict:
    """Retrieves all events
    
    Returns:
        list[dict]: List of events
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get('author')

    if author_id:
        return jsonify(
            get_items(Event, provided_languages, author_id=author_id)
        ), 200
    
    return jsonify(get_items(Event, provided_languages)), 200


@public_events_bp.route('/<string:url>', methods=['GET'])
def get_events_by_url(url: str) -> dict:
    """Retrieves a event item by URL
    
    Args:
        url (str): Event URL
    
    Returns:
        dict: Event item
    """
    provided_languages = retrieve_languages(request.args)
    
    item = get_item_by_url(url, Event, provided_languages)

    if not item:
        return jsonify({}), 404
    item: Event = item

    return jsonify(item)


@public_documents_bp.route('/', methods=['GET'])
def get_documents() -> dict:
    """Retrieves all documents
    
    Returns:
        list[dict]: List of documents
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get('author')

    if author_id:
        return jsonify(
            get_items(Document, provided_languages, author_id=author_id)
        ), 200
    
    return jsonify(get_items(Document, provided_languages)), 200

@public_documents_bp.route('/<string:url>', methods=['GET'])
def get_documents_by_url(url: str) -> dict:
    """Retrieves a document item by URL
    
    Args:
        url (str): Document URL
    
    Returns:
        dict: Document item
    """
    provided_languages = retrieve_languages(request.args)
    
    item = get_item_by_url(url, Document, provided_languages)

    if not item:
        return jsonify({}), 404
    item: Document = item

    return jsonify(item)


@public_albums_bp.route('/', methods=['GET'])
def get_albums() -> dict:
    """Retrieves all albums
    
    Returns:
        list[dict]: List of albums
    """
    provided_languages = retrieve_languages(request.args)
    author_id = request.args.get('author')

    if author_id:
        return jsonify(
            get_items(Album, provided_languages, author_id=author_id)
        ), 200
    
    return jsonify(get_items(Album, provided_languages)), 200

@public_albums_bp.route('/<string:url>', methods=['GET'])
def get_albums_by_url(url: str) -> dict:
    """Retrieves a album item by URL
    
    Args:
        url (str): Album URL
    
    Returns:
        dict: Album item
    """
    provided_languages = retrieve_languages(request.args)
    
    item = get_item_by_url(url, Album, provided_languages)

    if not item:
        return jsonify({}), 404
    item: Album = item

    return jsonify(item)

