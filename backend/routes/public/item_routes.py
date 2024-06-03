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
            'items': news_dict,
            'page': paginated_items.page,
            'per_page': paginated_items.per_page,
            'total_pages': paginated_items.pages,
            'total_items': paginated_items.total,
        }
    )


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
