from flask import Blueprint, request, jsonify
from models.content import Author, News, NewsTranslation
from services.content.item import *
from utility.translation import retrieve_languages
import json

news_bp = Blueprint('news', __name__)
events_bp = Blueprint('events', __name__)
documents_bp = Blueprint('documents', __name__)
albums_bp = Blueprint('albums', __name__)


@news_bp.route('/', methods=['GET'])
def get_news() -> dict:
    """Retrieves all news items

    Returns:
        dict: News items
    """
    language_code = retrieve_languages(request.args)
    specific_author_id = request.args.get('author')

    if specific_author_id:
        return jsonify(
            get_items_from_author(Author.query.get(specific_author_id), News, language_code)
        ), 200
    
    return jsonify(get_items(News, language_code)), 200


@news_bp.route('/<string:url>', methods=['GET'])
def get_news_by_url(url: str) -> dict:
    """Retrieves a news item by URL

    Args:
        url (str): News URL

    Returns:
        dict: News item
    """
    language_code = retrieve_languages(request.args)

    return jsonify(get_item_by_url(url, News, language_code))


@news_bp.route('/student/<string:email>', methods=['GET'])
def get_news_by_student(email: str) -> dict:
    """Retrieves a news item by author

    Args:
        email (str): Author email

    Returns:
        dict: News item
    """
    provided_languages = retrieve_languages(request.args)
    author = get_author_from_email(entity_table=Student, entity_email=email)

    if not author:
        return jsonify({}), 404

    print('author', author.author_id, author.author_type, author.entity_id)
    return jsonify(get_items_from_author(author, News, provided_languages))


@news_bp.route('/', methods=['POST'])
def create_news() -> dict:
    """Creates a news item

    Returns:
        dict: News item
    """
    data: any = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    data: dict[str, any] = json.loads(json.dumps(data))

    if data.get('author') is None:
        return jsonify({'error': 'No author provided'}), 400

    author = data.get('author')

    author_table = None
    if author.get('author_type') == 'STUDENT':
        author_table = Student
    elif author.get('author_type') == 'COMMITTEE':
        author_table = Committee
    elif author.get('author_type') == 'COMMITTEE_POSITION':
        author_table = CommitteePosition
    else:
        return jsonify({'error': 'Invalid author type'}), 400

    if author_table is None:
        return jsonify({'error': 'Invalid author type'}), 400
    
    if author.get('entity_email') is None:
        return jsonify({'error': 'No email provided'}), 400

    return {'url': create_item(
        author_table=author_table,
        author_email=author.get('entity_email'),
        item_table=News,
        data=data
    )}, 201


@news_bp.route('/<string:url>', methods=['PUT'])
def update_news_by_url(url: str) -> dict:
    """Updates a news item and the translations
    It will try and create a translation entry if it doesn't exist

    Args:
        url (str): News URL

    Returns:
        dict: News item
    """
    data = request.get_json()
    langauge_code = retrieve_languages(request.args)

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    news_item: News | None = News.query.filter_by(url=url).first()

    if news_item is None:
        return jsonify({'error': 'News item not found'}), 404

    update_translations({f'{langauge_code}': data.get('translation', {})
    })

    news_item: News = news_item

    update_item(news_item)
    return news_item.to_dict(provided_languages=langauge_code, is_public_route=False), 200

@news_bp.route('/<string:url>/publish', methods=['PUT'])
def publish_news(url: str) -> dict:
    """Publishes a news item."""

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    news_item = News.query.filter_by(url=url).first()
    
    if not news_item:
        return jsonify({'error': 'News item not found'}), 404
    
    return jsonify(publish(news_item, data.get('translation'))), 201


@news_bp.route('/<string:url>', methods=['DELETE'])
def delete_news(url: str) -> dict:
    """Unpublishes a news item."""

    news_item = News.query.filter_by(url=url).first()

    if not news_item:
        return jsonify({'error': 'News item not found'}), 404
    
    delete_item(news_item, NewsTranslation)

    return jsonify({}), 200
    