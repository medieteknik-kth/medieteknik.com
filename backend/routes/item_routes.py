from flask import Blueprint, request, jsonify
from models.content import Author, News, NewsTranslation
from models.content.base import PublishedStatus
from utility.translation import retrieve_language, update_translation_or_create, normalize_to_ascii
from utility import database
from utility.constants import AVAILABLE_LANGUAGES
import uuid
import json
from typing import List
from datetime import datetime

db = database.db

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
    language_code = retrieve_language(request.args)

    news_items: List[News] = News.query.all()

    return jsonify([news_item.to_dict(language_code, is_public_route=False) for news_item in news_items])


@news_bp.route('/<string:url>', methods=['GET'])
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

    return jsonify(news_item.to_dict(language_code, is_public_route=False))


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

    if data.get('author_id') is None:
        return jsonify({'error': 'No author id provided'}), 400

    author: dict[str, any] = data.get('author_id')
    if Author.query.filter_by(author_type=author.get('author_type'), entity_id=author.get('entity_id')).first() is None:
        return jsonify({'error': 'Entity has no author rights '}), 400

    if not data.get('title'):
        data.update({'title': 'Untitled Article'})

    # Title conflict
    all_authors_news = News.query.filter_by(
        author_id=author.get('entity_id')).all()

    if all_authors_news:
        authors_news_ids = [news.news_id for news in all_authors_news]

        original_title = data.get('title')
        title_query = NewsTranslation.query.filter(
            NewsTranslation.news_id.in_(authors_news_ids),
            NewsTranslation.title == original_title,
        )

        count = 0
        new_title = original_title
        while title_query.count() > 0:
            count += 1
            new_title = f"{original_title} ({count})"

            title_query = NewsTranslation.query.filter(
                NewsTranslation.news_id.in_(authors_news_ids),
                NewsTranslation.title == new_title,
            )

        data.update({'title': new_title})

    if data.get('published_status') == PublishedStatus.DRAFT.value:
        url = uuid.uuid4()
        urlExists = News.query.filter_by(url=str(url)).first()
        while urlExists:
            url = uuid.uuid4()
            urlExists = News.query.filter_by(url=str(url)).first()
        data.update({'url': str(url)})

    news_item = News(
        categories=data.get('categories', []),
        created_at=data.get('created_at', None),
        last_updated=data.get('last_updated', None),
        is_pinned=data.get('is_pinned', False),
        is_public=data.get('is_public', True),
        published_status=data.get('published_status', PublishedStatus.DRAFT),
        url=data.get('url', ''),
        author_id=Author.query.filter_by(author_type=author.get(
            'author_type'), entity_id=author.get('entity_id')).first().author_id
    )

    db.session.add(news_item)

    db.session.flush()

    for language in AVAILABLE_LANGUAGES:
        translation = NewsTranslation(
            news_id=news_item.news_id,
            title=data.get('title', ''),
            body=data.get('body', ''),
            short_description=data.get('short_description', ''),
            main_image_url=data.get('main_image_url', ''),
            sub_image_urls=data.get('sub_image_urls', []),
            language_code=language
        )
        db.session.add(translation)

    db.session.commit()

    return {'url': data.get('url')}, 201


@news_bp.route('/<int:news_id>', methods=['PUT'])
def update_news_by_id(news_id: int) -> dict:
    """Updates a news item

    Args:
        news_id (int): News ID

    Returns:
        dict: News item
    """
    data = request.get_json()
    language_code = retrieve_language(request.args)

    news_item: News = News.query.get(news_id)

    for key, value in data.items():
        if key not in News.__table__.columns.keys():
            return jsonify({'error': 'Invalid key'}), 400
        if value is None:
            return jsonify({'error': 'Invalid value'}), 400
        setattr(news_item, key, value)

    db.session.commit()

    return jsonify(news_item.to_dict(language_code, is_public_route=False))


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
    langauge_code = retrieve_language(request.args)

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    news_item: News | None = News.query.filter_by(url=url).first()

    if news_item is None:
        return jsonify({'error': 'News item not found'}), 404

    data: dict[str, any] = json.loads(json.dumps(data))

    update_translation_or_create(
        db=db,
        translation_table=NewsTranslation,
        entries={
            'title': data.get('title'),
            'body': data.get('body'),
            'short_description': data.get('short_description'),
            'main_image_url': data.get('main_image_url'),
            'sub_image_urls': data.get('sub_image_urls'),
            'news_id': news_item.news_id,
            'language_code': langauge_code
        }
    )

    for key, value in data.items():
        if key not in News.__table__.columns.keys():
            continue
        setattr(news_item, key, value)

    db.session.commit()

    return jsonify(news_item.to_dict(language_code=data.get('language_code'), is_public_route=False)), 200


@news_bp.route('/<string:url>/publish', methods=['PUT'])
def publish_news(url: str) -> dict:
    """Publishes a news item."""

    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400

    news_item = News.query.filter_by(url=url).first()
    supported_languages = request.args.getlist('language')

    if not supported_languages:
        return jsonify({'error': 'No languages provided'}), 400
    if news_item is None:
        return jsonify({'error': 'News item not found'}), 404

    translation = NewsTranslation.query.filter_by(
        news_id=news_item.news_id,
    ).first()

    if not translation:
        return jsonify({'error': 'Translation not found'}), 404

    for language in AVAILABLE_LANGUAGES:  # TODO: Add Multiple language support
        translation: NewsTranslation | None = NewsTranslation.query.filter_by(
            news_id=news_item.news_id,
            language_code=language
        ).first()
        translation.title = data.get('title')
        translation.body = data.get('body')
        translation.short_description = data.get('short_description')
        translation.main_image_url = data.get('main_image_url', '')
        translation.sub_image_urls = data.get('sub_image_urls', '')

    db.session.add(translation)
    db.session.flush()

    new_url = normalize_to_ascii(data.get('title')).split(' ')
    new_url = '-'.join(new_url) + '-' + datetime.now().strftime('%Y-%m-%d')
    new_url = new_url.lower()

    news_item.url = new_url
    news_item.categories = data.get('categories', [])
    news_item.is_public = True
    news_item.created_at = datetime.now()
    news_item.published_status = PublishedStatus.PUBLISHED

    db.session.add(news_item)
    db.session.commit()

    return {'url': news_item.url}, 201


@news_bp.route('/<int:news_id>', methods=['DELETE'])
def delete_news(news_id: int) -> dict:
    """Deletes a news item

    Args:
        news_id (int): News ID

    Returns:
        dict: Success message
    """
    news_item: News = News.query.get(news_id)

    db.session.delete(news_item)
    db.session.commit()

    return jsonify({'message': 'News item deleted'}, 204)
