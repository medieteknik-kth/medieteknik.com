import enum
from utility import database
from sqlalchemy import Column, Integer, DateTime, String, UUID, Enum, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import ARRAY
from models.student import Student
from models.committee import CommitteePosition, Committee
from utility.constants import DEFAULT_LANGUAGE_CODE
from utility.translation import get_translation

db = database.db

# TODO: Annoucements?


class EventStatus(enum.Enum):
    UPCOMING = 'UPCOMING'
    ONGOING = 'ONGOING'
    PAST = 'PAST'


class PublishedStatus(enum.Enum):
    DRAFT = 'DRAFT'
    PUBLISHED = 'PUBLISHED'


class AuthorType(enum.Enum):
    STUDENT = 'STUDENT'
    COMMITTEE = 'COMMITTEE'
    COMMITTEE_POSITION = 'COMMITTEE_POSITION'


class Author(db.Model):
    __tablename__ = 'author'

    author_id = Column(Integer, primary_key=True, autoincrement=True)

    author_type = Column(Enum(AuthorType), nullable=False)
    entity_id = Column(Integer, nullable=False, index=True)

    def __init__(self, author_type, entity_id):
        self.author_type = author_type
        self.entity_id = entity_id

    def to_dict(self):
        return {
            'author_id': self.author_id,
            'author_type': self.author_type.value,
            'entity_id': self.entity_id
        }

    def retrieve_author(self):
        author_class = {
            AuthorType.STUDENT: Student,
            AuthorType.COMMITTEE: Committee,
            AuthorType.COMMITTEE_POSITION: CommitteePosition
        }.get(self.author_type)

        if author_class:
            return author_class.query.get(self.entity_id)
        else:
            raise ValueError('Author type not found')


class Event(db.Model):
    __tablename__ = 'event'

    event_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    categories = Column(ARRAY(String))
    status = Column(Enum(EventStatus),
                    default=EventStatus.UPCOMING, nullable=False)
    published_status = Column(Enum(PublishedStatus),
                              default=PublishedStatus.DRAFT, nullable=False)
    location = Column(String(255))
    is_public = Column(Boolean, default=True, nullable=False)
    url = Column(String(255))

    # Foreign keys
    author_id = Column(Integer, ForeignKey('author.author_id'))

    # Relationships
    author = db.relationship('Author', backref='event')

    def __init__(self, created_at, last_updated, start_date, end_date, categories, status, published_status, location, is_public, url, author_id):
        self.created_at = created_at
        self.last_updated = last_updated
        self.start_date = start_date
        self.end_date = end_date
        self.categories = categories
        self.status: EventStatus = status
        self.published_status: PublishedStatus = published_status
        self.location = location
        self.is_public = is_public
        self.url = url
        self.author_id = author_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True, summary=False):
        translation: EventTranslation | None = get_translation(
            EventTranslation,
            ['event_id'],
            {'event_id': self.event_id},
            language_code
        )

        if not self.is_public and is_public_route:
            return None

        if summary:
            return {
                'event_id': self.event_id,
                'created_at': self.created_at,
                'last_updated': self.last_updated,
                'start_date': self.start_date,
                'end_date': self.end_date,
                'categories': self.categories,
                'status': self.status.value,
                'published_status': self.published_status.value,
                'location': self.location,
                'url': self.url,
                'author_id': self.author_id,
                'title': translation.title if translation else 'Error: No translation found',
                'short_description': translation.short_description if translation else 'Error: No translation found',
                'main_image_url': translation.main_image_url if translation else 'Error: No translation found'
            }

        return {
            'event_id': self.event_id,
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'categories': self.categories,
            'status': self.status.value,
            'published_status': self.published_status.value,
            'location': self.location,
            'url': self.url,
            'author_id': self.author_id,
            'title': translation.title if translation else 'Error: No translation found',
            'body': translation.body if translation else 'Error: No translation found',
            'short_description': translation.short_description if translation else 'Error: No translation found',
            'main_image_url': translation.main_image_url if translation else 'Error: No translation found',
            'sub_image_urls': translation.sub_image_urls if translation else 'Error: No translation found'
        }


class News(db.Model):
    __tablename__ = 'news'

    news_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    categories = Column(ARRAY(String))
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)
    published_status = Column(Enum(PublishedStatus),
                              default=PublishedStatus.DRAFT, nullable=False)
    url = Column(String(255))

    # Foreign keys
    author_id = Column(Integer, ForeignKey('author.author_id'))

    # Relationships
    author = db.relationship('Author', backref='news')

    def __init__(self, created_at, last_updated, categories, is_pinned, is_public, published_status, url, author_id):
        self.created_at = created_at
        self.last_updated = last_updated
        self.categories = categories
        self.is_pinned = is_pinned
        self.is_public = is_public
        self.published_status: PublishedStatus = published_status
        self.url = url
        self.author_id = author_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True, summary=False):
        translation: NewsTranslation | None = get_translation(
            NewsTranslation,
            ['news_id'],
            {'news_id': self.news_id},
            language_code
        )

        if not self.is_public and is_public_route:
            return None

        author_entity: Author | None = Author.query.filter_by(
            author_id=self.author_id).first()

        if not author_entity:
            return None

        author_entity: Author = author_entity

        author_type: AuthorType = author_entity.author_type
        author: Committee | Student | CommitteePosition | None = None
        author_dict = {}

        if author_type == AuthorType.COMMITTEE:
            author: Committee | None = Committee.query.get(
                author_entity.entity_id)
            if author:
                author_dict = author.to_dict(is_public_route=False)
                author_dict.update({'author_type': author_type.value})

        elif author_type == AuthorType.COMMITTEE_POSITION:
            author: CommitteePosition | None = CommitteePosition.query.get(
                author_entity.entity_id)
            if author:
                author_dict = author.to_dict(is_public_route=False)
                author_dict.update({'author_type': author_type.value})

        elif author_type == AuthorType.STUDENT:
            author: Student | None = Student.query.get(author_entity.entity_id)
            if author:
                author_dict = author.to_dict(is_public_route=False)
                author_dict.update({'author_type': author_type.value})

        if not author:
            return None

        print(author_dict)

        if summary:
            return {
                'news_id': self.news_id,
                'created_at': self.created_at,
                'last_updated': self.last_updated,
                'categories': self.categories,
                'is_pinned': self.is_pinned,
                'is_public': self.is_public,
                'published_status': self.published_status.value,
                'url': self.url,
                'author': author_dict,
                'title': translation.title if translation else 'Error: No translation found',
                'short_description': translation.short_description if translation else 'Error: No translation found',
                'main_image_url': translation.main_image_url if translation else 'Error: No translation found'
            }

        return {
            'news_id': self.news_id,
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'categories': self.categories,
            'is_pinned': self.is_pinned,
            'is_public': self.is_public,
            'published_status': self.published_status.value,
            'url': self.url,
            'author': author_dict,
            'title': translation.title if translation else 'Error: No translation found',
            'body': translation.body if translation else 'Error: No translation found',
            'short_description': translation.short_description if translation else 'Error: No translation found',
            'main_image_url': translation.main_image_url if translation else 'Error: No translation found',
            'sub_image_urls': translation.sub_image_urls if translation else 'Error: No translation found'
        }


class Album(db.Model):
    __tablename__ = 'album'

    album_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    categories = Column(ARRAY(String))
    media_urls = Column(ARRAY(String))
    is_public = Column(Boolean, default=True, nullable=False)

    # Foreign keys
    author_id = Column(Integer, ForeignKey('author.author_id'))

    # Relationships
    author = db.relationship('Author', backref='album')

    def __init__(self, created_at, last_updated, categories, media_urls, is_public, author_id):
        self.created_at = created_at
        self.last_updated = last_updated
        self.categories = categories
        self.media_urls = media_urls
        self.is_public = is_public
        self.author_id = author_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: AlbumTranslation | None = get_translation(
            AlbumTranslation,
            ['album_id'],
            {'album_id': self.album_id},
            language_code
        )

        if not self.is_public and is_public_route:
            return None

        return {
            'album_id': self.album_id,
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'categories': self.categories,
            'media_urls': self.media_urls,
            'is_public': self.is_public,
            'author_id': self.author_id,
            'title': translation.title if translation else 'Error: No translation found',
            'description': translation.description if translation else 'Error: No translation found'
        }


class Document(db.Model):
    __tablename__ = 'document'

    document_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    created_at = Column(DateTime)
    last_updated = Column(DateTime)
    categories = Column(ARRAY(String))
    file_url = Column(String(255), nullable=False)
    is_pinned = Column(Boolean, default=False, nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)

    # Foreign keys
    author_id = Column(Integer, ForeignKey('author.author_id'))

    # Relationships
    author = db.relationship('Author', backref='document')

    def __init__(self, created_at, last_updated, categories, file_url, is_pinned, is_public, author_id):
        self.created_at = created_at
        self.last_updated = last_updated
        self.categories = categories
        self.file_url = file_url
        self.is_pinned = is_pinned
        self.is_public = is_public
        self.author_id = author_id

    def to_dict(self, language_code=DEFAULT_LANGUAGE_CODE, is_public_route=True):
        translation: DocumentTranslation | None = get_translation(
            DocumentTranslation,
            ['document_id'],
            {'document_id': self.document_id},
            language_code
        )

        if not self.is_public and is_public_route:
            return None

        return {
            'document_id': self.document_id,
            'created_at': self.created_at,
            'last_updated': self.last_updated,
            'categories': self.categories,
            'file_url': self.file_url,
            'is_pinned': self.is_pinned,
            'is_public': self.is_public,
            'author_id': self.author_id,
            'title': translation.title if translation else 'Error: No translation found',
            'description': translation.description if translation else 'Error: No translation found'
        }

# Translations


class EventTranslation(db.Model):
    __tablename__ = 'event_translation'

    event_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    body = Column(String(2500))
    short_description = Column(String(255))
    main_image_url = Column(String(255))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    event_id = Column(Integer, ForeignKey('event.event_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    event = db.relationship('Event', backref='translation')
    language = db.relationship('Language', backref='event_translation')

    def __init__(self, title, body, short_description, main_image_url, sub_image_urls, event_id, language_code):
        self.title = title
        self.body = body
        self.short_description = short_description
        self.main_image_url = main_image_url
        self.sub_image_urls = sub_image_urls
        self.event_id = event_id
        self.language_code = language_code

    def to_dict(self):
        return {
            'event_translation_id': self.event_translation_id,
            'title': self.title,
            'body': self.body,
            'short_description': self.short_description,
            'main_image_url': self.main_image_url,
            'sub_image_urls': self.sub_image_urls,
            'event_id': self.event_id,
            'language_code': self.language_code
        }


class NewsTranslation(db.Model):
    __tablename__ = 'news_translation'

    news_translation_id = Column(Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    body = Column(String(2500))
    short_description = Column(String(255))
    main_image_url = Column(String(255))
    sub_image_urls = Column(ARRAY(String))

    # Foreign keys
    news_id = Column(Integer, ForeignKey('news.news_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    news = db.relationship('News', backref='translation')
    language = db.relationship('Language', backref='news_translation')

    def __init__(self, title, body, short_description, main_image_url, sub_image_urls, news_id, language_code):
        self.title = title
        self.body = body
        self.short_description = short_description
        self.main_image_url = main_image_url
        self.sub_image_urls = sub_image_urls
        self.news_id = news_id
        self.language_code = language_code

    def to_dict(self):
        return {
            'news_translation_id': self.news_translation_id,
            'title': self.title,
            'body': self.body,
            'short_description': self.short_description,
            'main_image_url': self.main_image_url,
            'sub_image_urls': self.sub_image_urls,
            'news_id': self.news_id,
            'language_code': self.language_code
        }


class AlbumTranslation(db.Model):
    __tablename__ = 'album_translation'

    album_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    description = Column(String(2500))

    # Foreign keys
    album_id = Column(Integer, ForeignKey('album.album_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    album = db.relationship('Album', backref='translation')
    language = db.relationship('Language', backref='album_translation')

    def __init__(self, title, description, album_id, language_code):
        self.title = title
        self.description = description
        self.album_id = album_id
        self.language_code = language_code

    def to_dict(self):
        return {
            'album_translation_id': self.album_translation_id,
            'title': self.title,
            'description': self.description,
            'album_id': self.album_id,
            'language_code': self.language_code
        }


class DocumentTranslation(db.Model):
    __tablename__ = 'document_translation'

    document_translation_id = Column(
        Integer, primary_key=True, autoincrement=True)

    title = Column(String(255))
    categories = Column(ARRAY(String))

    # Foreign keys
    document_id = Column(Integer, ForeignKey('document.document_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))

    # Relationships
    document = db.relationship('Document', backref='translation')
    language = db.relationship('Language', backref='document_translation')

    def __init__(self, title, categories, document_id, language_code):
        self.title = title
        self.categories = categories
        self.document_id = document_id
        self.language_code = language_code

    def to_dict(self):
        return {
            'document_translation_id': self.document_translation_id,
            'title': self.title,
            'categories': self.categories,
            'document_id': self.document_id,
            'language_code': self.language_code
        }


class RepeatableEvents(db.Model):
    __tablename__ = 'repeatable_events'

    repeatable_event_id = Column(Integer, primary_key=True, autoincrement=True)

    # Metadata
    reapeting_interval = Column(String(255))

    # Foreign keys
    event_id = Column(Integer, ForeignKey('event.event_id'))

    # Relationships
    event = db.relationship('Event', backref='repeatable_events')
