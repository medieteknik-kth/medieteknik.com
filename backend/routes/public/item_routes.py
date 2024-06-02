from flask import Blueprint, request, jsonify
from models.content.base import PublishedStatus
from models.content import News, Event, Document, Album
from utility.translation import retrieve_language

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
    language_code = retrieve_language(request.args)
    
    paginated_items = News.query.paginate()
    
    news: list[News] = paginated_items.items
    short_news: bool = request.args.get('summary', 'false') == 'true'
    news_dict = []
    if short_news:
        for news_item in news:
            if news_item.published_status == PublishedStatus.DRAFT:
                continue
            news_dict.append(news_item.to_dict(language_code, is_public_route=True, summary=True))
    else:
        for news_item in news:
            if news_item.published_status == PublishedStatus.DRAFT:
                continue
            news_dict.append(news_item.to_dict(language_code, is_public_route=True))
        
    return jsonify(
        {
            "items": news_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_news_bp.route('/<int:news_id>', methods=['GET'])
def get_news_item(news_id: int) -> dict:
    """Retrieves a news item
    
    Args:
        news_id (int): News ID
    
    Returns:
        dict: News item
    """
    language_code = retrieve_language(request.args)
    
    news_item: News = News.query.get(news_id)
    short_news: bool = request.args.get('summary', 'false') == 'true'
    if short_news:
        return jsonify(news_item.to_dict(language_code, is_public_route=True, summary=True))
    return jsonify(news_item.to_dict(language_code, is_public_route=True,))

@public_news_bp.route('/<string:url>', methods=['GET'])
def get_news_by_url(url: str) -> dict:
    """Retrieves a news item by URL
    
    Args:
        url (str): News URL
    
    Returns:
        dict: News item
    """
    language_code = retrieve_language(request.args)
    
    news_item: News | None = News.query.filter_by(url=url).first()
    
    if not news_item:
        return jsonify({}), 404
    news_item: News = news_item


    
    return jsonify(news_item.to_dict(language_code, is_public_route=True))

@public_events_bp.route('/', methods=['GET'])
def get_events() -> dict:
    """Retrieves all events
    
    Returns:
        list[dict]: List of events
    """
    language_code = retrieve_language(request.args)
    paginated_items = Event.query.paginate()
    
    events: list[Event] = paginated_items.items
    short_events: bool = request.args.get('summary', 'false') == 'true'
    events_dict = []
    if short_events:
        events_dict = [event.to_dict(language_code, is_public_route=True, summary=True) for event in events]
    else:
        events_dict = [event.to_dict(language_code, is_public_route=True) for event in events]
    
    return jsonify(
        {
            "items": events_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_events_bp.route('/<int:event_id>', methods=['GET'])
def get_event(event_id: int) -> dict:
    """Retrieves an event
    
    Args:
        event_id (int): Event ID
    
    Returns:
        dict: Event
    """
    language_code = retrieve_language(request.args)
    
    event: Event = Event.query.get(event_id)
    short_event: bool = request.args.get('summary', 'false') == 'true'
    if short_event:
        return jsonify(event.to_dict(language_code, summary=True))
    return jsonify(event.to_dict(language_code))

@public_documents_bp.route('/', methods=['GET'])
def get_documents() -> dict:
    """Retrieves all documents
    
    Returns:
        list[dict]: List of documents
    """
    language_code = retrieve_language(request.args)
    paginated_items = Document.query.paginate()
    
    documents: list[Document] = paginated_items.items
    documents_dict = [document.to_dict(language_code, is_public_route=True) for document in documents]
    
    return jsonify(
        {
            "items": documents_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_documents_bp.route( '/<int:document_id>', methods=['GET'])
def get_document(document_id: int) -> dict:
    """Retrieves a document
    
    Args:
        document_id (int): Document ID
    
    Returns:
        dict: Document
    """
    language_code = retrieve_language(request.args)
    
    document: Document = Document.query.get(document_id)
    return jsonify(document.to_dict(language_code, is_public_route=True))

@public_albums_bp.route('/', methods=['GET'])
def get_albums() -> dict:
    """Retrieves all albums
    
    Returns:
        list[dict]: List of albums
    """
    language_code = retrieve_language(request.args)
    paginated_items = Album.query.paginate()
    
    albums: list[Album] = paginated_items.items
    albums_dict = [album.to_dict(language_code, is_public_route=True) for album in albums]
    return jsonify(
        {
            "items": albums_dict,
            "page": paginated_items.page,
            "per_page": paginated_items.per_page,
            "total_pages": paginated_items.pages,
            "total_items": paginated_items.total,
        }
    )

@public_albums_bp.route( '/<int:album_id>', methods=['GET'])
def get_album(album_id: int) -> dict:
    """Retrieves an album
    
    Args:
        album_id (int): Album ID
    
    Returns:
        dict: Album
    """
    language_code = retrieve_language(request.args)
    
    album: Album = Album.query.get(album_id)
    return jsonify(album.to_dict(language_code, is_public_route=True))