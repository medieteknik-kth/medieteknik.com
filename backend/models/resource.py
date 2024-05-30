import enum
from utility import database
from sqlalchemy import String, Integer, Column, Boolean, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import ARRAY
from utility.constants import ROUTES
from utility.translation import get_translation

db = database.db

class Content(db.Model):
    __tablename__ = 'content'
    content_id = Column(Integer, primary_key=True, autoincrement=True)
    
    image_urls = Column(ARRAY(String))

    def __init__(self, image_urls):
        self.image_urls = image_urls
        
    def __repr__(self):
        return '<Content %r>' % self.content_id
    
    def to_dict(self, language_code='se'):
        translations: ContentTranslation | None = get_translation(
            ContentTranslation,
            ['content_id'],
            {'content_id': self.content_id},
            language_code
        )
        return {
            'content_id': self.content_id,
            'image_urls': self.image_urls,
            'title': translations.title if translations else 'Error: No translation found',
            'description': translations.description if translations else 'Error: No translation found',
        }

class Resource(db.Model):
    __tablename__ = 'resource'
    resource_id = Column(Integer, primary_key=True, autoincrement=True)
    
    route = Column(String(255), unique=True)
    category = Column(Enum(ROUTES))
    is_public = Column(Boolean, default=True, nullable=False)
    
    # Foreign keys
    content_id = Column(Integer, ForeignKey('content.content_id'))
    
    # Relationships
    content = db.relationship('Content', backref='resource')
    
    def __init__(self, route, is_public, category, content_id):
        self.route = route
        self.is_public = is_public
        self.category: ROUTES = category
        self.content_id = content_id
        
    def __repr__(self):
        return '<Resource %r>' % self.resource_id
    
    def to_dict(self, is_public_route=True):
        if is_public_route:
            return {
                'resource_id': self.resource_id,
                'route': self.route,
                'category': self.category.value if self.category else None,
            }
        
        return {
            'resource_id': self.resource_id,
            'route': self.route,
            'is_public': self.is_public,
            'category': self.category.value if self.category else None,
            'content_id': self.content_id
        }
    
# Translations

class ContentTranslation(db.Model):
    __tablename__ = 'content_translation'
    content_translation_id = Column(Integer, primary_key=True, autoincrement=True)
    
    title = Column(String(255))
    bodies = Column(ARRAY(String))
    
    # Foreign keys
    content_id = Column(Integer, ForeignKey('content.content_id'))
    language_code = Column(String(20), ForeignKey('language.language_code'))
    
    # Relationships
    content = db.relationship('Content', backref='content_translations')
    language = db.relationship('Language', backref='content_translations')
    
    def __init__(self, content_id, title, bodies, language_code):
        self.content_id = content_id
        self.title = title
        self.bodies = bodies
        self.language_code = language_code
        
    def __repr__(self):
        return '<ContentTranslation %r>' % self.content_translation_id
    
    def to_dict(self):
        return {
            'content_translation_id': self.content_translation_id,
            'title': self.title,
            'bodies': self.bodies,
            'content_id': self.content_id,
            'language_code': self.language_code
        }