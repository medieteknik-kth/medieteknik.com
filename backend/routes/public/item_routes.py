from flask import Blueprint, request, jsonify
from models.items import News, Event, Document, Album

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
    paginated_items = News.query.paginate()
    
    news: list[News] = paginated_items.items
    short_news: bool = request.args.get('short', 'false') == 'true'
    news_dict = []
    if short_news:
        news_dict = [news_item.to_public_short_dict() for news_item in news]
    else:
        news_dict = [news_item.to_public_dict() for news_item in news]
        
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
    news_item: News = News.query.get(news_id)
    short_news: bool = request.args.get('short', 'false') == 'true'
    if short_news:
        return jsonify(news_item.to_public_short_dict())
    return jsonify(news_item.to_public_dict())

@public_events_bp.route('/', methods=['GET'])
def get_events() -> dict:
    """Retrieves all events
    
    Returns:
        list[dict]: List of events
    """
    paginated_items = Event.query.paginate()
    
    events: list[Event] = paginated_items.items
    short_events: bool = request.args.get('short', 'false') == 'true'
    events_dict = []
    if short_events:
        events_dict = [event.to_public_short_dict() for event in events]
    else:
        events_dict = [event.to_public_dict() for event in events]
    
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
    event: Event = Event.query.get(event_id)
    short_event: bool = request.args.get('short', 'false') == 'true'
    if short_event:
        return jsonify(event.to_public_short_dict())
    return jsonify(event.to_public_dict())

@public_documents_bp.route('/', methods=['GET'])
def get_documents() -> dict:
    """Retrieves all documents
    
    Returns:
        list[dict]: List of documents
    """
    paginated_items = Document.query.paginate()
    
    documents: list[Document] = paginated_items.items
    documents_dict = [document.to_public_dict() for document in documents]
    
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
    document: Document = Document.query.get(document_id)
    return jsonify(document.to_public_dict())

@public_albums_bp.route('/', methods=['GET'])
def get_albums() -> dict:
    """Retrieves all albums
    
    Returns:
        list[dict]: List of albums
    """
    paginated_items = Album.query.paginate()
    
    albums: list[Album] = paginated_items.items
    albums_dict = [album.to_public_dict() for album in albums]
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
    album: Album = Album.query.get(album_id)
    return jsonify(album.to_public_dict())